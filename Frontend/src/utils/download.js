export const downloadReport = (report) => {
  if (!report) return;
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `report_${report.reportId}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
