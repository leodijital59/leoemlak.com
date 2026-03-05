import {ClientOnly, createFileRoute} from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { propertySearchSchema } from "@/lib/validations/property-search";
import { getActivePropertyFeatures, getDistinctLocations, searchProperties } from "@/lib/server/property";
import { getCategories } from "@/lib/server/category";
import PropertyListingPage from "@/components/listing/PropertyListingPage";
import css from '@/styles/map.css?url';
import {formatCapitilized} from "@/lib/format.ts";

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
  staleTime: import.meta.env.PROD ? 900_000 : 0,
  component: ListingsPage,
  staticData: {
    description: 'Türkiye genelinde satılık ve kiralık gayrimenkul ilanları. Daire, villa, arsa ve işyeri ilanları.',
  },
  head: ({ match, loaderData }) => {
    const { listingType, categoryId, province, district, neighborhood } = match.search
    const appName = import.meta.env.VITE_APP_NAME as string
    const listingLabel = listingType ? (listingType === 'sold' ? 'Satılık' : 'Kiralık') : null
    const category = loaderData?.categories.find(item => item.id === categoryId)
    const adresses = [
      province ? formatCapitilized(province) : null,
      district ? formatCapitilized(district) : null,
      neighborhood ? formatCapitilized(neighborhood) : null
    ].filter(Boolean)

    return {
      meta: [
        {
          title: `${[...adresses, listingLabel, category?.name, `İlanlar${category?.name || adresses.length > 0 ? 'ı' : ''}`].filter(Boolean).join(' ')} | ${appName}`,
        }
      ],
      links: [
        { rel: 'stylesheet', href: css }
      ]
    }
  }
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
