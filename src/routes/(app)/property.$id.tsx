import { createFileRoute, notFound } from '@tanstack/react-router'
import {formatCapitilized} from '@/lib/format'
import NearbySimilarProperty from '@/components/property/property-single-style/common/NearbySimilarProperty'
import PropertyAddress from '@/components/property/property-single-style/common/PropertyAddress'
import PropertyDetails from '@/components/property/property-single-style/common/PropertyDetails'
import PropertyFeaturesAminites from '@/components/property/property-single-style/common/PropertyFeaturesAminites'
import PropertyHeader from "@/components/property/property-single-style/single-v4/PropertyHeader";
import PropertyVideo from '@/components/property/property-single-style/common/PropertyVideo'
import ProperytyDescriptions from '@/components/property/property-single-style/common/ProperytyDescriptions'
import PropertyGallery from '@/components/property/property-single-style/single-v8/PropertyGallery'
import { getPropertyById } from '@/lib/server/property'
import NotFound from "@/components/NotFound.tsx";
import {formatAddress} from "@/lib/formatters.ts";

export const Route = createFileRoute('/(app)/property/$id')({
  staleTime: 900_000,
  component: PropertyDetailPage,
  loader: async ({ params }) => {
    try {
      return await getPropertyById({ data: params.id })
    } catch {
      throw notFound()
    }
  },
  notFoundComponent: NotFound,
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }

    const { property, images } = loaderData
    const mainImage = images.find((img) => img.isMainImage) ?? images[0]

    const listingLabel = property.listingType === 'sold' ? 'Satılık' : 'Kiralık'
    const locationParts = formatAddress(property.province, property.district, property.neighborhood)

    const title = `${property.title} | ${formatCapitilized(property.province)} ${formatCapitilized(property.district)}`
    const description = `${listingLabel} ${property.title} - ${locationParts}`
    const appName = import.meta.env.VITE_APP_NAME as string

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.title,
      description,
      image: images.map((img) => img.url),
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'TRY',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: formatCapitilized(property.neighborhood),
        addressLocality: formatCapitilized(property.district),
        addressRegion: formatCapitilized(property.province),
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
        { name: 'robots', content: 'max-image-preview:large' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        ...(mainImage ? [{ property: 'og:image', content: mainImage.url }] : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        ...(mainImage ? [{ name: 'twitter:image', content: mainImage.url }] : []),
      ],
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify(jsonLd),
      }],
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
            <div className="row">
              <PropertyHeader property={property} />
            </div>
            <PropertyGallery images={images} />
          </div>
        </section>

        <section className="pt30 pb0 bgc-white">
          <div className="container">
            <div className="row wrap gx-5">
              <div className="col-lg-8 order-last order-lg-first">
                <div className="row gy-4">
                  {property.description && (
                    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                      <h4 className="title fz17">İlan Açıklaması</h4>
                      <ProperytyDescriptions description={property.description} />
                    </div>
                  )}

                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                    <h4 className="title fz17">Konum</h4>
                    <div className="row">
                      <PropertyAddress property={property} />
                    </div>
                  </div>

                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                    <h4 className="title fz17">Özellikler</h4>
                    <PropertyFeaturesAminites features={features} />
                  </div>

                  {property.videoUrl && (
                    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30">
                      <h4 className="title fz17">Video</h4>
                      <PropertyVideo videoUrl={property.videoUrl} />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="row gy-4">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
                    <h4 className="title fz17">İlan Detayları</h4>
                    <PropertyDetails property={property} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt30 align-items-center justify-content-between">
              <div className="col-auto">
                <div className="main-title">
                  <h2 className="title">Discover Our Featured Listings</h2>
                  <p className="paragraph">
                    Aliquam lacinia diam quis lacus euismod
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
