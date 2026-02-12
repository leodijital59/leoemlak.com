import { useEffect, useState } from "react";

interface SearchBoxProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  const [query, setQuery] = useState(value ?? "");

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  const handleSubmit = () => {
    onChange(query.trim() || undefined);
  };

  return (
    <div className="search_area">
      <input
        type="text"
        className="form-control"
        placeholder="Arama..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      <label onClick={handleSubmit} style={{ cursor: "pointer" }}>
        <span className="flaticon-search" />
      </label>
    </div>
  );
};

export default SearchBox;
