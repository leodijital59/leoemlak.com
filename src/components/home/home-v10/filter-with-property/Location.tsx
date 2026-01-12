import { useEffect, useState } from "react";
import Select from "react-select";

const Location = () => {
  const inqueryType = [
    { value: "New York", label: "New York" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "London", label: "London" },
    { value: "Paris", label: "Paris" },
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
          defaultValue={[inqueryType[0]]}
          name="colors"
          options={inqueryType}
          styles={customStyles}
          className="text-start select-borderless"
          classNamePrefix="select"
          required
          isClearable={false}
        />
      )}
    </>
  );
};

export default Location;
