import { useState } from "react";
import PropTypes from "prop-types";

import { Down_straight_neutral_arrow } from "assets";

const prof = {
  img: "/img/people/director/prof.png",
  name: "KwanMyung Kim",
  role: "Lab Director - Tenured Full Professor",
  desc: "Dr. KwanMyung Kim is a full professor in Department of Design and the director of Integration and Innovation Design Lab (IIDL). He was a Dean of Graduate School of Creative Design Engineering during 2016-2020. He serves as an editor for Archives of Design Research and ICONARP International Journal of Architecture and Planning. He is also a CEO of ID SPACE Corp., a start-up company that commercializes academic research outcomes. Before joining UNIST, he worked in industry for 14 years as a product designer/engineer. With his strong practical knowledge and experience he peruses to integrate design and engineering, and industry and academic knowledge in the major IIDL’s research domains including Design for Elderly, Rehabilitation and Health Care.",
  stats: [
    { key: "Design Awards", value: 29 },
    { key: "Academic Awards", value: 7 },
    { key: "International Journal Publications", value: 14 },
    { key: "Conference Papers", value: 39 },
    { key: "Registered Patents", value: 27 },
  ],
  interests:
    "Integrated Design Methodology;  Product Design;  Engineering Design; Design Engineering;  New Product Design;  통합디자인방법론;  공학디자인;  디자인엔지니어링;  신제품개발",
  background: [
    {
      type: "Education",
      items: [
        {
          period: "02/2008 - 08/2014",
          desc: "PhD. Industrial Design, Korea Advanced Institute of Science and Technology, South Korea Thesis title: “Collaborative Product Design Processes between Industrial Designers and  Engineering Designers – A Case Study of Six Consumer Product Companies”",
        },
        {
          period: "03/1992 - 02/1994",
          desc: "MSc, Industrial Design, Korea Advanced Institute of Science and Technology, South Korea Thesis title: “A Study on The Application of Concurrent Engineering Concept in Industrial Design  Practice”",
        },
        {
          period: "03/1987 - 02/1992",
          desc: "BSc, Industrial Design, Korea Advanced Institute of Science and Technology, South Korea",
        },
        {
          period: "1995 - 1996",
          desc: "Automobile Design Department, Samsung Innovative Lab of Samsung (In-house design training  institute)",
        },
      ],
    },
    {
      type: "Academia",
      items: [
        {
          period: "03/2022 - Present",
          desc: "Full Professor, Design Department, UNIST, Ulsan Korea",
        },
        {
          period: "03/2016 - 02/2022",
          desc: "Associate Professor, Design Department, UNIST, Ulsan Korea",
        },
        {
          period: "06/2010 - 02/2016",
          desc: "Assistant Professor, School of Design and Human Engineering, UNIST, Ulsan Korea",
        },
        {
          period: "03/2016 - 02/2020",
          desc: "Dean, Graduate School of Creative Design Engineering, UNIST (Played a decisive role in  developing the Graduate School of Creative Design Engineering), Ulsan Korea",
        },
        {
          period: "09/2013 - 02/2018",
          desc: "Industrial Design Track Coordinator, School of Design and Human Engineering, UNIST, Ulsan  Korea",
        },
      ],
    },
    {
      type: "Industry",
      items: [
        {
          period: "01/2019 - Present",
          desc: "CEO, Founder of ID SPACE Corp., Ulsan Korea, (a UNIST faculty startup company to commercialize  UNIST design research outcomes. Released a RedDot Design Award Winner, ‘UCUBE’ in the  market in 2021.)",
        },
        {
          period: "06/2006 - 01/2008",
          desc: "Director in Product Design, Spring Time Corp. (Design Consulting Company), Seoul Korea",
        },
        {
          period: "05/2000 - 05/2006",
          desc: " Senior Design Engineer / Co-founder, HESI (Venture Company), Kiheung Korea",
        },
        {
          period: "12/1998 - 04/2000",
          desc: "Senior Product Designer / Co-founder, Design Dream Corp. (Design Consulting Company), Seoul Korea",
        },
        {
          period: "02/1994 - 11/1998",
          desc: "Product Designer, Samsung Heavy Industries Ltd., Seoul Korea",
        },
      ],
    },
  ],
};

const Prof = () => {
  return (
    <div className="flex flex-col justify-start items-center pt-[95px] px-[25px] w-full h-dvh overflow-y-scroll no-scrollbart gap-6">
      <Intro prof={prof} />
      <Background list={prof.background} />
      <Links list={prof.background} />

      <div className="w-full flex flex-col gap-[10px] font-semibold text-[18px]">
        <a
          href="https://iidl.unist.ac.kr/Profiles/index.html"
          target="_blank"
          className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
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
    </div>
  );
};
export default Prof;

const Intro = ({ prof }) => {
  return (
    <div className="flex flex-col gap-[30px] w-full">
      <div
        className="mx-auto w-full min-h-[360px]"
        style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      />
      <div className="flex flex-col gap-[10px] w-full">
        <div>
          <h2 className="font-semibold text-[16px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
            {prof.name}
          </h1>
        </div>
        <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>
        {/* Stats */}
        <div className="flex flex-col items-center gap-4 w-full py-6 ">
          {/* First row - always 2 items */}
          <div className="flex justify-center gap-4 w-full">
            {prof.stats.slice(0, 2).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>

          {/* Second row - next 3 items */}
          <div className="flex justify-center gap-4 w-full">
            {prof.stats.slice(2, 5).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>

          {/* Additional rows - any remaining items */}
          {prof.stats.length > 5 && (
            <div className="flex flex-wrap justify-center gap-4 w-full">
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
