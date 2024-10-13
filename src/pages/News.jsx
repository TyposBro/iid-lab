import PropTypes from "prop-types";
import { useState } from "react";
import { Filter, MainCarousel, Markdown } from "components/";
import { Down_left_dark_arrow } from "assets/";

const events = [
  {
    title: " IID Lab Director Appointed Dean of Research Affairs at UNIST",
    text: "Professor KwanMyung Kim, Director of the IID Lab, has been appointed as the new Dean of Research Affairs at UNIST, starting from September 1, 2024. This new role recognizes his significant contributions to research and innovation at UNIST. As Dean of Research Affairs, Professor Kim will oversee and drive the university's research initiatives, fostering a collaborative and impactful research environment.",
    date: "September, 2024",
    images: [
      "/img/gallery/jeju-2024/1.png",
      "/img/gallery/jeju-2024/2.png",
      "/img/gallery/jeju-2024/3.png",
      "/img/gallery/jeju-2024/4.png",
    ],
    type: "Others",
  },

  {
    title: "Danyal Sarfraz Wins 1st Place in 3rd National Heritage Digital Content Competition",
    text: "Danyal Sarfraz, a member of the IID Lab, participated in and won first place at the 3rd National Heritage Digital Content Competition. His winning project involved creating an XR platform using Unreal Engine 5 (UE5) that allows users to remotely experience the Bangudae Petroglyphs, an ancient site over 5,000 years old. The innovative platform provides an immersive, digital exploration of this significant piece of cultural heritage, blending cutting-edge technology with historical preservation.",
    date: "September, 2024",
    images: [
      "/img/gallery/croatia-2024/1.png",
      "/img/gallery/croatia-2024/2.png",
      "/img/gallery/croatia-2024/3.png",
      "/img/gallery/croatia-2024/4.png",
      "/img/gallery/croatia-2024/5.png",
      "/img/gallery/croatia-2024/6.png",
    ],
    type: "Awards",
  },

  {
    title: "IID Lab Members Present Research at IEA 2024 Triennial Congress",
    text: "IID Lab members participated in the 22nd Triennial Congress of the International Ergonomics Association (IEA) held from August 25-29, 2024, at ICC Jeju, Republic of Korea. Daehun Lee presented a paper titled “Design of a Device for Measuring Weight Distribution Performance of Military Backpacks,” while Ulugbek Ismatullaev presented his research on “Developing a Design Guideline for the Sleeping Bag for Special Forces.” Both presentations showcased the results of ongoing projects, contributing to advancements in ergonomics and specialized design for military applications. In addition, Professor KwanMyung Kim co-chaired the Product Design 1 session, contributing to the discussions on innovative product design and ergonomics. Link to publication: Design of a Device for Measuring Weight Distribution Performance Link to publication:  Design Guideline for the Sleeping Bag for Special Forces",
    date: "August, 2024",
    images: [
      "/img/gallery/unist-2024/1.png",
      "/img/gallery/unist-2024/2.png",
      "/img/gallery/unist-2024/3.png",
    ],
    type: "Conference Presentations",
  },

  {
    title: "IID Lab Graduate Alisher Saduakas Joins DOGU ",
    text: `Alisher Saduakas, a recent graduate of IID Lab, has secured a position at DOGU as a Mechanical Design Engineer. In his new role, Alisher will be contributing to the innovation of security robots, working on cutting-edge technology aimed at enhancing safety and making the world a safer place. His expertise in mechanical design and robotics will play a key role in advancing DOGU’s mission in the security industry.`,
    date: "June, 2024",
    images: [
      "/img/gallery/gyeongju-2023/1.png",
      "/img/gallery/gyeongju-2023/2.png",
      "/img/gallery/gyeongju-2023/3.png",
      "/img/gallery/gyeongju-2023/4.png",
    ],
    type: "Employment",
  },

  {
    title: "Ulugbek Ismatullaev presents his research at Design 2024 Conference",
    text: `IID Lab members participated in the 22nd Triennial Congress of the International Ergonomics Association (IEA) held from August 25-29, 2024, at ICC Jeju, Republic of Korea. Daehun Lee presented a paper titled “Design of a Device for Measuring Weight Distribution Performance of Military Backpacks,” while Ulugbek Ismatullaev presented his research on “Developing a Design Guideline for the Sleeping Bag for Special Forces.” Both presentations showcased the results of ongoing projects, contributing to advancements in ergonomics and specialized design for military applications. In addition, Professor KwanMyung Kim co-chaired the Product Design 1 session, contributing to the discussions on innovative product design and ergonomics.`,
    date: "May, 2024",
    images: [
      "/img/gallery/milan-2023/1.png",
      "/img/gallery/milan-2023/2.png",
      "/img/gallery/milan-2023/3.png",
      "/img/gallery/milan-2023/4.png",
      "/img/gallery/milan-2023/5.png",
      "/img/gallery/milan-2023/6.png",
    ],
    type: "Conferences",
  },
];

export const News = () => {
  const [selected, setSelected] = useState("Latest");
  const [limit, setLimit] = useState(5);

  const slides = events.map((event) => {
    return event.images[0];
  });

  const loadMore = () => {
    setLimit((prev) => {
      if (prev + 5 > events.length) return events.length;
      return prev + 5;
    });
  };

  const changeSelected = (value) => {
    setSelected(value);
    setLimit(5);
  };

  const filteredEvents =
    selected === "Latest" ? events : events.filter((event) => event.type === selected);

  return (
    <div className="flex flex-col justify-start items-center pt-16 pb-12 w-full h-dvh overflow-y-scroll no-scrollbar px-7 gap-4">
      <Intro slides={slides} />
      <div className="flex flex-col gap-[16px]">
        <Filter selected={selected} setSelected={changeSelected} list={events} />
        <div className="flex flex-col gap-4">
          {filteredEvents.slice(0, limit).map((event, index) => (
            <Event key={index} event={event} />
          ))}
        </div>
      </div>
      {limit < filteredEvents.length && (
        <button
          className="flex justify-center items-center w-full h-12 text-lg font-bold text-primary_main bg-primary_light rounded-lg"
          onClick={loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default News;

const Intro = ({ slides }) => {
  return (
    <div className="flex flex-col gap-[16px] py-8 w-full">
      <h2 className="flex justify-between items-end text-5xl text-text_black_primary leading-[48px] tracking-normal">
        <span>News</span>
        <Down_left_dark_arrow className="size-[51px]" />
      </h2>
      <MainCarousel slides={slides} />
    </div>
  );
};

Intro.propTypes = {
  slides: PropTypes.array.isRequired,
};

const Event = ({ event }) => {
  return (
    <div className="flex flex-col gap-4 py-2 w-full">
      <div className="flex justify-between text-text_black_secondary text-[12px]">
        <span>{event.date}</span>
        <span className="font-bold">{event.type}</span>
      </div>
      <img src={event.images[0]} className="w-full rounded-[20px]" />
      <div className="text-[20px] font-bold">{event.title}</div>
      <Markdown markdown={event.text} />
      <div className="h-[4px] border-y-2 border-primary_main border-solid rounded mx-8" />
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};
