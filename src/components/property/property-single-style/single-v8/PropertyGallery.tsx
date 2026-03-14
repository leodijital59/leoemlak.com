import { useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { PropertyImage } from "@/types/property-display";
import type { Swiper as SwiperType } from 'swiper';
import Image from "@/components/common/Image";

type Props = {
  images: PropertyImage[]
}

const PropertyGallery = ({ images }: Props) => {
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
    <>
      <div className="ps-v6-slider nav_none mt30">
        <Gallery>
          <Swiper
            loop={sortedImages.length > 1}
            spaceBetween={10}
            navigation={{
              prevEl: ".prev-btn",
              nextEl: ".next-btn",
            }}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2 position-relative sp-img-content"
          >
            {sortedImages.map((item) => (
              <SwiperSlide key={item.id}>
                <Item
                  original={item.url}
                  thumbnail={item.url}
                  width={1206}
                  height={671}
                >
                  {({ ref, open }) => (
                    <Image
                      width={1206}
                      height={671}
                      onClick={open}
                      ref={ref}
                      src={item.url}
                      alt="gallery"
                      className="w-100 h-auto bdrs12 pointer"
                    />
                  )}
                </Item>

                <button className="all-tag popup-img border-0 pe-none">
                  Tüm {images.length} Fotoğrafı Gör
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </Gallery>

        {sortedImages.length > 1 && (
          <div className="row">
            <div className="col-3 col-lg-12">
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={16}
                slidesPerView={8}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper mt20"
              >
                {sortedImages.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Image
                      height={90}
                      width={83}
                      src={item.url}
                      alt="thumbnail"
                      className="w-100 bdrs12 cover pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyGallery;
