import {ClientOnly, Link} from "@tanstack/react-router";
import Image from "@/components/common/Image.tsx";

export default function NotFound() {
    return (
        <>
            <section className="home-banner-style2 p0 pt0-md pt90"></section>

            <section className="pt-0 pb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <ClientOnly>
                            <div className="col-xl-6" data-aos="fade-left">
                                <div className="animate_content text-center text-xl-start">
                                    <div className="animate_thumb">
                                        <Image
                                            width={591}
                                            height={452}
                                            className="w-100 h-100 cover"
                                            src="/images/icon/error-page-img.svg"
                                            alt="error-page-img"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                className="col-xl-5 offset-xl-1 wow fadeInLeft"
                                data-aos="fade-right"
                            >
                                <div className="error_page_content mt80 mt50-lg text-center text-xl-start">
                                    <div className="erro_code">
                                        <span className="text-thm">40</span>4
                                    </div>
                                    <div className="h2 error_title">
                                        Aradığınız sayfa bulunamadı.
                                    </div>
                                    <p className="text fz15 mb20">
                                        Ana sayfaya dönmek için aşağıdaki bağlantıya tıklayın.
                                    </p>
                                    <Link to="/" className="ud-btn btn-dark">
                                        Ana sayfaya dön
                                        <i className="fal fa-arrow-right-long" />
                                    </Link>
                                </div>
                            </div>
                        </ClientOnly>
                    </div>
                </div>
            </section>

        </>
    )
}