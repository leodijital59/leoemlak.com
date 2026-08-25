import {ClientOnly, Link, createFileRoute} from '@tanstack/react-router';
import Mission from "@/components/pages/about/Mission";
import Image from "@/components/common/Image";
import FunFact from "@/components/pages/about/FunFact";
import Features from "@/components/pages/about/Features";
import Partner from "@/components/common/Partner";
import CallToActions from "@/components/common/CallToActions";

export const Route = createFileRoute('/(app)/about')({
  staticData: {
    title: 'Hakkımızda | Tekirdağ Çorlu Emlak Danışmanlığı',
    description: 'Leo Emlak olarak Tekirdağ, Çorlu, Çerkezköy ve çevre ilçelerde güvenilir emlak ve gayrimenkul danışmanlığı sunuyoruz. Yerel pazar bilgisiyle satılık ve kiralık ilanlarda yanınızdayız.',
    keywords: ['LeoEmlak hakkında', 'Tekirdağ emlak danışmanlığı', 'Çorlu emlak ofisi', 'Tekirdağ gayrimenkul', 'Leo Emlak'],
    canonicalPath: '/about',
  },
  head: () => ({
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `Hakkımızda - ${import.meta.env.VITE_APP_NAME}`,
        url: 'https://leoemlak.com/about',
        inLanguage: 'tr-TR',
        description: 'Leo Emlak olarak Tekirdağ, Çorlu ve çevre ilçelerde güvenilir gayrimenkul danışmanlığı sunuyoruz.',
        mainEntity: { '@id': 'https://leoemlak.com/#organization' },
      }),
    }, {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://leoemlak.com/' },
          { '@type': 'ListItem', position: 2, name: 'Hakkımızda', item: 'https://leoemlak.com/about' },
        ],
      }),
    }],
  }),
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
                    <h1 className="title">Hakkımızda — Leo Emlak Tekirdağ</h1>
                    <div className="breadcumb-list">
                      <Link to="/">Ana Sayfa</Link>
                      <Link to="/about">Hakkımızda</Link>
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
                    Tekirdağ'da gayrimenkulü
                    <br className="d-none d-lg-block" /> daha şeffaf ve güvenilir hale getiriyoruz.
                  </h2>
                </div>
                <div className="col-lg-6">
                  <p className="text mb25">
                    LeoEmlak, Tekirdağ genelinde konut ve ticari gayrimenkul arayan kullanıcıları
                    doğru ilanlarla buluşturmak için kurulmuş yerel bir emlak platformudur. Özellikle
                    Çorlu, Süleymanpaşa, Çerkezköy ve Kapaklı bölgelerinde ihtiyaçlara uygun sonuçlar
                    sunmaya odaklanıyoruz.
                  </p>
                  <p className="text mb55">
                    Doğru fiyat analizi, bölgesel pazar bilgisi ve kullanıcı dostu ilan deneyimi ile
                    hem yatırımcıların hem de yeni bir yaşam alanı arayan ailelerin karar sürecini
                    hızlandırıyoruz. Hedefimiz, Tekirdağ ve ilçelerinde dijital emlak deneyimini daha
                    erişilebilir ve güvenilir hale getirmek.
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
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <Image width={1206} height={515} priority="true"
                        className="w-100 h-100 cover"
                        src="/images/about/about-page-banner.jpg"
                        alt="LeoEmlak hakkında görsel"
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
                        Tekirdağ'da size en uygun <br className="d-none d-md-block" /> emlak çözümünü birlikte bulalım
                      </h2>
                    </div>
                    <div className="why-chose-list style2">
                      <Features />
                    </div>
                    <Link to="/properties" className="ud-btn btn-dark">
                      İlanları İncele
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
                    <h6>Tekirdağ bölgesinde güvenle tercih edilen ilan deneyimi</h6>
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
