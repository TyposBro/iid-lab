import { Carousel } from "../components/Carousel";
import { Intro } from "../components/Intro";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="home">
      <Carousel></Carousel>
      <Intro></Intro>
      <Footer></Footer>
    </div>
  );
};
