import type { PropertyData } from '@/types/property-display'
import { formatArea, formatBuildingAge, formatFloor, formatPrice, translateListingType } from '@/lib/formatters'

type Props = {
  property: PropertyData
}

const PropertyDetails = ({ property }: Props) => {
  const details = [
    {
      label: "İlan No",
      value: property.id.substring(0, 8).toUpperCase(),
    },
    {
      label: "Fiyat",
      value: formatPrice(property.price),
    },
    {
      label: "Brüt Alan",
      value: formatArea(property.grossArea),
    },
    property.netArea && {
      label: "Net Alan",
      value: formatArea(property.netArea),
    },
    property.bathrooms !== null && {
      label: "Banyo Sayısı",
      value: property.bathrooms,
    },
    property.rooms !== null && {
      label: "Oda Sayısı",
      value: property.rooms,
    },
    property.buildingAge !== null && {
      label: "Bina Yaşı",
      value: formatBuildingAge(property.buildingAge),
    },
    (property.floorNumber !== null || property.totalFloors !== null) && {
      label: "Kat Bilgisi",
      value: formatFloor(property.floorNumber, property.totalFloors),
    },
    property.heatingType && {
      label: "Isıtma",
      value: property.heatingType,
    },
    {
      label: "İlan Tipi",
      value: translateListingType(property.listingType),
    },
  ].filter<any>(Boolean as any);

  return (
    <div className="row">
        {details.map((detail, index) => (
          <div key={index} className="d-flex justify-content-between">
            <div className="pd-list">
              <p className="fw600 mb10 ff-heading dark-color">
                {detail.label}
              </p>
            </div>
            <div className="pd-list">
              <p className="text mb10">{detail.value}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PropertyDetails;
