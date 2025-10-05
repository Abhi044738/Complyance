import { useMemo } from "react";

function TypeBadge({ value }) {
  const t = useMemo(() => {
    if (value === null || value === undefined || value === "") return "empty";
    if (typeof value === "number") return "number";
    if (!Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(String(value)))
      return "number";
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return "date";
    return "text";
  }, [value]);

  const colors = {
    number: "#d1fae5",
    date: "#fee2e2",
    text: "#e0e7ff",
    empty: "#e5e7eb",
  };

  return (
    <span className="typebadge" style={{ background: colors[t] }}>
      {t}
    </span>
  );
}

export default TypeBadge;
