import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "photoswipe/dist/photoswipe.css";
import type {PropertyImage} from "@/types/property-display";
import type {Swiper as SwiperType} from "swiper";
import Image from "@/components/common/Image";

type Props = {
  images: PropertyImage[],
  location?: string,
}

const PropertyGallery = ({ images, location }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Sort images: main image first, then by order
  const sortedImages = [...images].sort((a, b) => {
    if (a.isMainImage) return -1;
    if (b.isMainImage) return 1;
    return a.order - b.order;
  });

  // Show placeholder if no images
  if (images.length === 0) {
    return (
        <div className="ps-v6-slider nav_none mt30">
          <div className="text-center p-5 bg-light bdrs12">
            <p className="text-muted">Bu ilan için görsel bulunmuyor</p>
          </div>
        </div>
    );
  }

  return (
    <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
      <div className="ps-v4-hero-tab position-relative">
        <ul
          className="nav nav-pills justify-content-end"
          id="pills-tab2"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active mr10"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              <span className="flaticon-images text-white fz20" />
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link mr10"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              <span className="flaticon-map text-white fz20" />
            </button>
          </li>
        </ul>
      </div>
      {/* End .ps-v4-hero-tab */}

      <div className="ps-v4-hero-tab">
        <div
          className="tab-content overflow-visible"
          id="pills-tabContent2"
        >
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div className="container p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="ps-v6-slider nav_none slider-1-grid owl-theme owl-carousel">
                    <Swiper
                      loop={true}
                      spaceBetween={10}
                      navigation={{
                        prevEl: ".prev-btn",
                        nextEl: ".next-btn",
                      }}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper2"
                    >
                      {sortedImages.map((item) => (
                        <SwiperSlide key={item.id}>
                          <Image
                              layout="fullWidth"
                            height={490}
                            src={item.url}
                            alt="gallery"
                            className="w-100 object-fit-contain bdrs12"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="row">
                      <div className="col-lg-7 col-md-8">
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          loop={true}
                          spaceBetween={10}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          modules={[FreeMode, Navigation, Thumbs]}
                          className="mySwiper mt20"
                        >
                          {sortedImages.map((item, i) => (
                            <SwiperSlide key={i}>
                              <Image
                                height={90}
                                width={83}
                                src={item.url}
                                alt="image"
                                className="w-100 bdrs12 cover pointer"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End tab-pane */}

          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <iframe
                className="position-relative h510 w-100"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${location}&t=m&z=14&output=embed&iwloc=near`}
                allowFullScreen
            />
          </div>
        </div>
      </div>
      {/* End ps-v4-hero-tab content */}
    </div>
  );
};

export default PropertyGallery;
