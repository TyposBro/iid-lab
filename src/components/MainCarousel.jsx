// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import img from "../img.json";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper";

export const MainCarousel = () => {
  const slides = img.HOME.SLIDES;

  return (
    <>
      <Swiper
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        className="main-carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide}>
            <img src={`/img/home/carousel/${slide}`} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
