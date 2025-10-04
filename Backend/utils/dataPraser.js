import { parse } from "csv-parse/sync";

const MAX_ROWS_LIMIT = 200;

export const inferDataType = (value) => {
  if (value === null || value === undefined || value === "") {
    return "empty";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue) && /^-?\d+(\.\d+)?$/.test(String(value))) {
    return "number";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return "date";
  }

  return "text";
};

const parseJsonData = (text) => {
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : [parsed];
};

const parseCsvData = (text) => {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
};

const isJsonFormat = (text) => {
  const trimmed = text.trim();
  return trimmed.startsWith("[") || trimmed.startsWith("{");
};

const calculateTypeStatistics = (dataRows) => {
  const typeStats = {
    number: 0,
    date: 0,
    text: 0,
    empty: 0,
    totalCells: 0,
  };

  for (const row of dataRows) {
    for (const value of Object.values(row)) {
      const dataType = inferDataType(value);
      typeStats[dataType] = (typeStats[dataType] || 0) + 1;
      typeStats.totalCells += 1;
    }
  }

  return typeStats;
};

const countLineItems = (dataRows) => {
  let totalLineItems = 0;

  for (const row of dataRows) {
    const lineItems = Array.isArray(row.lines) ? row.lines : [];
    totalLineItems += lineItems.length;
  }

  return totalLineItems;
};

export const parseInputData = (inputText) => {
  const trimmedText = inputText.trim();
  let parsedRows = [];

  if (isJsonFormat(trimmedText)) {
    parsedRows = parseJsonData(trimmedText);
  } else {
    parsedRows = parseCsvData(trimmedText);
  }

  if (parsedRows.length > MAX_ROWS_LIMIT) {
    parsedRows = parsedRows.slice(0, MAX_ROWS_LIMIT);
  }

  const normalizedRows = parsedRows.map((row) => ({ ...row }));

  const typeStats = calculateTypeStatistics(normalizedRows);
  const totalLineItems = countLineItems(normalizedRows);

  return {
    rows: normalizedRows,
    linesTotal: totalLineItems,
    typeStats,
  };
};
