export const doAnalyze = async (setError, setLoading, API_BASE, setReport) => {
  setError("");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        questionnaire: { webhooks: true, sandbox_env: true, retries: false },
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Analyze failed");
    setReport(json);
  } catch (e) {
    setError(String(e.message || e));
  } finally {
    setLoading(false);
  }
};
