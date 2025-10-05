import Report from "../models/Report.js";
import {
  renderReportHtml,
  renderReportListHtml,
} from "../utils/renderReport.js";

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).lean();

    if (!report) {
      return res.status(404).json({ error: "report_not_found" });
    }

    const reportJson = report.reportJson || report;

    if (req.accepts("html")) {
      const html = renderReportHtml(reportJson);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(html);
    }
    return res.json(reportJson);
  } catch (error) {
    return res.status(500).json({
      error: "fetch_report_failed",
      detail: String(error?.message || error),
    });
  }
};

export const listReports = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const reports = await Report.find(
      {},
      { _id: 1, createdAt: 1, scoresOverall: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const reportList = reports.map((report) => ({
      id: report._id,
      createdAt: report.createdAt,
      overall: report.scoresOverall,
    }));

    if (req.accepts("html")) {
      const html = renderReportListHtml(reportList);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(html);
    }

    return res.json(reportList);
  } catch (error) {
    return res.status(500).json({
      error: "list_reports_failed",
      detail: String(error?.message || error),
    });
  }
};
