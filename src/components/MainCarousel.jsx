// Import Swiper React components
import PropTypes from "prop-types";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "../styles/carousel.css";

import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

export const MainCarousel = ({ slides, autoplay = true }) => {
  return (
    <div className="w-full relative overflow-hidden">
      <Swiper
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, cname) {
            return (
              '<span class="' +
              cname +
              ' w-3 h-3 mt-10 rounded-full cursor-pointer transition-colors duration-300"></span>'
            );
          },
        }}
        loop={true}
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        modules={[Autoplay, Navigation, Pagination]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide}>
            <div
              src={slide}
              alt=""
              className="w-full h-[200px] rounded-[20px] sm:min-h-[500px]"
              style={{
                backgroundImage: `url(${slide})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="h-8 w-8 swiper-button-prev absolute left-1 top-1/2 z-[2] -translate-y-1/2 cursor-pointer bg-primary_main opacity-50 rounded-full ">
        <ChevronLeft className="h-8 w-8 text-white" />
      </div>
      <div className="h-8 w-8 swiper-button-next absolute right-1 top-1/2 z-[2] -translate-y-1/2 cursor-pointer bg-primary_main opacity-50 rounded-full">
        <ChevronRight className="h-8 w-8 text-white" />
      </div>
    </div>
  );
};

export default MainCarousel;

MainCarousel.propTypes = {
  slides: PropTypes.array.isRequired,
  autoplay: PropTypes.bool,
};
