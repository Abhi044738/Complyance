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
    <div className="score-bar-div">
      {entries.map(([label, val]) => (
        <div key={label}>
          <div className="score-bar-item-div">
            <span>{label}</span>
            <strong>{val}</strong>
          </div>
          <div className="score-bar-item">
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
