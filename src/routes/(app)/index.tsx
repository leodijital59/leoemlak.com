import {ClientOnly, Link, createFileRoute} from '@tanstack/react-router'
import Hero from "@/components/home/home-v2/hero";
import ApartmentType from "@/components/home/home-v2/ApartmentType";
import About from "@/components/home/home-v2/about";
import Cta from "@/components/home/home-v2/Cta";
import ExploreCities from "@/components/home/home-v2/ExploreCities";
import { getCategories, getCategoriesWithActiveCount } from "@/lib/server/category";
import { getActivePropertyFeatures, getDistinctLocations } from "@/lib/server/property";
import { DISTRICT_LANDINGS, SITE_URL, buildBreadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute('/(app)/')({
    staticData: {
        title: 'Tekirdağ Çorlu Emlak | Satılık Kiralık Daire ve Konut',
        description: 'Leo Emlak — Tekirdağ ve Çorlu emlak ofisi. Satılık daire, kiralık konut, villa, arsa ve işyeri ilanları. Çerkezköy, Süleymanpaşa, Kapaklı ve tüm Tekirdağ ilçelerinde güncel gayrimenkul fırsatları.',
        keywords: [
            'Tekirdağ emlak',
            'Çorlu emlak',
            'Tekirdağ satılık daire',
            'Çorlu satılık daire',
            'Çorlu kiralık daire',
            'Tekirdağ gayrimenkul',
            'Leo Emlak',
            'Çerkezköy emlak',
        ],
        canonicalPath: '/',
    },
    head: () => ({
        scripts: [
            {
                type: 'application/ld+json',
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    '@id': `${SITE_URL}/#website`,
                    name: import.meta.env.VITE_APP_NAME,
                    url: SITE_URL,
                    inLanguage: 'tr-TR',
                    description: 'Tekirdağ ve Çorlu emlak ilanları — satılık ve kiralık daire, villa, arsa ve işyeri.',
                    publisher: { '@id': `${SITE_URL}/#organization` },
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: `${SITE_URL}/properties?q={search_term_string}`,
                        'query-input': 'required name=search_term_string',
                    },
                }),
            },
            {
                type: 'application/ld+json',
                children: JSON.stringify(buildBreadcrumbJsonLd([
                    { name: 'Ana Sayfa', path: '/' },
                ])),
            },
        ],
    }),
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
                                    <h2 className="title">Tekirdağ'ın Öne Çıkan İlçeleri</h2>
                                    <p className="paragraph">
                                        Çorlu başta olmak üzere yatırım ve yaşam için güçlü bölgeleri keşfedin
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

            <section className="pt0 pb90 pb50-md">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="main-title text-center" data-aos="fade-up">
                                <h2 className="title">Tekirdağ ve İlçelerinde Hızlı Emlak Arama</h2>
                                <p className="paragraph">
                                    Çorlu, Süleymanpaşa, Çerkezköy ve diğer Tekirdağ ilçelerindeki satılık ve kiralık ilanlara doğrudan ulaşın.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {DISTRICT_LANDINGS.map((item, index) => (
                            <div className="col-md-6 col-xl-4" key={item.slug} data-aos="fade-up" data-aos-delay={100 + (index * 50)}>
                                <div className="default-box-shadow1 bgc-white bdrs12 p30 h-100">
                                    <h3 className="mb15">{item.title}</h3>
                                    <p className="text mb20">{item.description}</p>
                                    <Link
                                        to="/properties"
                                        search={{ province: 'TEKIRDAG', district: item.slug }}
                                        className="ud-btn btn-thm-border"
                                    >
                                        {item.name} İlanlarını Gör
                                        <i className="fal fa-arrow-right-long" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
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
