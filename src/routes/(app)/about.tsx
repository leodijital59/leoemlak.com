import {ClientOnly, Link, createFileRoute} from '@tanstack/react-router';
import Mission from "@/components/pages/about/Mission";
import Image from "@/components/common/Image";
import FunFact from "@/components/pages/about/FunFact";
import Features from "@/components/pages/about/Features";
import Partner from "@/components/common/Partner";
import CallToActions from "@/components/common/CallToActions";

export const Route = createFileRoute('/(app)/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
        <section className="home-banner-style2 p0 pt0-md pt90">
          <div className="breadcumb-section2">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="breadcumb-style1">
                    <h2 className="title">About Us</h2>
                    <div className="breadcumb-list">
                      <Link to="/">Home</Link>
                      <Link to="/about">About</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="our-about pb90">
          <div className="container">
            <ClientOnly>
              <div className="row" data-aos="fade-up" data-aos-delay="300">
                <div className="col-lg-6">
                  <h2>
                    We&apos;re on a Mission to Change{" "}
                    <br className="d-none d-lg-block" /> View of Real Estate Field.
                  </h2>
                </div>
                <div className="col-lg-6">
                  <p className="text mb25">
                    It doesn’t matter how organized you are — a surplus of toys will
                    always ensure your house is a mess waiting to happen.
                    Fortunately, getting kids on board with the idea of ditching
                    their stuff is a lot easier than it sounds.
                  </p>
                  <p className="text mb55">
                    Maecenas quis viverra metus, et efficitur ligula. Nam congue
                    augue et ex congue, sed luctus lectus congue. Integer convallis
                    condimentum sem. Duis elementum tortor eget condimentum tempor.
                    Praesent sollicitudin lectus ut pharetra pulvinar.
                  </p>
                  <div className="row">
                    <Mission />
                  </div>
                </div>
              </div>
            </ClientOnly>
          </div>
        </section>

        <section className="our-about pt-0">
          <div className="container">
            <ClientOnly>
              <div className="row" data-aos="fade-up" data-aos-delay="300">
                <div className="col-lg-12">
                  <div className="about-page-img">
                    <Image
                        width={1206}
                        height={515}
                        priority="true"
                        className="w-100 h-100 cover"
                        src="/images/about/about-page-banner.jpg"
                        alt="about banner"
                    />
                  </div>
                </div>
              </div>
            </ClientOnly>
          </div>
        </section>

        <section className="pt-0">
          <div className="container">
            <ClientOnly>
              <div
                  className="row justify-content-center"
                  data-aos="fade-up"
                  data-aos-delay="300"
              >
                <FunFact />
              </div>
            </ClientOnly>
          </div>
        </section>

        <section className="pt30 pb-0">
          <div className="cta-banner3 bgc-thm-light mx-auto maxw1600 pt100 pt60-lg pb90 pb60-lg bdrs24 position-relative overflow-hidden mx20-lg">
            <div className="container">
              <div className="row">
                <ClientOnly>
                  <div
                      className="col-md-6 col-lg-5 pl30-md pl15-xs"
                      data-aos="fade-left"
                      data-aos-delay="300"
                  >
                    <div className="mb30">
                      <h2 className="title text-capitalize">
                        Let’s find the right <br className="d-none d-md-block" />{" "}
                        selling option for you
                      </h2>
                    </div>
                    <div className="why-chose-list style2">
                      <Features />
                    </div>
                    <Link to="/" className="ud-btn btn-dark">
                      Learn More
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  </div>
                </ClientOnly>
              </div>
            </div>
          </div>
        </section>

        <section className="our-partners">
          <div className="container">
            <div className="row">
              <ClientOnly>
                <div className="col-lg-12" data-aos="fade-up">
                  <div className="main-title text-center">
                    <h6>Trusted by the world’s best</h6>
                  </div>
                </div>
                <div className="col-lg-12 text-center">
                  <div
                      className="dots_none nav_none"
                      data-aos="fade-up"
                      data-aos-delay="300"
                  >
                    <Partner />
                  </div>
                </div>
              </ClientOnly>
            </div>
          </div>
        </section>

        <CallToActions />
      </>
  )
}
