import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Filter, MainCarousel, Markdown } from "@/components/";
import { Down_left_dark_arrow } from "@/assets/";

export const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("Latest");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading News...</div>;
  if (error) return <div>Error loading News: {error}</div>;

  const slides = events.map((event) => event.images[0]).filter(Boolean); // Ensure images exist

  const loadMore = () => {
    setLimit((prev) => {
      if (prev + 5 > filteredEvents.length) return filteredEvents.length;
      return prev + 5;
    });
  };

  const changeSelected = (value) => {
    setSelected(value);
    setLimit(5);
  };

  const filteredEvents =
    selected === "Latest" ? events : events.filter((event) => event.type === selected);

  const uniqueTypes = ["Latest", ...new Set(events.map((event) => event.type))];

  return (
    <div className="flex flex-col justify-start items-center pt-16 pb-12 w-full h-dvh overflow-y-scroll no-scrollbar px-7 gap-4">
      <Intro slides={slides} />
      <div className="flex flex-col gap-[16px]">
        <Filter selected={selected} setSelected={changeSelected} list={uniqueTypes} />
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
      {slides.length > 0 && <MainCarousel slides={slides} />}
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
      {event.images && event.images.length > 0 && (
        <img src={event.images[0]} className="w-full rounded-[20px]" alt={event.title} />
      )}
      <div className="text-[20px] font-bold">{event.title}</div>
      <Markdown markdown={event.text} />
      <div className="h-[4px] border-y-2 border-primary_main border-solid rounded mx-8" />
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};
