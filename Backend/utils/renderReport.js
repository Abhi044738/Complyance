const escapeHtml = (str) =>
  String(str === undefined || str === null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const renderReportListHtml = (reportList = []) => {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reports</title>
  <style>
    body{font-family: system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:20px;background-color: #242424; color:rgba(255, 255, 255, 0.87)}
    .card{ background-color:#1a1a1a;border-radius:8px;padding:12px;margin:8px 0}
    .card:hover{border:1px solid #e6e6e6;}
    a { color: #0366d6; text-decoration: none }
    a:hover { text-decoration: underline }
    .meta { color:#6b7280; font-size:0.9rem }
  </style>
</head>
<body>
  <h1>Reports</h1>
  <p>Total : ${reportList.length}</p>
  <div>
    ${reportList
      .map(
        (r) => `
      <div class="card">
        <div><strong><a href="/report/${escapeHtml(r.id)}">Report ${escapeHtml(
          r.id
        )}</a></strong></div>
        <div class="meta">Created: ${escapeHtml(
          new Date(r.createdAt).toLocaleString()
        )} • Overall: ${escapeHtml((r.overall ?? "—").toString())}</div>
      </div>`
      )
      .join("\n")}
  </div>
</body>
</html>`;
};

export const renderReportHtml = (reportJson) => {
  const previewRows = Array.isArray(reportJson.preview)
    ? reportJson.preview
    : [];
  const scores = reportJson.scores || reportJson.scores || {};
  const coverage = reportJson.coverage || {};
  const ruleFindings = Array.isArray(reportJson.ruleFindings)
    ? reportJson.ruleFindings
    : [];

  const cols = Array.from(
    new Set(
      previewRows.flatMap((r) =>
        r && typeof r === "object" ? Object.keys(r) : []
      )
    )
  ).slice(0, 12);

  const prettyJson = escapeHtml(JSON.stringify(reportJson, null, 2));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Report ${escapeHtml(reportJson.reportId || "")}</title>
  <style>
    body{background-color: #242424;color:rgba(255, 255, 255, 0.87);font-family: system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:20px; }
    h1,h2{margin:8px 0}
    .grid{display:grid;grid-template-columns:1fr 320px;gap:20px}
    .card{border:1px solid #e6e6e6;border-radius:8px;padding:12px}
    table{width:100%;border-collapse:collapse;font-size:0.9rem}
    th,td{padding:8px;border-bottom:1px solid #f0f0f0;text-align:left}
    .small{font-size:0.9rem;color:#6b7280}
    .pill{display:inline-block;padding:4px 8px;border-radius:999px;background:#111827;font-size:0.8rem}
    pre{background:#0f172a;color:#fff;padding:12px;border-radius:6px;overflow:auto}
    a.button{display:inline-block;padding:8px 12px;border-radius:6px;background:#111827;color:#fff;text-decoration:none}
  </style>
</head>
<body>
  <header style="display:flex;align-items:center;justify-content:space-between;gap:12px">
    <div>
      <h1>Report ${escapeHtml(reportJson.reportId || "")}</h1>
      <div class="small">Generated: ${escapeHtml(
        new Date(reportJson.createdAt || Date.now()).toLocaleString()
      )}</div>
    </div>
    <div>
      <a class="button" href="/api/report/${escapeHtml(
        reportJson.reportId || ""
      )}?raw=1" target="_blank">Download JSON</a>
    </div>
  </header>

  <section class="grid" style="margin-top:1rem">
    <div>
      
      <div class="card" >
        <h2>Preview (top ${Math.min(previewRows.length, 20)})</h2>
        ${
          previewRows.length === 0
            ? "<p class='small'>No preview available.</p>"
            : `<div style="overflow:auto"><table>
              <thead><tr>${cols
                .map((c) => `<th>${escapeHtml(c)}</th>`)
                .join("")}</tr></thead>
              <tbody>
                ${previewRows
                  .slice(0, 20)
                  .map(
                    (r) =>
                      `<tr>${cols
                        .map((c) => `<td>${escapeHtml(r?.[c] ?? "")}</td>`)
                        .join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table></div>`
        }
      </div>

      <div class="card" style="margin-top:1rem">
        <h2>Raw JSON</h2>
        <pre>${prettyJson}</pre>
    </div>
    </div>
    

    <aside>
    <div class="card" >
        <h2>Scores</h2>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          ${Object.entries(scores)
            .map(
              ([k, v]) =>
                `<div><div class="pill">${escapeHtml(k)}: <strong>${escapeHtml(
                  String(v ?? "—")
                )}</strong></div></div>`
            )
            .join("")}
        </div>
      </div>

      <div class="card" style="margin-top:1rem">
        <h2>Coverage</h2>
        <div class="small">Matched: ${escapeHtml(
          String(coverage.matched?.length || 0)
        )}</div>
        <div class="small">Close: ${escapeHtml(
          String(coverage.close?.length || 0)
        )}</div>
        <div class="small">Missing: ${escapeHtml(
          String(coverage.missing?.length || 0)
        )}</div>

        ${
          coverage.close?.length
            ? `<details style="margin-top:8px"><summary>Close matches</summary><ul>${coverage.close
                .map(
                  (c) =>
                    `<li>${escapeHtml(c.candidate || "")} → ${escapeHtml(
                      c.target || ""
                    )} </li>`
                )
                .join("")}</ul></details>`
            : ""
        }

        ${
          coverage.missing?.length
            ? `<details style="margin-top:8px"><summary>Missing fields</summary><ul>${coverage.missing
                .map((m) => `<li>${escapeHtml(m)}</li>`)
                .join("")}</ul></details>`
            : ""
        }

      </div>

      <div class="card" style="margin-top:1rem">
        <h2>Rule Findings</h2>
        ${
          ruleFindings.length === 0
            ? "<p class='small'>No findings</p>"
            : `<ul>${ruleFindings
                .map(
                  (f) =>
                    `<li><strong>${escapeHtml(f.rule)}</strong>: ${escapeHtml(
                      f.ok ? "PASS" : "FAIL"
                    )} ${
                      !f.ok && f.exampleLine
                        ? ` — exampleLine ${escapeHtml(String(f.exampleLine))}`
                        : ""
                    } ${
                      f.value ? ` — value ${escapeHtml(String(f.value))}` : ""
                    }</li>`
                )
                .join("")}</ul>`
        }
      </div>
    </aside>
    
  </section>
</body>
</html>`;
};
