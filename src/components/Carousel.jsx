import PropTypes from "prop-types";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const Carousel = ({ slides }) => {
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
        className=""
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="">
            <img className="" src={slide} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;

Carousel.propTypes = {
  slides: PropTypes.array.isRequired,
};
