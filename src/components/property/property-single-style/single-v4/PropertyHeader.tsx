import type { PropertyData } from '@/types/property-display'
import { formatAddress, formatPrice, translateListingType } from '@/lib/formatters'

type Props = {
  property: PropertyData
}

const PropertyHeader = ({ property }: Props) => {
  const pricePerSqm = property.pricePerSqm
    ? `${formatPrice(property.pricePerSqm)}/m²`
    : null

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{property.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {formatAddress(property.province, property.district, property.neighborhood)}
            </p>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              {translateListingType(property.listingType)}
            </a>
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <a className="icon mr10" href="#">
                <span className="flaticon-share-1" />
              </a>
            </div>
            <h3 className="price mb-0">{formatPrice(property.price)}</h3>
            {pricePerSqm && (
              <p className="text space fz15">{pricePerSqm}</p>
            )}
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;
