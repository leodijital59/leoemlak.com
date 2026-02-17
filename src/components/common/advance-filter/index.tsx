import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import PriceRange from "@/components/listing/sidebar/PriceRange";
import Bedroom from "@/components/listing/sidebar/Bedroom";
import Bathroom from "@/components/listing/sidebar/Bathroom";
import AreaRange from "@/components/listing/sidebar/AreaRange";
import ProvinceFilter from "@/components/listing/sidebar/ProvinceFilter";
import FeatureFilter from "@/components/listing/sidebar/FeatureFilter";

interface AdvanceFilterModalProps {
  locations: {
    provinces: string[];
    districts: { province: string; district: string }[];
    neighborhoods: { province: string; district: string; neighborhood: string }[];
  };
  features: { id: string; name: string }[];
  listingType: "sold" | "rented";
  q: string;
  categoryId: string | undefined;
}

const AdvanceFilterModal = ({ locations, features, listingType, q, categoryId }: AdvanceFilterModalProps) => {
  const navigate = useNavigate();

  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [rooms, setRooms] = useState<number | undefined>();
  const [bathrooms, setBathrooms] = useState<number | undefined>();
  const [grossAreaMin, setGrossAreaMin] = useState<number | undefined>();
  const [grossAreaMax, setGrossAreaMax] = useState<number | undefined>();
  const [province, setProvince] = useState<string | undefined>();
  const [district, setDistrict] = useState<string | undefined>();
  const [neighborhood, setNeighborhood] = useState<string | undefined>();
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean> | undefined>();

  const handleSearch = () => {
    navigate({
      to: "/properties",
      search: {
        listingType,
        q: q.trim() || undefined,
        categoryId,
        priceMin,
        priceMax,
        rooms,
        bathrooms,
        grossAreaMin,
        grossAreaMax,
        province,
        district,
        neighborhood,
        features: selectedFeatures,
      },
    });
  };

  const handleReset = () => {
    setPriceMin(undefined);
    setPriceMax(undefined);
    setRooms(undefined);
    setBathrooms(undefined);
    setGrossAreaMin(undefined);
    setGrossAreaMax(undefined);
    setProvince(undefined);
    setDistrict(undefined);
    setNeighborhood(undefined);
    setSelectedFeatures(undefined);
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title" id="exampleModalLabel">
            Detaylı Filtre
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        {/* End modal-header */}

        <div className="modal-body pb-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Fiyat Aralığı</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange
                    priceMin={priceMin}
                    priceMax={priceMax}
                    onChange={(values) => {
                      setPriceMin(values.priceMin);
                      setPriceMax(values.priceMax);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Oda Sayısı</h6>
                <div className="d-flex">
                  <Bedroom value={rooms} onChange={setRooms} />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Banyo Sayısı</h6>
                <div className="d-flex">
                  <Bathroom value={bathrooms} onChange={setBathrooms} />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Adres</h6>
                <div className="form-style2">
                  <ProvinceFilter
                    locations={locations}
                    province={province}
                    district={district}
                    neighborhood={neighborhood}
                    onChange={(values) => {
                      setProvince(values.province);
                      setDistrict(values.district);
                      setNeighborhood(values.neighborhood);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Alan (m²)</h6>
                <AreaRange
                  grossAreaMin={grossAreaMin}
                  grossAreaMax={grossAreaMax}
                  onChange={(values) => {
                    setGrossAreaMin(values.grossAreaMin);
                    setGrossAreaMax(values.grossAreaMax);
                  }}
                />
              </div>
            </div>
            {/* End .col-md-6 */}
          </div>
          {/* End .row */}

          {features.length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="widget-wrapper mb0">
                  <h6 className="list-title mb10">Özellikler</h6>
                </div>
              </div>
              <FeatureFilter
                features={features}
                value={selectedFeatures}
                onChange={setSelectedFeatures}
              />
            </div>
          )}
        </div>
        {/* End modal body */}

        <div className="modal-footer justify-content-between">
          <button className="reset-button" onClick={handleReset}>
            <span className="flaticon-turn-back" />
            <u>Filtreleri Sıfırla</u>
          </button>
          <div className="btn-area">
            <button
              data-bs-dismiss="modal"
              type="submit"
              className="ud-btn btn-thm"
              onClick={handleSearch}
            >
              <span className="flaticon-search pr10" />
              Ara
            </button>
          </div>
        </div>
        {/* End modal-footer */}
      </div>
    </div>
  );
};

export default AdvanceFilterModal;
