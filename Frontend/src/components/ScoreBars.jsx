function ScoreBars({ scores }) {
  if (!scores) return null;
  const entries = [
    ["Data", scores.data],
    ["Coverage", scores.coverage],
    ["Rules", scores.rules],
    ["Posture", scores.posture],
    ["Overall", scores.overall],
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {entries.map(([label, val]) => (
        <div key={label}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{label}</span>
            <strong>{val}</strong>
          </div>
          <div style={{ height: 10, background: "#eee" }}>
            <div
              style={{
                width: `${val}%`,
                height: "100%",
                background: label === "Overall" ? "#111827" : "#3b82f6",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScoreBars;
