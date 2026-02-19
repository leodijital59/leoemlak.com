import {ClientOnly, createFileRoute} from '@tanstack/react-router'
import Form from "@/components/pages/contact/Form";
import Office from "@/components/pages/contact/Office";
import CallToActions from "@/components/common/CallToActions";

export const Route = createFileRoute('/(app)/contact')({
    staticData: {
        title: 'İletişim',
        description: 'Bizimle iletişime geçin. Sorularınız, ofis lokasyonlarımız ve iletişim bilgilerimiz için.',
    },
    head: () => ({
        scripts: [{
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: `İletişim - ${import.meta.env.VITE_APP_NAME}`,
                inLanguage: 'tr-TR',
                description: 'Bizimle iletişime geçin. Sorularınız, ofis lokasyonlarımız ve iletişim bilgilerimiz için.',
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
                    src="https://maps.google.com/maps?q=London%20Eye%2C%20London%2C%20United%20Kingdom&t=m&z=14&output=embed&iwloc=near"
                    title="London Eye, London, United Kingdom"
                    aria-label="London Eye, London, United Kingdom"
                />
            </section>

            <section>
                <div className="container">
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-5 position-relative">
                            <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                                <h4 className="form-title mb25">
                                    Have questions? Get in touch!
                                </h4>
                                <Form />
                            </div>
                        </div>

                        <div className="col-lg-5 offset-lg-2">
                            <h2 className="mb30 text-capitalize">
                                We’d love to hear <br className="d-none d-lg-block" />
                                from you.
                            </h2>
                            <p className="text">
                                We are here to answer any question you may have. As a partner of
                                corporates, realton has more than 9,000 offices of all sizes and
                                all potential of session.
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
                                    <h2 className="title">Visit Our Office</h2>
                                    <p className="paragraph">
                                        Realton has more than 9,000 offices of all sizes and all
                                        potential of session.
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
