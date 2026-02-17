import { useEffect, useState } from "react";
import Select from "react-select";

interface SelectDropdownProps {
  categories: { id: string; name: string; parentId: string | null }[];
  value: string | undefined;
  onChange: (categoryId: string | undefined) => void;
}

const SelectDropdown = ({ categories, value, onChange }: SelectDropdownProps) => {
  const catOptions = [
    { value: "", label: "Tüm Kategoriler" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);
  const customStyles = {
    option: (styles: any, { isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isFocused
          ? "#eb675312"
          : undefined,
      };
    },
  };

  return (
    <>
      {showSelect && (
        <Select
          value={catOptions.find((o) => o.value === (value ?? "")) ?? catOptions[0]}
          name="category"
          options={catOptions}
          styles={customStyles}
          className="text-start select-borderless"
          classNamePrefix="select"
          isSearchable={false}
          onChange={(option) => onChange(option?.value || undefined)}
        />
      )}
    </>
  );
};

export default SelectDropdown;
