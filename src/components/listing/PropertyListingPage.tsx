import { useState } from "react";
import ListingSidebar from "./sidebar";
import PropertyCard from "./PropertyCard";
import PropertyMapView from "./PropertyMapView";
import TopFilterBar from "./TopFilterBar";
import Pagination from "./Pagination";
import type { ViewMode } from "./TopFilterBar";
import type { PropertySearchParams } from "@/lib/validations/property-search";
import { usePropertyFilters } from "@/lib/client/use-property-filters";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface PropertyImage {
  id: string;
  url: string;
  order: number;
  isMainImage: boolean;
}

interface PropertyResult {
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
    latitude: string | null;
    longitude: string | null;
  };
  images: PropertyImage[];
  category: { id: string; name: string } | null;
}

interface SearchResult {
  properties: PropertyResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface Feature {
  id: string;
  name: string;
}

interface PropertyListingPageProps {
  searchResult: SearchResult;
  categories: Category[];
  locations: {
    provinces: string[];
    districts: { province: string; district: string }[];
    neighborhoods: { province: string; district: string; neighborhood: string }[];
  };
  features: Feature[];
  search: PropertySearchParams;
}

const PropertyListingPage = ({
  searchResult,
  categories,
  locations,
  features,
  search,
}: PropertyListingPageProps) => {
  const { setFilters, resetFilters } = usePropertyFilters(search);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const sidebarContent = (
    <ListingSidebar
      categories={categories}
      locations={locations}
      features={features}
      search={search}
      setFilters={setFilters}
      resetFilters={resetFilters}
    />
  );

  return (
    <section className="pt0 pb0 bgc-f7">
      <div className="container">
        <div className="row gx-xl-5">
          {/* Desktop Sidebar */}
          <div className="col-lg-4 d-none d-lg-block">
            {sidebarContent}
          </div>

          {/* Mobile Offcanvas Sidebar */}
          <div
            className="offcanvas offcanvas-start p-0"
            tabIndex={-1}
            id="listingSidebarFilter"
            aria-labelledby="listingSidebarFilterLabel"
          >
            <div className="offcanvas-header">
              <h5
                className="offcanvas-title"
                id="listingSidebarFilterLabel"
              >
                Filtreler
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body p-0">
              {sidebarContent}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-8">
            <TopFilterBar
              total={searchResult.total}
              sort={search.sort}
              onSortChange={(sort) => setFilters({ sort: sort as PropertySearchParams["sort"] })}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {viewMode === "grid" ? (
              <>
                <div className="row mt15">
                  {searchResult.properties.length > 0 ? (
                    searchResult.properties.map((item) => (
                      <PropertyCard
                        key={item.property.id}
                        property={item.property}
                        images={item.images}
                        category={item.category}
                      />
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-warning text-center">
                        Aramanıza uygun ilan bulunamadı. Filtreleri değiştirmeyi deneyin.
                      </div>
                    </div>
                  )}
                </div>

                <div className="row">
                  <Pagination
                    page={searchResult.page}
                    totalPages={searchResult.totalPages}
                    onPageChange={(page) =>
                      setFilters({ page: page === 1 ? undefined : page })
                    }
                  />
                </div>
              </>
            ) : (
              <div className="mt15">
                <PropertyMapView properties={searchResult.properties} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyListingPage;
