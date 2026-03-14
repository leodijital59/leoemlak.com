import {ClientOnly, createFileRoute} from '@tanstack/react-router'
import Form from "@/components/pages/contact/Form";
import Office from "@/components/pages/contact/Office";
import CallToActions from "@/components/common/CallToActions";

export const Route = createFileRoute('/(app)/contact')({
    staticData: {
        title: 'İletişim',
        description: 'Tekirdağ, Çorlu ve çevre ilçelerdeki emlak ihtiyaçlarınız için LeoEmlak ile iletişime geçin.',
        keywords: ['Çorlu emlak iletişim', 'Tekirdağ emlak ofisi', 'LeoEmlak iletişim', 'Çorlu gayrimenkul danışmanlığı'],
    },
    head: () => ({
        scripts: [{
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: `İletişim - ${import.meta.env.VITE_APP_NAME}`,
                inLanguage: 'tr-TR',
                description: 'Tekirdağ, Çorlu ve çevre ilçelerdeki emlak ihtiyaçlarınız için LeoEmlak ile iletişime geçin.',
            }),
        }],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <section className="home-banner-style2 p0 pt0-md pt90"></section>

            <section className="p-0">
                <iframe
                    className="home8-map contact-page"
                    loading="lazy"
                    src="https://maps.google.com/maps?q=Corlu%2C%20Tekirdag%2C%20Turkey&t=m&z=12&output=embed&iwloc=near"
                    title="Çorlu, Tekirdağ"
                    aria-label="Çorlu, Tekirdağ"
                />
            </section>

            <section>
                <div className="container">
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-5 position-relative">
                            <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                                <h4 className="form-title mb25">
                                    Sorularınız mı var? Bize yazın.
                                </h4>
                                <Form />
                            </div>
                        </div>

                        <div className="col-lg-5 offset-lg-2">
                            <h2 className="mb30 text-capitalize">
                                Tekirdağ ve Çorlu'da <br className="d-none d-lg-block" />
                                size yardımcı olmaya hazırız.
                            </h2>
                            <p className="text">
                                Satılık ya da kiralık ilan arıyor, bölgesel fiyat bilgisi almak istiyor
                                veya yatırım için doğru ilçeyi belirlemeye çalışıyorsanız bizimle
                                iletişime geçebilirsiniz. Çorlu başta olmak üzere Tekirdağ ilçelerinde
                                güncel pazar bilgileriyle destek sunuyoruz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt0 pb90 pb10-md">
                <div className="container">
                    <ClientOnly>
                        <div className="row">
                            <div
                                className="col-lg-6 m-auto"
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                <div className="main-title text-center">
                                    <h2 className="title">Hizmet Verdiğimiz Bölgeler</h2>
                                    <p className="paragraph">
                                        Çorlu merkezli olarak Tekirdağ'ın farklı ilçelerinde emlak danışmanlığı sağlıyoruz.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row" data-aos="fade-up" data-aos-delay="100">
                            <Office />
                        </div>
                    </ClientOnly>
                </div>
            </section>

            <CallToActions />
        </>
    )
}
