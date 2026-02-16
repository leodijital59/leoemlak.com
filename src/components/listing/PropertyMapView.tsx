import { useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  type MapRef,
} from "@/components/ui/map";
import { formatPrice } from "@/lib/format";
import { listingTypeOptions } from "@/lib/validations/property";

interface PropertyImage {
  id: string;
  url: string;
  order: number;
  isMainImage: boolean;
}

interface MapProperty {
  property: {
    id: string;
    title: string;
    price: string;
    listingType: "sold" | "rented";
    province: string;
    district: string;
    neighborhood: string;
    latitude: string | null;
    longitude: string | null;
  };
  images: PropertyImage[];
  category: { id: string; name: string } | null;
}

interface PropertyMapViewProps {
  properties: MapProperty[];
}

const getListingTypeLabel = (type: "sold" | "rented") =>
  listingTypeOptions.find((o) => o.value === type)?.label ?? type;

const PropertyMapView = ({ properties }: PropertyMapViewProps) => {
  const mapRef = useRef<MapRef>(null);
  const mapLoadedRef = useRef(false);

  const propertiesWithCoords = useMemo(
    () =>
      properties.filter(
        (item) => item.property.latitude && item.property.longitude
      ),
    [properties]
  );
  const withoutCoordsCount = properties.length - propertiesWithCoords.length;

  // Fit bounds when properties change or map first loads
  useEffect(() => {
    const map = mapRef.current;
    if (!map || propertiesWithCoords.length === 0) return;

    const fitToProperties = () => {
      const coords = propertiesWithCoords.map((item) => ({
        lat: Number(item.property.latitude),
        lng: Number(item.property.longitude),
      }));

      if (coords.length === 1) {
        map.flyTo({
          center: [coords[0].lng, coords[0].lat],
          zoom: 16,
          duration: mapLoadedRef.current ? 1000 : 0,
        });
      } else {
        const lngs = coords.map((c) => c.lng);
        const lats = coords.map((c) => c.lat);
        const sw: [number, number] = [Math.min(...lngs), Math.min(...lats)];
        const ne: [number, number] = [Math.max(...lngs), Math.max(...lats)];
        map.fitBounds([sw, ne], {
          padding: 50,
          duration: mapLoadedRef.current ? 1000 : 0,
        });
      }
      mapLoadedRef.current = true;
    };

    if (map.loaded()) {
      fitToProperties();
    } else {
      map.once("load", fitToProperties);
    }
  }, [propertiesWithCoords]);

  return (
    <div>
      {withoutCoordsCount > 0 && (
        <div className="alert alert-info mb-3">
          <small>
            {withoutCoordsCount} ilan konum bilgisi bulunmadığı için haritada
            gösterilemiyor.
          </small>
        </div>
      )}
      <div style={{ height: "600px", borderRadius: "8px", overflow: "hidden" }}>
        <Map ref={mapRef} center={[35, 39]} zoom={5} theme="light">
          <MapControls position="top-right" showZoom showLocate />
          {propertiesWithCoords.map((item) => {
            const lat = Number(item.property.latitude);
            const lng = Number(item.property.longitude);
            const mainImage: PropertyImage =
              item.images.find((img) => img.isMainImage) ?? item.images[0];

            return (
              <MapMarker
                key={item.property.id}
                longitude={lng}
                latitude={lat}
              >
                <MarkerContent>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "#e74c3c",
                      border: "2px solid #fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    }}
                  />
                </MarkerContent>
                <MarkerPopup closeButton>
                  <div style={{ width: "240px", fontFamily: "inherit" }}>
                    {mainImage && (
                      <img
                        src={mainImage.url}
                        alt={item.property.title}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          marginBottom: "8px",
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "4px",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.property.title}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#e74c3c",
                        marginBottom: "4px",
                      }}
                    >
                      {formatPrice(item.property.price)}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      {[
                        item.property.neighborhood,
                        item.property.district,
                        item.property.province,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          backgroundColor: "#f0f0f0",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {getListingTypeLabel(item.property.listingType)}
                      </span>
                      <Link
                        to="/property/$id"
                        params={{ id: item.property.id }}
                        style={{
                          fontSize: "12px",
                          color: "#2563eb",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Detaylar &rarr;
                      </Link>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            );
          })}
        </Map>
      </div>
    </div>
  );
};

export default PropertyMapView;
