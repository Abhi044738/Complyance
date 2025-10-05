function Stepper({ step }) {
  const steps = ["Context", "Upload/Paste", "Results"];
  return (
    <div className="stepper-div">
      {steps.map((label, idx) => (
        <div
          key={label}
          className="stepper-step-div"
          style={{
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
