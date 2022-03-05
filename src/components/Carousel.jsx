// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper";

export const Carousel = () => {
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
        <SwiperSlide className="carousel__slide">
          <img className="carousel__slide-img" src="img/we-are-creative.jpg" alt="" />
        </SwiperSlide>
        <SwiperSlide className="carousel__slide">
          <img className="carousel__slide-img" src="img/we-are-creative.jpg" alt="" />
        </SwiperSlide>
        <SwiperSlide className="carousel__slide">
          <img className="carousel__slide-img" src="img/we-are-creative.jpg" alt="" />
        </SwiperSlide>
        <SwiperSlide className="carousel__slide">
          <img className="carousel__slide-img" src="img/we-are-creative.jpg" alt="" />
        </SwiperSlide>
        <SwiperSlide className="carousel__slide">
          <img className="carousel__slide-img" src="img/we-are-creative.jpg" alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
