import { Intro } from "../components/Intro";
import { Tracks } from "../components/Tracks";
import { Showcase } from "../components/Showcase";
import { MainCarousel } from "../components/MainCarousel";

export const Home = () => {
  return (
    <div className="home">
      <MainCarousel></MainCarousel>
      <Intro />
      <Tracks />
      <Showcase />
    </div>
  );
};
