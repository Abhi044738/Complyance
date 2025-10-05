export const doUpload = async (
  setError,
  setLoading,
  file,
  API_BASE,
  text,
  setUploadId,
  setStep
) => {
  setError("");
  setLoading(true);
  try {
    let res;
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("country", form.country);
      fd.append("erp", form.erp);
      res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
    } else if (text.trim()) {
      res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, country: form.country, erp: form.erp }),
      });
    } else {
      setError("Provide a file or paste text");
      setLoading(false);
      return;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    setUploadId(json.uploadId);
    setStep(2);
  } catch (e) {
    setError(String(e.message || e));
  } finally {
    setLoading(false);
  }
};
