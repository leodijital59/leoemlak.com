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
    title: 'Tekirdağ ve Çorlu Emlak İlanları',
    description: 'Tekirdağ, Çorlu ve çevre ilçelerde satılık ve kiralık gayrimenkul ilanları. Daire, villa, arsa ve işyeri seçenekleri.',
    keywords: ['Tekirdağ emlak ilanları', 'Çorlu satılık daire', 'Tekirdağ kiralık daire', 'Çerkezköy emlak', 'Kapaklı emlak'],
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

    const titleParts = [...adresses, listingLabel, category?.name, adresses.length > 0 || category?.name ? 'İlanları' : 'Tekirdağ ve Çorlu Emlak İlanları'].filter(Boolean)

    return {
      meta: [
        {
          title: `${titleParts.join(' ')} | ${appName}`,
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
                <h2 className="title">Tekirdağ ve Çorlu Emlak İlanları</h2>
                <p className="text mb10">
                  Çorlu, Süleymanpaşa, Çerkezköy, Kapaklı ve Tekirdağ'ın diğer ilçelerindeki satılık ve kiralık ilanları filtreleyin.
                </p>
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
