import type { PropertyFeature } from '@/types/property-display'

type Props = {
  features: PropertyFeature[]
}

const PropertyFeaturesAminites = ({ features }: Props) => {
  // Show message if no features
  if (features.length === 0) {
    return (
      <div className="col-12">
        <p className="text-muted">Bu ilan için özellik bilgisi bulunmamaktadır.</p>
      </div>
    )
  }

  return (
    <div className="row px-3">
      {features.map((feature) => (
        <div
          key={feature.featureId}
          className="col-6 col-sm-4 text position-relative"
          style={!feature.value ? { color: '#aaa', paddingLeft: "1.25rem" } : { paddingLeft: "1.25rem" }}
        >
          {feature.value && <i
            className="fas fa-check-circle align-middle position-absolute start-0 top-0"
            style={{color: '#28a745' }}
          />}
          {feature.featureName}
        </div>
      ))}
    </div>
  );
};

export default PropertyFeaturesAminites;
