import {
  addNestedLineFields,
  createFieldMapping,
  loadSchema,
} from "./schemaLoader.js";
import { isTypeCompatible, isAliasMatch } from "./fieldMatcher.js";

export const analyzeCoverage = (dataRows) => {
  const schemaTargets = loadSchema();
  const firstRow = dataRows[0] || {};

  const fieldMapping = createFieldMapping(firstRow);
  addNestedLineFields(fieldMapping, firstRow);

  const usedSourceFields = new Set();
  const matchedFields = [];
  const closeMatches = [];
  const missingFields = [];

  for (const targetPath of schemaTargets) {
    const matchResult = findBestMatch(
      targetPath,
      fieldMapping,
      firstRow,
      usedSourceFields
    );

    if (matchResult.type === "exact") {
      matchedFields.push(targetPath);
      usedSourceFields.add(matchResult.sourceField);
    } else if (matchResult.type === "close") {
      closeMatches.push({
        target: targetPath,
        candidate: matchResult.sourceField,
        confidence: matchResult.confidence,
      });
      usedSourceFields.add(matchResult.sourceField);
    } else {
      missingFields.push(targetPath);
    }
  }

  return {
    matched: matchedFields,
    close: closeMatches,
    missing: missingFields,
  };
};

const findBestMatch = (targetPath, fieldMapping, firstRow, usedFields) => {
  const normalizedTarget = normalizeFieldName(targetPath.replace(/\[\]/g, ""));
  let exactMatch = null;
  let closeMatch = null;
  let bestCloseScore = -1;

  for (const [normalizedKey, originalKey] of fieldMapping.entries()) {
    if (usedFields.has(originalKey)) continue;
    if (!isTypeCompatible(targetPath, firstRow[originalKey])) continue;

    if (originalKey === targetPath) {
      exactMatch = originalKey;
      break;
    }

    const closeScore = calculateCloseMatchScore(
      normalizedKey,
      normalizedTarget,
      targetPath
    );
    if (closeScore > bestCloseScore) {
      bestCloseScore = closeScore;
      closeMatch = originalKey;
    }
  }

  if (exactMatch) {
    return { type: "exact", sourceField: exactMatch };
  } else if (closeMatch && bestCloseScore >= 0) {
    return {
      type: "close",
      sourceField: closeMatch,
      confidence: bestCloseScore,
    };
  } else {
    return { type: "missing" };
  }
};

const calculateCloseMatchScore = (sourceKey, targetKey, targetPath) => {
  if (isAliasMatch(sourceKey, targetPath)) {
    return 0.9;
  }

  if (
    sourceKey.startsWith(targetKey) ||
    targetKey.startsWith(sourceKey) ||
    sourceKey.includes(targetKey) ||
    targetKey.includes(sourceKey)
  ) {
    return 0.6;
  }

  return -1;
};

const normalizeFieldName = (fieldName) => {
  return String(fieldName || "")
    .toLowerCase()
    .replace(/[^_a-z0-9\.\[\]]/g, "");
};
