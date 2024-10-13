import PropTypes from "prop-types";
import { Down_straight_neutral_arrow, Link } from "assets/";
import { truncateText } from "utils/text";
import { useState } from "react";

export const Publications = () => {
  const journalPapers = [
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      publisher: "IASDR",
      year: 2021,
      authors: ["Jaehan Park", "M. Tufail", "HB. Lee", "KM. Kim"],
      // link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },

    {
      title:
        "Comparison of three different types of exercises for selective contractions of supra- and infrahyoid muscles",
      publisher: "Scientific Reports",
      year: 2021,
      authors: ["MC Chang", "SW Park", "JY Cho", "BJ Lee,", "JM Hwang", "KM Kim", "DH Park"],
      // link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },

    {
      title:
        "How do Visitors Perceive the Significance of Tangible Cultural Heritage through a 3D Reconstructed Immersive Visual Experience?",
      publisher: "HT",
      year: 2020,
      authors: ["M. Tufail", "J.H. Park", "H. Kim", "KM. Kim"],
      // link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },

    {
      title:
        "Sustainable and ICT-Enabled Development in Developing Areas: An E-Heritage E-Commerce Service for Handicraft Marketing",
      publisher: "JoP: CS",
      year: 2018,
      authors: ["M. Tufail", "KM. Kim"],
      // link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },

    {
      title:
        "Cognitive styles in design problem solving: Insights from network-based cognitive maps",
      publisher: "Design Studies",
      year: 2015,
      authors: ["EJ. Kim", "KM. Kim"],
      // link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },

    {
      title:
        "Design Constraints Adopted by Industrial Design Students in the Concept Design phase, 27. No. 2. pp199-213",
      publisher: "AoDR",
      year: 2014,
      authors: ["Y. Kim", "KM. Kim"],
      // link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },
  ];

  const conferencePapers = [
    {
      title:
        "Introducing a framework to translate user scenarios into engineering specifications with “action steps”",
      authors: ["Ulugbek Ismatullaev", "KM. Kim"],
      year: 2024,
      publisher: "DESIGN CONFERENCE",
      location: "Dubrovnik, Croatia",
      link: "https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/introducing-a-framework-to-translate-user-scenarios-into-engineering-specifications-with-action-steps/21306D946ED8FF4C56AEC995CAE50768",
    },
    {
      title:
        "How do visitors perceive the significance of tangible cultural heritage through a 3D reconstructed immersive visual experience at the Seokguram Grotto, South Korea?",
      publisher: "Science Reports",
      year: 2022,
      authors: ["MC Chang", "SW Park", "JY Cho", "BJ Lee", "JM Hwang", "KM Kim & DH Park"],
      link: "https://www.tandfonline.com/doi/full/10.1080/1743873X.2022.2039672",
    },

    {
      title:
        "Interdisciplinary Co-Design Research Practice in the Rehabilitation of Elderly Individuals with Chronic Low Back Pain from a Senior Care Center in South Korea",
      publisher: "Applied Sciences",
      year: 2022,
      authors: ["M. Tufail", "H. Lee", "YG. Moon", "H. Kim", "KM. Kim"],
      link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },
    {
      title: "Proposal of Interaction Types for Companion-type Elderly Care Robots ",
      authors: ["JongHyun Kim", "KM. Kim"],
      year: 2022,
      publisher: "KSDS",
      location: "Seoul, South Korea",
    },

    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      authors: ["Jaehan Park", "M. Tufail", "HB. Lee", "KM. Kim"],
      year: 2021,
      publisher: "IASDR",
      location: "HongKong, China",
    },

    {
      title:
        "Understanding Detail Design Phase Using 3D CAD: A Case Study on Anybaro, December 2021 HongKong",
      authors: ["Malika Gabbas", "KM Kim"],
      year: 2021,
      publisher: "IASDR",
      location: "HongKong, China",
    },
    {
      title:
        "Classification of Transformable Products based on Changes in Product Form and Function,Virtual Conference, Sweden",
      authors: ["SJ Joo", "DB Lee", "SY Park", "H Kim", "KM Kim"],
      year: 2021,
      publisher: "ICED",
      location: "Sweden",
    },
    {
      title:
        "Integrated Keyword Mapping Process: Bridging User Research to Style Concept Development ,Virtual Conference, USA",
      authors: ["SJ Joo", "DB Lee", "SY Park", "H Kim", "KM Kim"],
      year: 2020,
      publisher: "AHFE",
      location: "USA",
    },
    {
      title:
        "Integrated Keyword Mapping Process: Bridging User Research to Style Concept Development, Virtual Conference, USA",
      authors: ["SJ Joo", "DB Lee", "SY Park", "H Kim", "KM Kim"],
      year: 2020,
      publisher: "AHFE",
      location: "USA",
    },
    {
      title:
        "Rehabilitation Design Intervention for Older Adult Women through Community-based Co-Design Activities, Manchester, United Kingdom",
      authors: ["M. Tufail", "YG. Moon", "KM. Kim"],
      year: 2019,
      publisher: "IASDR",
      location: "Manchester, United Kingdom",
    },
    {
      title:
        "Discomfort with Low-back Pain Relief Exercise Training for Older Adult Women, Washington, USA",
      authors: ["M. Tufail", "S. Park", "HB. Lee", "YG. Moon", "KM. Kim"],
      year: 2019,
      publisher: "AHFE",
      location: "Washington, USA",
    },
    {
      title:
        "A Critical Usability Problem-Solving Case of MazeCube Through Design Exploration Based on Scientific Experiments, Washington, USA",
      authors: ["JH Yang", "HS Jeon", "M. Tufail", "KM. Kim"],
      year: 2019,
      publisher: "AHFE",
      location: "Washington, USA",
    },
    {
      title: "The conditions and definition of transformable design",
      authors: ["Haebin Lee", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title: "Problems in redesigning software UX/UI in closed environment",
      authors: ["Sangjin Joo", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title: "Commercialization Case of U.CUBE Design during Master's Degree Program",
      authors: ["Jihyeon Yang", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title: "Opportunity Area in upper limb rehabilitation device design",
      authors: ["Jaehan Park", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title:
        "Understanding 'Detail Design' Phase Using 3D CAD: A Preliminary Analysis of 'Anybaro' Project",
      authors: ["Malika Gabbas", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title: "Designing Filament Recycler for Fused Deposition Modeling 3-D Printer",
      authors: ["Amira Bouchra Mezrar", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title: "A UI Design Case for a Software with Unidentified Users in a New Industry Domain",
      authors: ["Sangyun Kim", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title:
        "Rehabilitation Design Program for Older People through Co-Design Activities, DBpia (pp 238-239)",
      authors: ["Tufail Muhammad", "YangGyu Moon", "KwanMyung Kim"],
      year: 2019,
      publisher: "KSDS",
    },
    {
      title:
        "Maintenance and Diagnostics Scenario Design for Prognostics and Health Management of Robots in Manufacturing Industries, Nov.1., pp 6-11",
      authors: ["Tufail Muhammad", "Jae-eun Kim", "Guk-hwa Im", "KM Kim"],
      year: 2018,
      publisher: "KSDS",
      location: "Busan, South Korea",
    },
    {
      title:
        "Evaluation of robot's main body professional maintenance manual for Hyundai robotics, Nov.1., pp 154-155",
      authors: ["이재희", "투페일 무함마드", "현정훈", "김재은", "임국화", "김관명"],
      year: 2018,
      publisher: "KSDS",
      location: "Busan, South Korea",
    },
    {
      title:
        "A Toolkit for Teaching the Design Process: A Case of Korean Elementary School Students",
      authors: ["M. Tufail", "S. Lee", "KM. Kim"],
      year: 2018,
      publisher: "DRS",
      location: "Limerick, Ireland",
    },
    {
      title:
        "An Ergonomic based Postural Control and Balance Body Exercise Design for Young Martial Art Trainees",
      authors: ["M. Tufail", "MJ Kim", "SJ Park", "KM. Kim"],
      year: 2018,
      publisher: "AHFE",
      location: "",
    },
    {
      title:
        "The Development of Urban Pilotless Personal Aerial Vehicle and Significant Considerations as a Design Project",
      authors: ["HB Lee", "M. Tufail", "MJ Kim", "SJ Park", "KM. Kim"],
      year: 2018,
      publisher: "AHFE",
    },
    {
      title:
        "Interaction between client and design consultant: The stance of client to design consultant and its influence on design process",
      authors: ["H. Lee", "M. Tufail", "M. Kim", "K. Kim"],
      year: 2017,
      publisher: "IASDR",
      location: "Cincinnati, USA",
    },
    {
      title:
        "Passive monitoring in the workplace: Design guidelines for self quantified employee feedback system, Vol 1: Resource Sensitive Design, Design Research Applications and Case Studies",
      authors: ["M. Tufail", "H. Lee", "M. Kim", "K. Kim"],
      year: 2017,
      publisher: "ICED",
      location: "Vancouver, Canada",
    },
    {
      title:
        "The Design of Personal Protective Garments for Workplace: An Ergonomic Radiation Protection Design Practice, (pp 416-425). Springer, Cham",
      authors: ["Tufail, M.", "Lee, H.", "Kim, M.", "Kim, K"],
      year: 2017,
      publisher: "AHFE",
    },
    {
      title: "Transformable Camping Cart Design for a Jack Company, (pp 398-406). Springer, Cham",
      authors: ["M. Tufail", "KM. Kim"],
      year: 2017,
      publisher: "AHFE",
    },
    {
      title: "Integrated Design Process: A Case of Recliner Design, (pp 407-415). Springer, Cham",
      authors: ["M. Tufail", "K. Kim"],
      year: 2017,
      publisher: "AHFE",
    },
    {
      title: "How Companies adopt different design approaches",
      authors: ["K Kim"],
      year: 2016,
      publisher: "DRS",
      location: "Brighton, UK",
    },
    {
      title:
        "Difficulties in Transformable Design and Its Causes. In DS 84: Proceedings of the DESIGN",
      authors: ["Lee, H.", "Tufail, M.", "Kim, K."],
      year: 2016,
      publisher: "The Design Conference",
    },
    {
      title:
        "Flower lamp: Potential of Transformable Design and its characteristics, ADADA, Cumulus, (pp 610-613)",
      authors: ["H Lee", "K Kim"],
      year: 2015,
      publisher: "KSDS",
      location: "Gwangju, South Korea",
    },
    {
      title:
        "Client-oriented Product Development process: case study on tier 3 vendor manufacturing company, ADADA, Cumulus (pp 202-205)",
      authors: ["J Lim", "Y Ahn", "K Kim", "C Kim"],
      year: 2015,
      publisher: "KSDS",
      location: "Gwangju, South Korea",
    },
    {
      title:
        "A Study on product concept development process using analysis of user lifestyle and preferred product, ADADA, Cumulus, (pp 80-81)",
      authors: ["R Kang", "N Moon", "S Lee", "K Kim", "C Kim"],
      year: 2015,
      publisher: "KSDS",
      location: "Gwangju, South Korea",
    },
    {
      title:
        "Barriers to hinder collaboration within product development teams from designers' perspective and the development of a method to facilitate the collaboration. In DS 80-11 Vol 11: Human Behaviour in Design, Design Education",
      authors: ["KM. Kim", "NH. Kim", "SH. Jung", "DY. Kim", "Y Kim", "C Kim", "K Cho", "K Kim"],
      year: 2015,
      publisher: "ICED",
      location: "Milan, Italy",
    },
    {
      title:
        "Industrial designers and engineering designers; causes of conflicts, resolving strategies, and perceived image of each other",
      authors: ["KM Kim", "KP Lee"],
      year: 2014,
      publisher: "DRS",
      location: "Umea, Sweden",
    },
    {
      title:
        "How to teach 3D CAD to product design students providing integrated design experience, (pp 1399-1410)",
      authors: ["KM Kim", "KP Lee"],
      year: 2014,
      publisher: "The Design Conference",
      location: "Dubrovnik, Croatia",
    },
    {
      title:
        "Introduction of integrate design and design engineering process for Recliner, Nov.1., pp. 56-57",
      authors: ["HB Lee", "KM Kim"],
      year: 2014,
      publisher: "KSDS",
      location: "UNIST Ulsan, South Korea",
    },
    {
      title: "Idea Generation with Precedents, pp. 2900-2911",
      authors: ["EJ Kim", "KM Kim"],
      year: 2013,
      publisher: "IASDR",
      location: "Tokyo",
    },
    {
      title:
        "How do Industrial Design and Engineering Design Interact Together in Product Design Process, Poster Presentation",
      authors: ["KM Kim"],
      year: 2012,
      publisher: "DRS",
      location: "Bangkok, Thailand",
    },
    {
      title:
        "Two Types of Design Approaches regarding Industrial Design and Engineering Design in Product Design, pp. 1795-1805",
      authors: ["KM Kim", "KP Lee"],
      year: 2010,
      publisher: "The Design Conference",
      location: "Dubrovnik, Croatia",
    },
    {
      title:
        "Wearable-object-based Interaction for a Mobile Audio Device, CHI2010 Work-in-progress, ACM, April 10-15",
      authors: ["KM Kim", "DW Joo", "KP Lee"],
      year: 2010,
      publisher: "CHI",
      location: "Atlanta",
    },
    {
      title: "The affection of cursor frozen time to children's mouse interface",
      authors: ["KM Kim", "SK Choi", "KP Lee"],
      year: 2010,
      publisher: "Designing for Children",
      location: "Mumbai, India",
    },
    {
      title: "Ethnography study to improve a children library called 'Miracle library'",
      authors: ["KM Kim", "M Keizer", "SH Kim", "YH Kim", "YK Lim"],
      year: 2010,
      publisher: "Designing for Children",
      location: "Mumbai, India",
    },
    {
      title: "How do directional diversity and congruence in user interfaces affect usability",
      authors: ["KM Kim", "WH Lee"],
      year: 2009,
      publisher: "IASDR",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full h-dvh overflow-y-scroll">
      <div className="flex flex-col gap-[10px] px-[25px]">
        <h2 className="font-bold text-[48px] text-black leading-[48px]">Publications</h2>
        <div className="border-text_black_secondary  text-[12px]">
          We&apos;ve published world-class research and won prestigious design awards. Our students
          gain the integrated knowledge and experience needed to lead new product development,
          leading to successful careers after graduation.
        </div>
      </div>

      <PublicationList
        title="Journals"
        bg="#ffffff"
        buttonBg="#ffffff"
        buttonText="#25AAE1"
        iconColor="#25AAE1"
        list={journalPapers}
      />
      <PublicationList
        title="Conferences"
        bg="#25AAE1"
        buttonBg="#25AAE1"
        buttonText="#231F20"
        iconColor="#ffffff"
        list={conferencePapers}
      />
    </div>
  );
};

export default Publications;

const PublicationList = ({ title, bg, buttonBg, iconColor, buttonText, list }) => {
  const filterButtons = [...new Set(list.map((item) => item.year))].slice(0, 4);
  const [selected, setsetselected] = useState(null);

  const filteredList = (() => {
    if (filterButtons.includes(selected)) return list.filter((item) => item.year === selected);
    else if (selected === "Archive")
      return list.filter((item) => !filterButtons.includes(item.year));
    else return list.slice(0, 5);
  })();

  return (
    <div className="w-full flex flex-col gap-[30px] py-[30px]" style={{ backgroundColor: bg }}>
      <div className="flex flex-col gap-[25px] px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-extralight text-[42px] text-black leading-[48px]">{title}</h2>
          <Down_straight_neutral_arrow
            className="size-[56px] rotate-45"
            style={{ color: iconColor }}
          />
        </div>
        <div className="flex flex-wrap gap-[12px] border-text_black_primary text-[16px] font-medium">
          {filterButtons.map((item) => (
            <button
              className="rounded-full px-[24px] py-[8px] border-2 "
              style={{
                borderColor: buttonText,
                backgroundColor: selected === item ? buttonText : buttonBg,
                color: selected === item ? buttonBg : buttonText,
              }}
              key={item}
              onClick={() => setsetselected(item)}
            >
              {item}
            </button>
          ))}
          <button
            className="rounded-full px-[24px] py-[8px] border-2"
            onClick={() => setsetselected("Archive")}
            style={{
              borderColor: buttonText,
              backgroundColor: selected === "Archive" ? buttonText : buttonBg,
              color: selected === "Archive" ? buttonBg : buttonText,
            }}
          >
            Archive
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[15px] px-[25px] w-full">
        {filteredList.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-col justify-between gap-[16px] bg-[#C1EDFF] p-[20px] rounded-[20px] w-full"
            >
              <span className=" text-[20px]">{truncateText(item.title, 150)}</span>
              <div className="flex flex-col gap-4">
                <h4 className=" flex gap-3 justify-between items-center text-[20px]">
                  <span className="font-bold shrink-0">{item.publisher}</span>
                  <span className="">{item.year}</span>
                  <a
                    className="flex justify-end items-center grow shrink-0"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.link && <Link className="size-[24px] text-[#10719A]" />}
                  </a>
                </h4>
                <h4 className="font-semibold text-[#10719A] text-[14px]">
                  {item.authors.join(", ")}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

PublicationList.propTypes = {
  title: PropTypes.string,
  bg: PropTypes.string,
  buttonBg: PropTypes.string,
  buttonText: PropTypes.string,
  iconColor: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      journal: PropTypes.string,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      authors: PropTypes.string,
    })
  ),
};
