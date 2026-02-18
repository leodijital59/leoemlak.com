import {ClientOnly, createFileRoute} from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { propertySearchSchema } from "@/lib/validations/property-search";
import { getActivePropertyFeatures, getDistinctLocations, searchProperties } from "@/lib/server/property";
import { getCategories } from "@/lib/server/category";
import PropertyListingPage from "@/components/listing/PropertyListingPage";
import css from '@/styles/map.css?url';

export const Route = createFileRoute("/(app)/properties")({
  validateSearch: zodSearchValidator(propertySearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [searchResult, categories, locations, features] = await Promise.all([
      searchProperties({ data: deps }),
      getCategories(),
      getDistinctLocations(),
      getActivePropertyFeatures(),
    ]);
    return { searchResult, categories, locations, features };
  },
  component: ListingsPage,
  head: () => ({
    links: [
      { rel: 'stylesheet', href: css }
    ]
  })
});

function ListingsPage() {
  const { searchResult, categories, locations, features } = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <>
      <section className="home-banner-style2 p0 pt0-md pt90"></section>

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
            features={features}
            search={search}
        />
      </ClientOnly>
    </>
  );
}
