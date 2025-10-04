import Report from "../models/Report.js";

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).lean();

    if (!report) {
      return res.status(404).json({ error: "report_not_found" });
    }

    return res.json(report.reportJson);
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

    return res.json(reportList);
  } catch (error) {
    return res.status(500).json({
      error: "list_reports_failed",
      detail: String(error?.message || error),
    });
  }
};
