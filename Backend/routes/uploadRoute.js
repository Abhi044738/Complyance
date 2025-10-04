import { nanoid } from "nanoid";
import Upload from "../models/Upload.js";
import Report from "../models/Report.js";
import { parseInputData } from "../utils/dataPraser.js";
import { analyzeCoverage } from "../utils/converageAnalyzer.js";
import { runAllValidationRules } from "../utils/validationRules.js";
import { computeReadinessScores } from "../utils/scoreCalculator.js";

export const handleFileUpload = async (req, res) => {
  try {
    let textContent = "";
    let country = req.body.country || null;
    let erp = req.body.erp || null;

    if (req.file && req.file.buffer) {
      textContent = req.file.buffer.toString("utf8");
    } else if (
      req.is("application/json") &&
      req.body &&
      typeof req.body.text === "string"
    ) {
      textContent = req.body.text;
      //   country = req.body.country || country;
      //   erp = req.body.erp || erp;
    } else {
      return res.status(400).json({
        error: "Error  in file upload or json text",
      });
    }

    const uploadId = `u_${nanoid(8)}`;
    const uploadRecord = await Upload.create({
      _id: uploadId,
      country,
      erp,
      rawText: textContent,
      createdAt: new Date(),
    });

    return res.json({ uploadId: uploadRecord._id });
  } catch (error) {
    return res.status(500).json({
      error: "upload_failed",
      detail: String(error?.message || error),
    });
  }
};

export const handleDataAnalysis = async (req, res) => {
  try {
    const { uploadId, questionnaire } = req.body || {};

    if (!uploadId) {
      return res.status(400).json({ error: "missing_uploadId" });
    }

    const uploadRecord = await Upload.findById(uploadId).lean();
    if (!uploadRecord) {
      return res.status(404).json({ error: "upload_not_found" });
    }

    const parseResult = await parseInputData(uploadRecord.rawText);
    const { rows, linesTotal, typeStats } = parseResult;

    const coverage = await analyzeCoverage(rows);
    const ruleFindings = await runAllValidationRules(rows);
    const scores = computeReadinessScores({
      rowsParsed: rows.length,
      linesTotal,
      typeStats,
      coverage,
      ruleFindings,
      questionnaire: questionnaire || {},
    });

    const reportId = `r_${nanoid(8)}`;
    const reportData = {
      reportId,
      scores,
      coverage: {
        matched: coverage.matched,
        close: coverage.close,
        missing: coverage.missing,
      },
      ruleFindings,
      gaps: deriveDataGaps({ coverage, ruleFindings }),
      preview: rows.slice(0, 20),
      meta: {
        rowsParsed: rows.length,
        linesTotal,
        country: uploadRecord.country || null,
        erp: uploadRecord.erp || null,
        db: "mongodb",
      },
    };

    await Report.create({
      _id: reportId,
      uploadId: uploadRecord._id,
      createdAt: new Date(),
      scoresOverall: scores.overall,
      reportJson: reportData,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return res.json(reportData);
  } catch (error) {
    return res.status(500).json({
      error: "analyze_failed",
      detail: String(error?.message || error),
    });
  }
};

const deriveDataGaps = ({ coverage, ruleFindings }) => {
  const gaps = [];

  for (const missingField of coverage.missing) {
    gaps.push(`Missing ${missingField}`);
  }

  for (const ruleFinding of ruleFindings) {
    if (!ruleFinding.ok) {
      if (ruleFinding.rule === "CURRENCY_ALLOWED" && ruleFinding.value) {
        gaps.push(`Invalid currency ${ruleFinding.value}`);
      } else if (ruleFinding.rule === "DATE_ISO") {
        gaps.push("Invalid date format");
      } else if (ruleFinding.rule === "LINE_MATH") {
        gaps.push("Line math mismatch");
      } else if (ruleFinding.rule === "TOTALS_BALANCE") {
        gaps.push("Totals do not balance");
      } else if (ruleFinding.rule === "TRN_PRESENT") {
        gaps.push("Missing TRN(s)");
      }
    }
  }

  return gaps;
};
