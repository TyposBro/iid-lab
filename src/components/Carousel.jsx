// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import img from "../img.json";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper";

export const Carousel = () => {
  const slides = img.HOME.SHOWCASE;

  return (
    <div className="carousel">
      <Swiper
        slidesPerView={5}
        spaceBetween={30}
        slidesPerGroup={1}
        loop={true}
        loopFillGroupWithBlank={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="carousel__swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="carousel__slide">
            <img className="carousel__slide-img" src={`/img/home/showcase/${slide}`} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
