function Stepper({ step }) {
  const steps = ["Context", "Upload/Paste", "Results"];
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        marginBottom: 24,
      }}
    >
      {steps.map((label, idx) => (
        <div
          key={label}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid #ddd",
            background: step === idx ? "rgba(110, 110, 168, 1)" : "#242424",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default Stepper;
