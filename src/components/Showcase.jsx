import { Carousel } from "./Carousel";

export const Showcase = () => {
  return (
    <div className="showcase">
      <div className="showcase__heading-box">
        <h3 className="showcase__heading-primary">Design Showcase</h3>
        <h4 className="showcase__heading-secondary">Recent Design Activities</h4>
      </div>
      <div className="showcase__carousel">
        <Carousel></Carousel>
      </div>
    </div>
  );
};
