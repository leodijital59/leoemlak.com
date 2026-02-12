import { useId } from "react";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  value?: string;
  onChange: (value: string | undefined) => void;
}

const CategoryFilter = ({ categories, value, onChange }: CategoryFilterProps) => {
  const id = useId();

  return (
    <>
      <div className="form-check d-flex align-items-center mb10">
        <input
          className="form-check-input"
          type="radio"
          id={`${id}-cat-all`}
          checked={!value}
          onChange={() => onChange(undefined)}
        />
        <label className="form-check-label" htmlFor={`${id}-cat-all`}>Tümü</label>
      </div>
      {categories.map((cat) => (
        <div
          className="form-check d-flex align-items-center mb10"
          key={cat.id}
        >
          <input
            className="form-check-input"
            type="radio"
            id={`${id}-cat-${cat.id}`}
            checked={value === cat.id}
            onChange={() => onChange(cat.id)}
          />
          <label className="form-check-label" htmlFor={`${id}-cat-${cat.id}`}>
            {cat.name}
          </label>
        </div>
      ))}
    </>
  );
};

export default CategoryFilter;
