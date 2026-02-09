import type { PropertyData } from '@/types/property-display'
import { formatBuildingAge } from '@/lib/formatters'

type Props = {
  property: PropertyData
}

const OverView = ({ property }: Props) => {
  const overviewData = [
    property.rooms !== null && {
      icon: "flaticon-bed",
      label: "Oda Sayısı",
      value: property.rooms,
    },
    property.bathrooms !== null && {
      icon: "flaticon-shower",
      label: "Banyo",
      value: property.bathrooms,
    },
    property.buildingAge !== null && {
      icon: "flaticon-event",
      label: "Bina Yaşı",
      value: formatBuildingAge(property.buildingAge),
    },
    (property.grossArea || property.netArea) && {
      icon: "flaticon-expand",
      label: "Alan",
      value: `${property.grossArea || property.netArea} m²`,
      xs: true,
    },
  ].filter(Boolean);

  return (
    <>
      {overviewData.map((item, index) => (
        <div
          key={index}
          className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
        >
          <div className="overview-element d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
