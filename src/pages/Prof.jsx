import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Down_straight_neutral_arrow } from "@/assets";
import { GoTo } from "@/components/";

const Prof = () => {
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch("/api/professor");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProf(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  if (loading) {
    return <div>Loading professor data...</div>;
  }

  if (error) {
    return <div>Error loading professor data: {error}</div>;
  }

  if (!prof) {
    return <div>No professor data found.</div>;
  }

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] px-[25px] w-full h-dvh overflow-y-scroll no-scrollbart gap-6">
      <Intro prof={prof} />
      <Background list={prof.background} />
      <Links /> {/* Assuming Links component doesn't need data fetched here */}
      <div className="w-full flex flex-col gap-[10px] font-semibold text-[18px]">
        <a
          href="/cv.pdf"
          target="_blank"
          className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
          download="KM_Kim-cv.pdf"
        >
          Download CV
        </a>
        <a
          className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
          href="#contact"
        >
          Contact
        </a>
      </div>
      <GoTo title="Projects Gallery" link="/projects" />
    </div>
  );
};
export default Prof;

const Intro = ({ prof }) => {
  return (
    <div className="flex flex-col gap-[30px] w-full">
      <div
        className="mx-auto w-full h-[360px] sm:h-auto sm:p-16"
        // style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      >
        <img
          src={prof.img}
          alt={prof.name}
          className="block w-full h-full sm:h-auto object-cover"
        />
      </div>

      <div className="flex flex-col gap-[10px] w-full">
        <div>
          <h2 className="font-semibold text-[16px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
            {prof.name}
          </h1>
        </div>
        <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>
        {/* Stats */}
        <div className="flex flex-col items-center gap-4 w-full py-6 sm:gap-16">
          {/* First row - always 2 items */}
          <div className="flex justify-center gap-4 w-full sm:gap-16">
            {prof.stats.slice(0, 2).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>

          {/* Second row - next 3 items */}
          <div className="flex justify-center gap-4 w-full sm:gap-16">
            {prof.stats.slice(2, 5).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>

          {/* Additional rows - any remaining items */}
          {prof.stats.length > 5 && (
            <div className="flex flex-wrap justify-center gap-4 w-full sm:gap-16">
              {prof.stats.slice(5).map((elem) => (
                <div key={elem.key} className="max-w-[120px] text-center">
                  <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                  <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Interest */}
        <div className="text-[12px]">
          <div className="font-bold">Research Interests</div>
          <div className="font-light leading-[14px] text-text_black_secondary">
            {prof.interests}
          </div>
        </div>
      </div>
    </div>
  );
};

Intro.propTypes = {
  prof: PropTypes.object.isRequired,
};

const Background = ({ list }) => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-semibold text-[16px] text-primary_main">Background</h2>
      <div className="flex flex-col gap-[10px]">
        {list.map((elem) => (
          <AccordionCard key={elem.type} title={elem.type} items={elem.items} />
        ))}
      </div>
    </div>
  );
};

Background.propTypes = {
  list: PropTypes.array.isRequired,
};

const AccordionCard = ({ title, items }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div key={title} className="w-full relative" onClick={() => setExpanded((prev) => !prev)}>
      <div
        className={`flex justify-between items-center w-full relative border-b-text_black_primary ${
          expanded ? "" : "border-b-[1px]"
        }`}
      >
        <h2 className="font-semibold text-[48px] leading-[48px]">{title}</h2>
        <Down_straight_neutral_arrow
          className={`size-[30px] transform origin-center transition duration-500 ease-out text-white bg-primary_main rounded-full p-[5px] ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`grid transition-all duration-700 ease-in-out ${
          expanded ? "grid-rows-[1fr] py-[15px] opacity-100" : "grid-rows-[0fr]  opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-hidden">
          {items.map((item) => (
            <div key={item.period} className="flex gap-4">
              <div className="font-semibold text-[11px] flex-shrink-0 w-1/3">{item.period}</div>
              <div className="font-light text-[11px]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AccordionCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

const Links = () => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-semibold text-[16px] text-primary_main">
        Professional Activities and Services
      </h2>
      <div className="flex flex-col gap-[10px]">
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Journal Papers</h2>
          <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
        </div>
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Conference Papers</h2>
          <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
        </div>
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Design Awards</h2>
          <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
        </div>
      </div>
    </div>
  );
};
