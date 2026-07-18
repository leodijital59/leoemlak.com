import { Link } from "@tanstack/react-router";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "@/components/common/Image";

const ExploreCities = () => {
  const cities = [
    {
      id: 1,
      name: "Çorlu",
      image: "/images/270x270-1.jpg",
      number: 128,
      district: 'CORLU',
    },
    {
      id: 2,
      name: "Süleymanpaşa",
      image: "/images/270x270-2.jpg",
      number: 94,
      district: 'SULEYMANPASA',
    },
    {
      id: 3,
      name: "Çerkezköy",
      image: "/images/270x270-3.jpg",
      number: 86,
      district: 'CERKEZKOY',
    },
    {
      id: 4,
      name: "Kapaklı",
      image: "/images/270x270-4.jpg",
      number: 73,
      district: 'KAPAKLI',
    },
    {
      id: 5,
      name: "Ergene",
      image: "/images/270x270-2.jpg",
      number: 58,
      district: 'ERGENE',
    },
    {
      id: 6,
      name: "Marmaraereğlisi",
      image: "/images/270x270-3.jpg",
      number: 41,
      district: 'MARMARAEREGLISI',
    },
  ];

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".cities_next__active",
          prevEl: ".cities_prev__active",
        }}
        pagination={{
          el: ".cities_pagination__active",
          clickable: true,
        }}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {cities.map((city) => (
          <SwiperSlide key={city.id}>
            <div className="item">
              <Link to="/properties" search={{ province: 'TEKIRDAG', district: city.district }}>
                <div className="feature-style2 mb30">
                  <div className="feature-img">
                    <Image
                      width={279}
                      height={279}
                      className="w-100 h-100 cover"
                      src={city.image}
                      alt="city listings"
                    />
                  </div>
                  <div className="feature-content pt20">
                    <h6 className="title mb-1">{city.name}</h6>
                    <p className="text fz15">{city.number} ilan</p>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ExploreCities;
