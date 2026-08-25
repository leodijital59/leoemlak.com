import {ClientOnly, createFileRoute} from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { propertySearchSchema } from "@/lib/validations/property-search";
import { getActivePropertyFeatures, getDistinctLocations, searchProperties } from "@/lib/server/property";
import { getCategories } from "@/lib/server/category";
import PropertyListingPage from "@/components/listing/PropertyListingPage";
import css from '@/styles/map.css?url';
import {formatCapitilized} from "@/lib/format.ts";
import { SITE_URL, absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/seo";

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
    title: 'Tekirdağ Çorlu Emlak İlanları',
    description: 'Tekirdağ, Çorlu ve çevre ilçelerde satılık ve kiralık gayrimenkul ilanları. Daire, villa, arsa ve işyeri seçeneklerini Leo Emlak ile inceleyin.',
    keywords: ['Tekirdağ emlak ilanları', 'Çorlu satılık daire', 'Tekirdağ kiralık daire', 'Çerkezköy emlak', 'Kapaklı emlak'],
    canonicalPath: '/properties',
  },
  head: ({ match, loaderData }) => {
    const { listingType, categoryId, province, district, neighborhood } = match.search
    const appName = import.meta.env.VITE_APP_NAME as string
    const listingLabel = listingType ? (listingType === 'sold' ? 'Satılık' : 'Kiralık') : null
    const category = loaderData?.categories.find(item => item.id === categoryId)
    const addresses = [
      province ? formatCapitilized(province) : null,
      district ? formatCapitilized(district) : null,
      neighborhood ? formatCapitilized(neighborhood) : null
    ].filter(Boolean)

    const locationLabel = addresses.join(' ') || 'Tekirdağ ve Çorlu'
    const titleParts = [
      ...addresses,
      listingLabel,
      category?.name,
      addresses.length > 0 || category?.name ? 'İlanları' : 'Tekirdağ Çorlu Emlak İlanları',
    ].filter(Boolean)
    const title = `${titleParts.join(' ')} | ${appName}`
    const description = `${locationLabel}${listingLabel ? ` ${listingLabel.toLowerCase()}` : ' satılık ve kiralık'} ${category?.name ? category.name.toLowerCase() + ' ' : ''}emlak ilanları. Leo Emlak ile güncel gayrimenkul fırsatlarını inceleyin.`

    const canonicalParams = new URLSearchParams()
    if (province) canonicalParams.set('province', province)
    if (district) canonicalParams.set('district', district)
    if (neighborhood) canonicalParams.set('neighborhood', neighborhood)
    if (listingType) canonicalParams.set('listingType', listingType)
    if (categoryId) canonicalParams.set('categoryId', categoryId)
    const query = canonicalParams.toString()
    const canonical = `${absoluteUrl('/properties')}${query ? `?${query}` : ''}`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      links: [
        { rel: 'stylesheet', href: css },
        { rel: 'canonical', href: canonical },
      ],
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify(buildBreadcrumbJsonLd([
          { name: 'Ana Sayfa', path: '/' },
          { name: 'İlanlar', path: '/properties' },
          ...(district ? [{ name: `${formatCapitilized(district)} Emlak`, path: `/properties?province=TEKIRDAG&district=${district}` }] : []),
        ])),
      }, {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: titleParts.join(' '),
          description,
          url: canonical,
          isPartOf: { '@id': `${SITE_URL}/#website` },
        }),
      }],
    }
  }
});

function ListingsPage() {
  const { searchResult, categories, locations, features } = Route.useLoaderData();
  const search = Route.useSearch();
  const listingLabel = search.listingType === 'sold' ? 'Satılık' : search.listingType === 'rented' ? 'Kiralık' : null
  const locationBits = [
    search.province ? formatCapitilized(search.province) : null,
    search.district ? formatCapitilized(search.district) : null,
  ].filter(Boolean)
  const heading = [
    ...(locationBits.length ? locationBits : ['Tekirdağ ve Çorlu']),
    listingLabel,
    'Emlak İlanları',
  ].filter(Boolean).join(' ')

  return (
    <>
      <section className="home-banner-style2 p0 pt0-md pt90"></section>

      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h1 className="title">{heading}</h1>
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
