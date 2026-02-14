import {ClientOnly, createFileRoute} from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { propertySearchSchema } from "@/lib/validations/property-search";
import { getDistinctLocations, searchProperties } from "@/lib/server/property";
import { getCategories } from "@/lib/server/category";
import PropertyListingPage from "@/components/listing/PropertyListingPage";

export const Route = createFileRoute("/(app)/properties")({
  validateSearch: zodSearchValidator(propertySearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [searchResult, categories, locations] = await Promise.all([
      searchProperties({ data: deps }),
      getCategories(),
      getDistinctLocations(),
    ]);
    return { searchResult, categories, locations };
  },
  component: ListingsPage,
});

function ListingsPage() {
  const { searchResult, categories, locations } = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <>
      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">İlanlar</h2>
                <div className="breadcumb-list">
                  <a href="/">Ana Sayfa</a>
                  <a href="/properties">İlanlar</a>
                </div>
                <a
                  className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                >
                  <span className="flaticon-settings" /> Filtrele
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientOnly>
        <PropertyListingPage
            searchResult={searchResult}
            categories={categories}
            locations={locations}
            search={search}
        />
      </ClientOnly>
    </>
  );
}
