import { useId } from "react";
import { listingTypeOptions } from "@/lib/validations/property";

interface ListingTypeProps {
  value?: "sold" | "rented";
  onChange: (value: "sold" | "rented" | undefined) => void;
}

const options = [
  { value: undefined as "sold" | "rented" | undefined, label: "Tümü" },
  ...listingTypeOptions.map((o) => ({ value: o.value as "sold" | "rented" | undefined, label: o.label })),
];

const ListingType = ({ value, onChange }: ListingTypeProps) => {
  const id = useId();

  return (
    <>
      {options.map((option) => (
        <div
          className="form-check d-flex align-items-center mb10"
          key={option.label}
        >
          <input
            className="form-check-input"
            type="radio"
            id={`${id}-lt-${option.label}`}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <label className="form-check-label" htmlFor={`${id}-lt-${option.label}`}>
            {option.label}
          </label>
        </div>
      ))}
    </>
  );
};

export default ListingType;
