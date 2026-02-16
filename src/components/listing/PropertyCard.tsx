import { Link } from "@tanstack/react-router";
import Image from "@/components/common/Image";
import { listingTypeOptions } from "@/lib/validations/property";
import { formatPrice } from "@/lib/format";

interface PropertyImage {
  id: string;
  url: string;
  order: number;
  isMainImage: boolean;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: string;
    listingType: "sold" | "rented";
    province: string;
    district: string;
    neighborhood: string;
    rooms: number | null;
    bathrooms: number | null;
    grossArea: number | null;
  };
  images: PropertyImage[];
  category: { id: string; name: string } | null;
}

const getListingTypeLabel = (type: "sold" | "rented") =>
  listingTypeOptions.find((o) => o.value === type)?.label ?? type;

const PropertyCard = ({ property, images, category }: PropertyCardProps) => {
  const mainImage = images.find((img) => img.isMainImage) ?? images[0];

  return (
    <div className="col-sm-6 col-lg-6">
      <div className="listing-style1">
        <div className="list-thumb">
          {mainImage ? (
            <Image
              src={mainImage.url}
              width={382}
              height={248}
              alt={property.title}
              className="w-100"
            />
          ) : (
            <div
              className="w-100 d-flex align-items-center justify-content-center bg-light"
              style={{ height: 248 }}
            >
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
            <Link to="/property/$id" params={{ id: property.id }}>
              {property.title}
            </Link>
          </h6>
          <p className="list-text">
            {[property.neighborhood, property.district, property.province]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="list-meta d-flex align-items-center">
            {property.rooms != null && (
              <a>
                <span className="flaticon-bed" /> {property.rooms} Oda
              </a>
            )}
            {property.bathrooms != null && (
              <a>
                <span className="flaticon-shower" /> {property.bathrooms} Banyo
              </a>
            )}
            {property.grossArea != null && (
              <a>
                <span className="flaticon-expand" /> {property.grossArea} m²
              </a>
            )}
          </div>

          <hr />

          <div className="list-meta2 d-flex justify-content-between align-items-center">
            <span className="for-what">
              {getListingTypeLabel(property.listingType)}
            </span>
            {category && (
              <span className="text-muted fz13">{category.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
