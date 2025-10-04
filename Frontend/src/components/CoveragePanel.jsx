function CoveragePanel({ coverage }) {
  if (!coverage) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div>
        <strong>Matched</strong>: {coverage.matched?.length || 0}
      </div>
      <div>
        <strong>Close</strong>: {coverage.close?.length || 0}
      </div>
      <div>
        <strong>Missing</strong>: {coverage.missing?.length || 0}
      </div>

      {/* {!!coverage.close?.length && (
        <ul>
          {coverage.close.map((c, i) => (
            <li key={i}>
              {c.candidate} → {c.target} (
              {Math.round((c.confidence || 0) * 100)}%)
            </li>
          ))}
        </ul>
      )} */}
      {!!coverage.matched?.length && (
        <details>
          <summary>Show matched</summary>
          <ul>
            {coverage.matched.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </details>
      )}
      {!!coverage.close?.length && (
        <details>
          <summary>Show close</summary>
          <ul>
            {coverage.close.map((c, i) => (
              <li key={i}>
                {c.candidate} → {c.target}
              </li>
            ))}
          </ul>
        </details>
      )}
      {!!coverage.missing?.length && (
        <details>
          <summary>Show missing</summary>
          <ul>
            {coverage.missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default CoveragePanel;
