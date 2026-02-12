import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

interface ProvinceFilterProps {
  locations: {
    provinces: string[];
    districts: { province: string; district: string }[];
    neighborhoods: { province: string; district: string; neighborhood: string }[];
  };
  province?: string;
  district?: string;
  neighborhood?: string;
  onChange: (values: { province?: string; district?: string; neighborhood?: string }) => void;
}

const customStyles = {
  option: (
    styles: Record<string, unknown>,
    { isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }
  ) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#eb6753"
      : isFocused
        ? "#eb675312"
        : undefined,
  }),
};

const ProvinceFilter = ({
  locations,
  province,
  district,
  neighborhood,
  onChange,
}: ProvinceFilterProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const provinceOptions = useMemo(
    () => [
      { value: "", label: "Tüm İller" },
      ...locations.provinces.map((p) => ({ value: p, label: p })),
    ],
    [locations.provinces]
  );

  const districtOptions = useMemo(() => {
    if (!province) return [];
    const filtered = locations.districts
      .filter((d) => d.province === province)
      .map((d) => ({ value: d.district, label: d.district }));
    return [{ value: "", label: "Tüm İlçeler" }, ...filtered];
  }, [locations.districts, province]);

  const neighborhoodOptions = useMemo(() => {
    if (!province || !district) return [];
    const filtered = locations.neighborhoods
      .filter((n) => n.province === province && n.district === district)
      .map((n) => ({ value: n.neighborhood, label: n.neighborhood }));
    return [{ value: "", label: "Tüm Mahalleler" }, ...filtered];
  }, [locations.neighborhoods, province, district]);

  if (!mounted) return null;

  return (
    <div className="d-flex flex-column gap-2">
      <Select
        styles={customStyles}
        options={provinceOptions}
        value={
          province
            ? { value: province, label: province }
            : provinceOptions[0]
        }
        className="select-custom filterSelect"
        classNamePrefix="select"
        placeholder="İl seçiniz..."
        onChange={(opt) =>
          onChange({
            province: opt?.value || undefined,
            district: undefined,
            neighborhood: undefined,
          })
        }
      />
      {province && districtOptions.length > 1 && (
        <Select
          styles={customStyles}
          options={districtOptions}
          value={
            district
              ? { value: district, label: district }
              : districtOptions[0]
          }
          className="select-custom filterSelect"
          classNamePrefix="select"
          placeholder="İlçe seçiniz..."
          onChange={(opt) =>
            onChange({
              province,
              district: opt?.value || undefined,
              neighborhood: undefined,
            })
          }
        />
      )}
      {district && neighborhoodOptions.length > 1 && (
        <Select
          styles={customStyles}
          options={neighborhoodOptions}
          value={
            neighborhood
              ? { value: neighborhood, label: neighborhood }
              : neighborhoodOptions[0]
          }
          className="select-custom filterSelect"
          classNamePrefix="select"
          placeholder="Mahalle seçiniz..."
          onChange={(opt) =>
            onChange({
              province,
              district,
              neighborhood: opt?.value || undefined,
            })
          }
        />
      )}
    </div>
  );
};

export default ProvinceFilter;
