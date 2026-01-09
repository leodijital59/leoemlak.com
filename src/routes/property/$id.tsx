import { createFileRoute } from '@tanstack/react-router'
import DefaultHeader from '@/components/common/DefaultHeader'
import Footer from '@/components/common/default-footer'
import MobileMenu from '@/components/common/mobile-menu'
import EnergyClass from '@/components/property/property-single-style/common/EnergyClass'
import FloorPlans from '@/components/property/property-single-style/common/FloorPlans'
import HomeValueChart from '@/components/property/property-single-style/common/HomeValueChart'
import InfoWithForm from '@/components/property/property-single-style/common/more-info'
import NearbySimilarProperty from '@/components/property/property-single-style/common/NearbySimilarProperty'
import OverView from '@/components/property/property-single-style/common/OverView'
import PropertyAddress from '@/components/property/property-single-style/common/PropertyAddress'
import PropertyDetails from '@/components/property/property-single-style/common/PropertyDetails'
import PropertyFeaturesAminites from '@/components/property/property-single-style/common/PropertyFeaturesAminites'
import PropertyHeader from '@/components/property/property-single-style/common/PropertyHeader'
import PropertyNearby from '@/components/property/property-single-style/common/PropertyNearby'
import PropertyVideo from '@/components/property/property-single-style/common/PropertyVideo'
import PropertyViews from '@/components/property/property-single-style/common/property-view'
import ProperytyDescriptions from '@/components/property/property-single-style/common/ProperytyDescriptions'
import ReviewBoxForm from '@/components/property/property-single-style/common/ReviewBoxForm'
import VirtualTour360 from '@/components/property/property-single-style/common/VirtualTour360'
import AllReviews from '@/components/property/property-single-style/common/reviews'
import ContactWithAgent from '@/components/property/property-single-style/sidebar/ContactWithAgent'
import ScheduleTour from '@/components/property/property-single-style/sidebar/ScheduleTour'
import PropertyGallery from '@/components/property/property-single-style/single-v1/PropertyGallery'
import MortgageCalculator from '@/components/property/property-single-style/common/MortgageCalculator'
import WalkScore from '@/components/property/property-single-style/common/WalkScore'

export const Route = createFileRoute('/property/$id')({
  component: PropertyDetailPage,
})

function PropertyDetailPage() {
  const { id } = Route.useParams()

  if (typeof document !== 'undefined') {
    document.title = `Property ${id} || Homez - Real Estate Template`
  }

  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Property All Single V1 */}
      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          <div className="row">
            <PropertyHeader id={id} />
          </div>
          {/* End .row */}

          <div className="row mb30 mt30">
            <PropertyGallery id={id} />
          </div>
          {/* End .row */}

          <div className="row wrap">
            <div className="col-lg-8">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Overview</h4>
                <div className="row">
                  <OverView />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Property Description</h4>
                <ProperytyDescriptions />
                {/* End property description */}

                <h4 className="title fz17 mb30 mt50">Property Details</h4>
                <div className="row">
                  <PropertyDetails />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30 mt30">Address</h4>
                <div className="row">
                  <PropertyAddress />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
                <div className="row">
                  <PropertyFeaturesAminites />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Energy Class</h4>
                <div className="row">
                  <EnergyClass />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Floor Plans</h4>
                <FloorPlans />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Video</h4>
                <PropertyVideo />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">360° Virtual Tour</h4>
                <VirtualTour360 />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">What&apos;s Nearby?</h4>
                <PropertyNearby />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Walkscore</h4>
                <WalkScore />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Mortgage Calculator</h4>
                <MortgageCalculator />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Home Value Chart</h4>
                <HomeValueChart />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <h4 className="title fz17 mb30">Similar Properties</h4>
                  </div>
                </div>
                <NearbySimilarProperty />
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Reviews</h4>
                <div className="row">
                  <AllReviews />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Leave A Review</h4>
                <ReviewBoxForm />
              </div>
              {/* End .ps-widget */}
            </div>
            {/* End .col-lg-8 */}

            <div className="col-lg-4">
              <div className="column">
                <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative">
                  <h4 className="form-title mb25">Schedule a tour</h4>
                  <ScheduleTour />
                </div>
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <ContactWithAgent />
                </div>
              </div>
            </div>
            {/* End .col-lg-4 */}
          </div>
          {/* End .row */}

          <PropertyViews />
        </div>
      </section>
      {/* End Property All Single V1 */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  )
}
