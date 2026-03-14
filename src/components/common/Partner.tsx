import { Swiper, SwiperSlide } from "swiper/react";
import Image from "@/components/common/Image";

const Partner = () => {
  const partnerImages = [
    "sahibinden-logo.jpg",
    "emlakjet-logo.png",
    "hepsiemlak-logo.png",
    "airbnb-logo.png",
  ];

  return (
    <>
      <Swiper
        spaceBetween={10} // Adjust the spacing between items as per your preference
        slidesPerView={4} // Default number of slides per view
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
        loop
        autoplay={{
          delay: 3000, // Adjust the autoplay delay (in milliseconds) as per your preference
          disableOnInteraction: false,
        }}
        className="swiper-container"
      >
        {partnerImages.map((imageName, index) => (
          <SwiperSlide key={index}>
            <div className="item">
              <div className="partner_item">
                <Image
                  width={122}
                  height={24}
                  className="wa m-auto object-fit-contain"
                  src={`/images/partners/${imageName}`}
                  alt={imageName}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Partner;
