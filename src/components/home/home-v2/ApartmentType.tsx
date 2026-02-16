import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { Link } from "@tanstack/react-router";
import apartmentType from "@/data/apartmentType";

const ApartmentType = () => {
  return (
    <Swiper
      spaceBetween={30}
      breakpoints={{
        300: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        1024: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
      }}
      modules={[Autoplay]}
      autoplay={{ delay: 3000 }} // Set the desired delay for autoplay
    >
      {apartmentType.map((type) => (
        <SwiperSlide key={type.id}>
          <div className="item">
            <Link to="/">
              <div className="iconbox-style4">
                <span className={`icon ${type.icon}`} />
                <div className="iconbox-content">
                  <h6 className="title">{type.title}</h6>
                  <p className="text mb-0">{`${type.count} Properties`}</p>
                </div>
              </div>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ApartmentType;
