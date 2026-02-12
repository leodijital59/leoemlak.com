import { useId } from "react";

interface BedroomProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

const options = [
  { label: "Hepsi", value: undefined as number | undefined },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "5+", value: 5 },
];

const Bedroom = ({ value, onChange }: BedroomProps) => {
  const id = useId();

  return (
    <>
      {options.map((option) => (
        <div className="selection" key={option.label}>
          <input
            type="radio"
            id={`${id}-bed-${option.label}`}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <label htmlFor={`${id}-bed-${option.label}`}>{option.label}</label>
        </div>
      ))}
    </>
  );
};

export default Bedroom;
