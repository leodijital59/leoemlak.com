import {ClientOnly, createFileRoute} from '@tanstack/react-router'
import Hero from "@/components/home/home-v2/hero";
import ApartmentType from "@/components/home/home-v2/ApartmentType";
import About from "@/components/home/home-v2/about";
import Cta from "@/components/home/home-v2/Cta";
import ExploreCities from "@/components/home/home-v2/ExploreCities";

export const Route = createFileRoute('/(app)/')({
    component: Home,
})

function Home() {
    return (
        <>
            {/* Home Banner Style V2 */}
            <section className="home-banner-style2 p0">
                <div className="home-style2">
                    <div className="container maxw1600">
                        <div className="home2-hero-banner bdrs12"></div>
                        <div className="row">
                            <div className="col-xl-10 mx-auto">
                                <Hero />
                            </div>
                        </div>
                    </div>
                    {/* End .container */}
                </div>
            </section>
            {/* End Home Banner Style V2 */}

            {/* Explore Apartment */}
            <section className="pb90 pb30-md">
                <div className="container">
                    <ClientOnly>
                        <div className="row justify-content-center" data-aos="fade">
                            <div className="col-lg-12">
                                <ApartmentType />
                            </div>
                        </div>
                    </ClientOnly>
                </div>
            </section>
            {/* End Explore Apartment */}

            {/* Property Cities */}
            <section className="pt0 pb90 pb50-md">
                <div className="container">
                    <ClientOnly>
                        <div className="row justify-content-between align-items-center">
                            <div className="col-auto">
                                <div
                                    className="main-title"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >
                                    <h2 className="title">Explore Cities</h2>
                                    <p className="paragraph">
                                        Aliquam lacinia diam quis lacus euismod
                                    </p>
                                </div>
                            </div>

                            <div className="col-auto mb30">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto">
                                        <button className="cities_prev__active swiper_button">
                                            <i className="far fa-arrow-left-long" />
                                        </button>
                                    </div>

                                    <div className="col-auto">
                                        <div className="pagination swiper--pagination cities_pagination__active" />
                                    </div>

                                    <div className="col-auto">
                                        <button className="cities_next__active swiper_button">
                                            <i className="far fa-arrow-right-long" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
                                <div className="property-city-slider">
                                    <ExploreCities />
                                </div>
                            </div>
                        </div>
                    </ClientOnly>
                </div>
            </section>
            {/* End property cities */}

            {/* About Us */}
            <section className="about-us">
                <div className="container">
                    <About />
                </div>
            </section>
            {/* End About Us */}

            {/* Our CTA */}
            <Cta />
            {/* End Our CTA */}
        </>
    )
}
