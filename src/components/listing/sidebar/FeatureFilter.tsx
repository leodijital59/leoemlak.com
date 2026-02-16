import { useId } from "react";

interface Feature {
  id: string;
  name: string;
}

interface FeatureFilterProps {
  features: Feature[];
  value?: Record<string, boolean>;
  onChange: (value: Record<string, boolean> | undefined) => void;
}

const FeatureFilter = ({ features, value = {}, onChange }: FeatureFilterProps) => {
  const id = useId();

  const handleToggle = (featureId: string) => {
    const updated = { ...value };
    if (updated[featureId]) {
      delete updated[featureId];
    } else {
      updated[featureId] = true;
    }
    onChange(Object.keys(updated).length > 0 ? updated : undefined);
  };

  return (
    <>
      {features.map((feature) => (
        <label className="custom_checkbox" key={feature.id}>
          {feature.name}
          <input
              type="checkbox"
              id={`${id}-feat-${feature.id}`}
              defaultChecked={!!value[feature.id]}
              onChange={() => handleToggle(feature.id)}
          />
          <span className="checkmark" />
        </label>
      ))}
    </>
  );
};

export default FeatureFilter;
