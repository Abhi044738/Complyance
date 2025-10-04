import TypeBadge from "./TypeBadge";

function TablePreview({ rows }) {
  if (!rows || rows.length === 0) return <p>No preview available.</p>;
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).slice(
    0,
    12
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: "6px 8px",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 20).map((r, idx) => (
            <tr key={idx}>
              {cols.map((c) => (
                <td
                  key={c}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    padding: "6px 8px",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span style={{ fontFamily: "monospace" }}>
                      {String(r[c])}
                    </span>
                    <TypeBadge value={r[c]} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablePreview;
