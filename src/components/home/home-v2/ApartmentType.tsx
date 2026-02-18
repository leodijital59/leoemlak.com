import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "@tanstack/react-router";

const ICONS = [
  'flaticon-home',
  'flaticon-corporation',
  'flaticon-network',
  'flaticon-garden',
  'flaticon-chat',
  'flaticon-window',
  'flaticon-bird-house',
];

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  activeCount: number;
}

interface ApartmentTypeProps {
  categories: Category[];
}

const ApartmentType = ({ categories }: ApartmentTypeProps) => {
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
      autoplay={{ delay: 3000 }}
    >
      {categories.map((category, index) => (
        <SwiperSlide key={category.id}>
          <div className="item">
            <Link to="/properties" search={{ categoryId: category.id }}>
              <div className="iconbox-style4">
                <span className={`icon ${ICONS[index % ICONS.length]}`} />
                <div className="iconbox-content">
                  <h6 className="title">{category.name}</h6>
                  <p className="text mb-0">{`${category.activeCount} İlan`}</p>
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
