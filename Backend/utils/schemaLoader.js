import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadSchema = () => {
  const schemaPath = path.resolve(
    __dirname,
    "../../../samples/gets_v0_1_schema.json"
  );
  const rawSchema = fs.readFileSync(schemaPath, "utf8");
  const schemaData = JSON.parse(rawSchema);
  return schemaData.fields.map((field) => field.path);
};

export const createFieldMapping = (firstRow) => {
  const fieldMap = new Map();
  const dataKeys = Object.keys(firstRow);

  for (const key of dataKeys) {
    const normalizedKey = normalizeFieldName(key);
    fieldMap.set(normalizedKey, key);
  }

  return fieldMap;
};

export const addNestedLineFields = (fieldMap, firstRow) => {
  if (
    Array.isArray(firstRow.lines) &&
    firstRow.lines.length > 0 &&
    firstRow.lines[0] &&
    typeof firstRow.lines[0] === "object"
  ) {
    const firstLineItem = firstRow.lines[0];
    const lineKeys = Object.keys(firstLineItem);

    for (const lineKey of lineKeys) {
      const nestedKey = `lines.${lineKey}`;
      const normalizedNestedKey = normalizeFieldName(nestedKey);
      fieldMap.set(normalizedNestedKey, nestedKey);
    }
  }

  return fieldMap;
};

const normalizeFieldName = (fieldName) => {
  return String(fieldName || "")
    .toLowerCase()
    .replace(/[^_a-z0-9\.\[\]]/g, "");
};
