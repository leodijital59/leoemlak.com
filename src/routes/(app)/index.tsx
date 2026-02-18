import {ClientOnly, createFileRoute} from '@tanstack/react-router'
import Hero from "@/components/home/home-v2/hero";
import ApartmentType from "@/components/home/home-v2/ApartmentType";
import About from "@/components/home/home-v2/about";
import Cta from "@/components/home/home-v2/Cta";
import ExploreCities from "@/components/home/home-v2/ExploreCities";
import { getCategories, getCategoriesWithActiveCount } from "@/lib/server/category";
import { getActivePropertyFeatures, getDistinctLocations } from "@/lib/server/property";

export const Route = createFileRoute('/(app)/')({
    loader: async () => {
        const [categories, locations, features, categoriesWithCount] = await Promise.all([
            getCategories(),
            getDistinctLocations(),
            getActivePropertyFeatures(),
            getCategoriesWithActiveCount(),
        ]);
        return { categories, locations, features, categoriesWithCount };
    },
    component: Home,
})

function Home() {
    const { categories, locations, features, categoriesWithCount } = Route.useLoaderData();
    return (
        <>
            <section className="home-banner-style2 p0">
                <div className="home-style2">
                    <div className="container maxw1600">
                        <div className="home2-hero-banner bdrs12"></div>
                        <div className="row">
                            <div className="col-xl-10 mx-auto">
                                <Hero categories={categories} locations={locations} features={features} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb90 pb30-md">
                <div className="container">
                    <ClientOnly>
                        <div className="row justify-content-center" data-aos="fade">
                            <div className="col-lg-12">
                                <ApartmentType categories={categoriesWithCount} />
                            </div>
                        </div>
                    </ClientOnly>
                </div>
            </section>

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

            <section className="about-us">
                <div className="container">
                    <About />
                </div>
            </section>

            <Cta />
        </>
    )
}
