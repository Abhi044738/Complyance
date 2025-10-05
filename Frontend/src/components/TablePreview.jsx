import TypeBadge from "./TypeBadge";

function TablePreview({ rows }) {
  if (!rows || rows.length === 0) return <p>No preview available.</p>;
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).slice(
    0,
    12
  );

  return (
    <div className="table-preview-div">
      <table className="table-preview">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} className="table-preview-col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 20).map((r, idx) => (
            <tr key={idx}>
              {cols.map((c) => (
                <td key={c} className="table-preview-col">
                  <div className="table-preview-col-div">
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
