import { useState } from "react";
import "./App.css";
import Stepper from "./components/Stepper";
import TablePreview from "./components/TablePreview";
import ScoreBars from "./components/ScoreBars";
import CoveragePanel from "./components/CoveragePanel";
import { downloadReport } from "./utils/download";
import { doAnalyze } from "./utils/analysis";
import { doUpload } from "./utils/upload";
const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ country: "", erp: "" });
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploadId, setUploadId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <div>
        {" "}
        <div>
          <h1>E‑Invoicing Readiness & Gap Analyzer</h1>
          <Stepper step={step} />

          {step === 0 && (
            <div
              style={{ maxWidth: "15rem", margin: "0 auto", textAlign: "left" }}
            >
              <label>
                Country
                <br />
                <input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="UAE"
                />
              </label>
              <br />
              <label>
                ERP
                <br />
                <input
                  value={form.erp}
                  onChange={(e) => setForm({ ...form, erp: e.target.value })}
                  placeholder="SAP"
                />
              </label>
              <div style={{ marginTop: 16 }}>
                <button onClick={() => setStep(1)}>Next</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}>
              <div>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste CSV or JSON here"
                  rows={10}
                  style={{ width: "100%", fontFamily: "monospace" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  disabled={loading}
                  onClick={() =>
                    doUpload(
                      setError,
                      setLoading,
                      file,
                      API_BASE,
                      text,
                      setUploadId,
                      setStep
                    )
                  }
                >
                  {loading ? "Uploading…" : "Upload"}
                </button>
                <button onClick={() => setStep(0)}>Back</button>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          )}

          {step === 2 && (
            <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "left" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div>
                  Upload ID: <code>{uploadId}</code>
                </div>
                <button
                  disabled={!uploadId || loading}
                  onClick={() =>
                    doAnalyze(setError, setLoading, API_BASE, setReport)
                  }
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
                <button onClick={() => setStep(1)}>Back</button>
              </div>

              {report ? (
                <div style={{ marginTop: 16 }}>
                  <h2>Table Preview</h2>
                  <TablePreview rows={report.preview || []} />

                  <h2>Scores</h2>
                  <ScoreBars scores={report.scores} />

                  <h2>Coverage</h2>
                  <CoveragePanel coverage={report.coverage} />

                  {report.ruleFindings?.length > 0 && (
                    <>
                      <h2>Rule Findings</h2>
                      <ul>
                        {report.ruleFindings.map((r) => (
                          <li key={r.rule}>
                            <strong>{r.rule}:</strong> {r.ok ? "PASS" : "FAIL"}{" "}
                            {!r.ok && r.exampleLine && (
                              <span>
                                (exampleLine {r.exampleLine}, expected{" "}
                                {r.expected}, got {r.got})
                              </span>
                            )}
                            {!r.ok && r.value && (
                              <span>(value {String(r.value)})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h2>Actions</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => downloadReport(report)}>
                      Download JSON
                    </button>
                    <button
                      onClick={() => {
                        if (API_BASE && report.reportId) {
                          navigator.clipboard.writeText(
                            `${API_BASE}/report/${report.reportId}`
                          );
                          alert("Copied to clipboard");
                        } else {
                          alert("Something went wrong, try refreshing");
                        }
                      }}
                    >
                      Copy shareable link
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ marginTop: 16 }}>
                  No report yet. Click "Analyze" to fetch results.
                </p>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
