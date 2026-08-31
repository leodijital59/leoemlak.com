import { Link } from "@tanstack/react-router";
import type { PropertyData } from "@/types/property-display";
import Image from "@/components/common/Image";
import { listingTypeOptions } from "@/lib/validations/property";
import {formatPrice} from "@/lib/format";
import {formatAddress, formatArea, formatFloor} from "@/lib/formatters.ts";

interface PropertyImage {
  id: string;
  url: string;
  order: number;
  isMainImage: boolean;
}

interface PropertyCardProps {
  property: PropertyData;
  images: PropertyImage[];
  category: { id: string; name: string } | null;
}

const getListingTypeLabel = (type: "sold" | "rented") =>
  listingTypeOptions.find((o) => o.value === type)?.label ?? type;

const PropertyCard = ({ property, images, category }: PropertyCardProps) => {
  const mainImage = images.find((img) => img.isMainImage) ?? images[0];

  return (
    <div className="col-sm-6 col-lg-6">
      <Link to="/property/$id" params={{ id: property.id }}>
        <div className="listing-style1">
          <div className="list-thumb">
            {mainImage ? (
              <Image
                src={mainImage.url}
                width={382}
                height={510}
                alt={property.title}
                className="w-100 h-100 cover"
              />
            ) : (
              <div className="list-thumb-placeholder">
                <span className="text-muted">Görsel Yok</span>
              </div>
            )}
            <div className="sale-sticker-wrap">
              <div className="list-tag fz12">
                {getListingTypeLabel(property.listingType)}
              </div>
            </div>
            <div className="list-price">
              {formatPrice(property.price)}
            </div>
          </div>

          <div className="list-content">
            <h6 className="list-title">
              {property.title}
            </h6>
            <p className="list-text mb5">
              {formatAddress(property.province, property.district, property.neighborhood)}
            </p>

            <div className="list-meta d-flex align-items-center *:mr-2! *:pr-2 divide-x divide-black/10">
              {category && (
                <span>{category.name}</span>
              )}
              {(property.rooms != null && property.bathrooms != null) && (
                <span>{property.rooms}+{property.bathrooms}</span>
              )}
              {property.floorNumber != null && (
                <span>{formatFloor(property.floorNumber)}</span>
              )}
              {property.grossArea != null && (
                <span>{formatArea(property.grossArea)} (Brüt)</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
