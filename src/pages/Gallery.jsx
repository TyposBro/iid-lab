import PropTypes from "prop-types";
import { useState } from "react";
import { MainCarousel } from "components/";
import { Down_left_dark_arrow } from "assets/";

const events = [
  {
    conference: "IEA 2024",
    year: 2024,
    location: "Jeju",
    images: [
      "/img/gallery/jeju-2024/1.png",
      "/img/gallery/jeju-2024/2.png",
      "/img/gallery/jeju-2024/3.png",
      "/img/gallery/jeju-2024/4.png",
    ],
    type: "conference",
  },

  {
    conference: "DESIGN 2024",
    year: 2024,
    location: "Dubrovnik (Croacia)",
    images: [
      "/img/gallery/croatia-2024/1.png",
      "/img/gallery/croatia-2024/2.png",
      "/img/gallery/croatia-2024/3.png",
      "/img/gallery/croatia-2024/4.png",
      "/img/gallery/croatia-2024/5.png",
      "/img/gallery/croatia-2024/6.png",
    ],
    type: "conference",
  },

  {
    conference: "Teacher's Day",
    year: 2024,
    location: "UNIST",
    images: [
      "/img/gallery/unist-2024/1.png",
      "/img/gallery/unist-2024/2.png",
      "/img/gallery/unist-2024/3.png",
    ],
    type: "lab",
  },

  {
    conference: "IID Lab Annual Workshop",
    year: 2023,
    location: "Gyeongju",
    images: [
      "/img/gallery/gyeongju-2023/1.png",
      "/img/gallery/gyeongju-2023/2.png",
      "/img/gallery/gyeongju-2023/3.png",
      "/img/gallery/gyeongju-2023/4.png",
    ],
    type: "lab",
  },

  {
    conference: "IASDR 2023",
    year: 2023,
    location: "Milan",
    images: [
      "/img/gallery/milan-2023/1.png",
      "/img/gallery/milan-2023/2.png",
      "/img/gallery/milan-2023/3.png",
      "/img/gallery/milan-2023/4.png",
      "/img/gallery/milan-2023/5.png",
      "/img/gallery/milan-2023/6.png",
    ],
    type: "conference",
  },
];

export const Gallery = () => {
  const [selected, setSelected] = useState("latest");

  const slides = events.map((event) => {
    return event.images[0];
  });

  return (
    <div className="flex flex-col justify-start items-center pt-16 w-full h-dvh overflow-y-scroll no-scrollbar">
      <Intro slides={slides} />
      <div className="flex flex-col gap-[16px] py-8">
        <Filter selected={selected} setSelected={setSelected} />
        <div className="flex flex-col gap-4">
          {selected === "latest"
            ? events.map((event, index) => <Event key={index} event={event} />)
            : events
                .filter((event) => event.type === selected)
                .map((event, index) => <Event key={index} event={event} />)}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

const Intro = ({ slides }) => {
  return (
    <div className="flex flex-col gap-[16px] px-6 py-8 w-full">
      <h2 className="flex justify-between items-end text-5xl text-text_black_primary leading-[48px] tracking-normal">
        <span>Gallery</span>
        <Down_left_dark_arrow className="size-[51px]" />
      </h2>
      <MainCarousel slides={slides} />
    </div>
  );
};

Intro.propTypes = {
  slides: PropTypes.array.isRequired,
};

const Filter = ({ selected, setSelected }) => {
  return (
    <div className="flex flex-wrap gap-[10px] px-[20px] font-bold text-[15px]">
      <button
        className={`place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main px-[12px] py-[4px] border-solid rounded-[15px] text-primary_main active:text-white no-underline ${
          selected === "latest" ? "bg-primary_main text-white" : ""
        }`}
        onClick={() => setSelected("latest")}
      >
        Latest
      </button>
      <button
        className={`place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main px-[12px] py-[4px] border-solid rounded-[15px] text-primary_main active:text-white no-underline ${
          selected === "conference" ? "bg-primary_main text-white" : ""
        }`}
        onClick={() => setSelected("conference")}
      >
        Conferences
      </button>
      <button
        className={`place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main px-[12px] py-[4px] border-solid rounded-[15px] text-primary_main active:text-white no-underline ${
          selected === "lab" ? "bg-primary_main text-white" : ""
        }`}
        onClick={() => setSelected("lab")}
      >
        Lab Events
      </button>
    </div>
  );
};

Filter.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

const Event = ({ event }) => {
  return (
    <div className="flex flex-col gap-[10px] py-4">
      <div className="flex gap-[15px] px-[15px] w-full overflow-x-auto">
        {event?.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="event"
            className="rounded-[20px] w-[300px] h-[200px]"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "300px 200px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>
      <div className="text-center">
        {event?.conference}, {event?.location}
      </div>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};