import { Intro } from "../components/Intro";
import { Tracks } from "../components/Tracks";
import { Showcase } from "../components/Showcase";

export const Home = () => {
  return (
    <div className="home">
      {/* <Carousel /> */}
      <Intro />
      <Tracks />
      <Showcase />
    </div>
  );
};
