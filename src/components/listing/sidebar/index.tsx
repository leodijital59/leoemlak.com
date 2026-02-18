import { useState } from "react";
import SearchBox from "./SearchBox";
import ListingType from "./ListingType";
import CategoryFilter from "./CategoryFilter";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import ProvinceFilter from "./ProvinceFilter";
import AreaRange from "./AreaRange";
import FeatureFilter from "./FeatureFilter";
import type { PropertySearchParams } from "@/lib/validations/property-search";

interface Category {
    id: string;
    name: string;
    parentId: string | null;
}

interface Feature {
    id: string;
    name: string;
}

interface ListingSidebarProps {
    categories: Category[];
    locations: {
        provinces: string[];
        districts: { province: string; district: string }[];
        neighborhoods: { province: string; district: string; neighborhood: string }[];
    };
    features: Feature[];
    search: PropertySearchParams;
    setFilters: (updates: Partial<PropertySearchParams>) => void;
    resetFilters: () => void;
}

const ListingSidebar = ({
                            categories,
                            locations,
                            features,
                            search,
                            setFilters,
                            resetFilters,
                        }: ListingSidebarProps) => {
    const [featuresOpen, setFeaturesOpen] = useState(false);

    return (
        <div className="list-sidebar-style1">
            <div className="widget-wrapper">
                <h6 className="list-title">Arama</h6>
                <SearchBox
                    value={search.q}
                    onChange={(q) => setFilters({ q })}
                />
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">İlan Türü</h6>
                <div className="radio-element">
                    <ListingType
                        value={search.listingType}
                        onChange={(listingType) => setFilters({ listingType })}
                    />
                </div>
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">Kategori</h6>
                <div className="radio-element">
                    <CategoryFilter
                        categories={categories}
                        value={search.categoryId}
                        onChange={(categoryId) => setFilters({ categoryId })}
                    />
                </div>
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">Adres</h6>
                <div className="form-style2">
                    <ProvinceFilter
                        locations={locations}
                        province={search.province}
                        district={search.district}
                        neighborhood={search.neighborhood}
                        onChange={(values) => setFilters(values)}
                    />
                </div>
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">Fiyat Aralığı</h6>
                <div className="range-slider-style1">
                    <PriceRange
                        priceMin={search.priceMin}
                        priceMax={search.priceMax}
                        onChange={(values) => setFilters(values)}
                    />
                </div>
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">Oda Sayısı</h6>
                <div className="d-flex">
                    <Bedroom
                        value={search.rooms}
                        onChange={(rooms) => setFilters({ rooms })}
                    />
                </div>
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">Banyo Sayısı</h6>
                <div className="d-flex">
                    <Bathroom
                        value={search.bathrooms}
                        onChange={(bathrooms) => setFilters({ bathrooms })}
                    />
                </div>
            </div>

            <div className="widget-wrapper">
                <h6 className="list-title">Brüt Alan (m²)</h6>
                <AreaRange
                    grossAreaMin={search.grossAreaMin}
                    grossAreaMax={search.grossAreaMax}
                    onChange={(values) => setFilters(values)}
                />
            </div>

            {features.length > 0 && (
                <div className="widget-wrapper">
                    <button
                        type="button"
                        className="list-title mb10 d-flex justify-content-between align-items-center w-100 border-0 bg-transparent p-0"
                        style={{ cursor: "pointer" }}
                        onClick={() => setFeaturesOpen((o) => !o)}
                    >
                        <h6>Özellikler</h6>
                        <i
                            className="far fa-chevron-down"
                            style={{
                                transition: "transform 0.2s",
                                transform: featuresOpen ? "rotate(0deg)" : "rotate(-90deg)",
                                fontSize: "12px",
                            }}
                        />
                    </button>
                    {featuresOpen && (
                        <div className="checkbox-style1 mt-2">
                            <FeatureFilter
                                features={features}
                                value={search.features}
                                onChange={(features) => setFilters({ features })}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="widget-wrapper mb20">
                <div className="reset-area d-flex align-items-center justify-content-between">
                    <div
                        onClick={resetFilters}
                        className="reset-button cursor"
                        style={{ cursor: "pointer" }}
                    >
                        <span className="flaticon-turn-back" />
                        <u>Filtreleri Temizle</u>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingSidebar;
