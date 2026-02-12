import { useEffect, useState } from "react";

interface AreaRangeProps {
  grossAreaMin?: number;
  grossAreaMax?: number;
  onChange: (values: { grossAreaMin?: number; grossAreaMax?: number }) => void;
}

const AreaRange = ({ grossAreaMin, grossAreaMax, onChange }: AreaRangeProps) => {
  const [min, setMin] = useState(grossAreaMin?.toString() ?? "");
  const [max, setMax] = useState(grossAreaMax?.toString() ?? "");

  useEffect(() => {
    setMin(grossAreaMin?.toString() ?? "");
    setMax(grossAreaMax?.toString() ?? "");
  }, [grossAreaMin, grossAreaMax]);

  const handleSubmit = () => {
    onChange({
      grossAreaMin: min ? Number(min) : undefined,
      grossAreaMax: max ? Number(max) : undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="space-area">
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-style1">
          <input
            type="number"
            className="form-control filterInput"
            placeholder="Min m²"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
          />
        </div>
        <span className="dark-color">-</span>
        <div className="form-style1">
          <input
            type="number"
            className="form-control filterInput"
            placeholder="Max m²"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default AreaRange;
