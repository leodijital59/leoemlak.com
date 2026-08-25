import { createFileRoute, notFound } from '@tanstack/react-router'
import {formatCapitilized} from '@/lib/format'
import NearbySimilarProperty from '@/components/property/property-single-style/common/NearbySimilarProperty'
import PropertyDetails from '@/components/property/property-single-style/common/PropertyDetails'
import PropertyFeaturesAminites from '@/components/property/property-single-style/common/PropertyFeaturesAminites'
import PropertyHeader from "@/components/property/property-single-style/single-v4/PropertyHeader";
import PropertyVideo from '@/components/property/property-single-style/common/PropertyVideo'
import PropertyDescriptions from '@/components/property/property-single-style/common/PropertyDescriptions.tsx'
import PropertyGallery from '@/components/property/property-single-style/single-v6/PropertyGallery'
import { getPropertyById } from '@/lib/server/property'
import NotFound from "@/components/NotFound";
import {formatAddress} from "@/lib/formatters";
import css from '@/styles/map.css?url';
import { absoluteUrl, buildBreadcrumbJsonLd } from '@/lib/seo'

export const Route = createFileRoute('/(app)/property/$id')({
  staleTime: import.meta.env.PROD ? 900_000 : 0,
  component: PropertyDetailPage,
  loader: async ({ params }) => {
    try {
      return await getPropertyById({ data: params.id })
    } catch {
      throw notFound()
    }
  },
  notFoundComponent: NotFound,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] }

    const { property, images } = loaderData
    const mainImage = images.find((img) => img.isMainImage) ?? images[0]

    const listingLabel = property.listingType === 'sold' ? 'Satılık' : 'Kiralık'
    const locationParts = formatAddress(property.province, property.district, property.neighborhood)
    const district = formatCapitilized(property.district)
    const province = formatCapitilized(property.province)

    const title = `${property.title} | ${listingLabel} ${district} ${province}`
    const description = `${listingLabel} ${property.title} — ${locationParts}. Leo Emlak ile Tekirdağ ve Çorlu gayrimenkul fırsatlarını inceleyin.`
    const appName = import.meta.env.VITE_APP_NAME as string
    const canonical = absoluteUrl(`/property/${params.id}`)

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      '@id': canonical,
      url: canonical,
      name: property.title,
      description,
      datePosted: property.createdAt,
      image: images.map((img) => img.url),
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'TRY',
        availability: property.listingStatus === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: formatCapitilized(property.neighborhood),
        addressLocality: district,
        addressRegion: province,
        addressCountry: 'TR',
      },
    }

    if (property.grossArea) {
      jsonLd.floorSize = { '@type': 'QuantitativeValue', value: property.grossArea, unitCode: 'MTK' }
    }
    if (property.rooms) jsonLd.numberOfRooms = property.rooms
    if (property.bathrooms) jsonLd.numberOfBathroomsTotal = property.bathrooms

    return {
      meta: [
        { title: `${title} | ${appName}` },
        { name: 'description', content: description },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: canonical },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        ...(mainImage ? [{ property: 'og:image', content: mainImage.url }] : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        ...(mainImage ? [{ name: 'twitter:image', content: mainImage.url }] : []),
      ],
      links: [
        { rel: 'stylesheet', href: css },
        { rel: 'canonical', href: canonical },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(buildBreadcrumbJsonLd([
            { name: 'Ana Sayfa', path: '/' },
            { name: 'İlanlar', path: '/properties' },
            { name: `${district} Emlak`, path: `/properties?province=TEKIRDAG&district=${property.district}` },
            { name: property.title, path: `/property/${params.id}` },
          ])),
        },
      ],
    }
  },
})

function PropertyDetailPage() {
  const { property, images, features } = Route.useLoaderData()

  return (
      <>
        <section className="home-banner-style2 p0 pt0-md pt90"></section>

        <section className="pt60 pb60 bgc-f7">
          <div className="container">
            <div className="row mb-4">
              <PropertyHeader property={property} />
            </div>

            <div className="row wrap gx-5">
              <div className="col-lg-8 order-last order-lg-first">
                <div className="row gy-4">
                  <PropertyGallery images={images} location={property.latitude && property.longitude ? `${property.latitude},${property.longitude}` : encodeURIComponent(formatAddress(property.province, property.district, property.neighborhood))} />

                  {property.description && (
                    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                      <h2 className="title fz17">İlan Açıklaması</h2>
                      <PropertyDescriptions description={property.description} />
                    </div>
                  )}

                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                    <h2 className="title fz17">Özellikler</h2>
                    <PropertyFeaturesAminites features={features} />
                  </div>

                  {property.videoUrl && (
                    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30">
                      <h2 className="title fz17">Video</h2>
                      <PropertyVideo videoUrl={property.videoUrl} />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="row gy-4">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                    <h2 className="title fz17">İlan Detayları</h2>
                    <PropertyDetails property={property} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt30 align-items-center justify-content-between">
              <div className="col-auto">
                <div className="main-title">
                  <h2 className="title">Benzer Bölge İlanları</h2>
                  <p className="paragraph">
                    Tekirdağ ve çevresinde ilginizi çekebilecek diğer ilanlara göz atın
                  </p>
                </div>
              </div>

              <div className="col-auto mb30">
                <div className="row align-items-center justify-content-center">
                  <div className="col-auto">
                    <button className="featured-prev__active swiper_button">
                      <i className="far fa-arrow-left-long" />
                    </button>
                  </div>

                  <div className="col-auto">
                    <div className="pagination swiper--pagination featured-pagination__active" />
                  </div>

                  <div className="col-auto">
                    <button className="featured-next__active swiper_button">
                      <i className="far fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="property-city-slider">
                  <NearbySimilarProperty />
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
  )
}
