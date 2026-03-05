import type { PropertyData } from '@/types/property-display'
import {formatArea, formatFloor, formatPrice} from '@/lib/formatters'
import {ClientOnly} from "@tanstack/react-router";

type Props = {
  property: PropertyData
}

const PropertyHeader = ({ property }: Props) => {
  return (
    <ClientOnly>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h3 className="sp-lg-title">{property.title}</h3>
          <h2 className="sp-lg-title">{formatPrice(property.price)}</h2>
          <div className="property-meta d-flex align-items-center gap-3">
            {(property.rooms !== null && property.bathrooms !== null) && (
              <span className="text fz15 bdrr1 pr15">
                {property.rooms}+{property.bathrooms}
              </span>
            )}
            {property.floorNumber !== null && (
              <span className="text fz15 bdrr1 pr15">
                {formatFloor(property.floorNumber)}
              </span>
            )}
            {property.grossArea !== null && (
              <span className="text fz15">
                {formatArea(property.grossArea)} (Brüt)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb10 mb0-md align-items-center justify-content-end">
              <a className="icon mr10" href="#">
                <span className="flaticon-share-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default PropertyHeader;
