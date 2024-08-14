import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Down_left_dark_arrow, Up_right_neutral_arrow, Down_right_light_arrow } from "assets/";
import { useRef } from "react";

export const Home = () => {
  const ref = useRef(null);

  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll p-[25px] pt-[95px]">
      <Intro />
      <div className="w-full my-[30px]">
        <LiteYouTubeEmbed
          id="s5vJO6vUeaM" // Default none, id of the video or playlist
          adNetwork={true} // Default true, to preconnect or not to doubleclick addresses called by YouTube iframe (the adnetwork from Google)
          params="" // any params you want to pass to the URL, assume we already had '&' and pass your parameters string
          playlist={false} // Use true when your ID be from a playlist
          playlistCoverId="L2vS_050c-M" // The ids for playlists did not bring the cover in a pattern to render so you'll need pick up a video from the playlist (or in fact, whatever id) and use to render the cover. There's a programmatic way to get the cover from YouTube API v3 but the aim of this component is do not make any another call and reduce requests and bandwidth usage as much as possibe
          poster="hqdefault" // Defines the image size to call on first render as poster image. Possible values are "default","mqdefault",  "hqdefault", "sddefault" and "maxresdefault". Default value for this prop is "hqdefault". Please be aware that "sddefault" and "maxresdefault", high resolution images are not always avaialble for every video. See: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
          title="YouTube Embed" // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
          noCookie={true} // Default false, connect to YouTube via the Privacy-Enhanced Mode using https://www.youtube-nocookie.com
          ref={ref} // Use this ref prop to programmatically access the underlying iframe element
          activeClass="lyt-activated" // Default as "lyt-activated", gives control to wrapper once clicked
          iframeClass="" // Default none, gives control to add a class to iframe element itself
          playerClass="lty-playbtn" // Default as "lty-playbtn" to control player button styles
          wrapperClass="yt-lite rounded-[30px]" // Default as "yt-lite" for the div wrapping the area, the most important class and needs extra attention, please refer to LiteYouTubeEmbed.css for a reference.
        />
      </div>
      <Prof />
      <Members />
      <Projects />
      <Journal />
      <Conference />
    </div>
  );
};

export default Home;

const Intro = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[465px] bg-border_dark rounded-[30px]"></div>
      <div className="w-full flex flex-col gap-[30px]">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-special text-text_black_primary text-[48px] font-bold">
            Integration <span className="text-primary_main ">&</span> Innovation Design
          </h1>
          <h3 className="font-regular text-text_black_secondary text-[12px]">
            Integration + Innovation Design Lab focuses on design and development of innovative
            products and services by integrating Design, Ergonomics, Engineering, Technology and
            Entrepreneurship.
          </h3>
        </div>
        <div className="flex flex-col gap-[10px] font-semibold text-[18px] font-regular">
          <button className="w-full h-[50px] border-border_dark rounded-[15px] grid place-content-center border-2 border-solid ">
            Publications
          </button>
          <button className="w-full h-[50px] border-border_dark rounded-[15px] grid place-content-center border-2 border-solid ">
            Achievements
          </button>
        </div>
      </div>
    </div>
  );
};

const Prof = () => {
  const prof = {
    img: "/img/people/director/prof.png",
    name: "Professor KwanMyung Kim",
    role: "Lab Director",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna porttitor rhoncus dolor purus non. Turpis massa sed elementum tempus egestas sed. Habitant morbi tristique senectus et netus et malesuada fames ac.",
  };

  return (
    <div className="my-[30px] w-full flex flex-col gap-[30px]">
      <div
        className="w-[240px] h-[300px] rounded-[30px]"
        style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      ></div>
      <div className="w-full flex flex-col gap-[5px]">
        <h2 className="font-regular font-bold text-primary_main text-[20px]">{prof.role}</h2>
        <h1 className="font-super_special text-text_black_primary text-[36px] leading-[36px] font-bold">
          {prof.name}
        </h1>
        <h3 className="font-regular text-[12px] text-text_black_secondary">{prof.desc}</h3>
      </div>
      <div className="flex flex-col gap-[10px] font-semibold text-[18px] font-regular">
        <button className="w-full h-[50px] border-primary_main bg-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-text_white_primary">
          Publications
        </button>
        <button className="w-full h-[50px]  border-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-primary_main ">
          Achievements
        </button>
      </div>
    </div>
  );
};
const Members = () => {
  const members = [
    { img: "", name: "Ulugbek", role: "PhD Candidate" },
    { img: "", name: "Daehun Lee", role: "PhD Candidate" },
    { img: "", name: "John Doe", role: "Masters" },
    { img: "", name: "John Doe", role: "Masters" },
  ];

  return (
    <div className="w-full my-[30px] flex flex-col gap-[30px] ">
      <div className="flex flex-col gap-[10px]">
        <Down_right_light_arrow className="w-[34px] h-[34px]" alt="down right light arrow icon" />
        <h1 className="text-[42px] text-text_black_primary font-light font-super_special leading-[46px] ">
          Team Members
        </h1>
      </div>
      <div className="w-full flex flex-row gap-[10px] overflow-x-scroll">
        {members.map((member) => (
          <div key={member.name} className="w-full flex flex-col gap-[14px]">
            <div className="w-[170px] h-[270px] rounded-[20px] bg-border_dark shrink-0"></div>
            <div className="flex flex-col gap-[4px] font-regular">
              <h2 className="font-bold text-[18px] text-text_black_primary">{member.name}</h2>
              <h3 className="font-regular font-normal text-[12px] text-text_black_primary">
                {member.role}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <button className="flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-primary_main ">
        <span>View Past Members</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};
const Projects = () => {
  const projects = [
    {
      title: "Military Backpack",
      desc: "Description goes here up to two lines max",
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "LG Hower Gym",
      desc: "Description goes here up to two lines max",
      img: "/img/projects/lg_hower_gym.png",
    },
    {
      title: "Military Sleeping Bag",
      desc: "Description goes here up to two lines max",
      img: "/img/projects/military_sleeping_bag.png",
    },
    {
      title: "Lemmy - AI Based Robot",
      desc: "Description goes here up to two lines max",
      img: "/img/projects/lemmy_ai_based_robot.png",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] bg-black ">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-text_white_primary font-extralight text-[42px] leading-[48px] font-super_special">
          Current Projects
        </h2>
        <h3 className="text-text_white_secondary font-regular font-light text-[12px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non deserunt quibusdam ipsum
          illum consequuntur autem, ratione error quidem esse velit nam, laborum nesciunt expedita
          quos magni quae, cumque temporibus magnam!
        </h3>
      </div>

      <div className="flex flex-col gap-[10px] items-center">
        {projects[0] && (
          <div className="w-full relative">
            <div
              className="bg-border_dark w-full h-[270px] rounded-[20px]"
              style={{ backgroundImage: `url(${projects[0].img})`, backgroundSize: "cover" }}
            ></div>
            <div className="absolute bottom-[20px] left-[20px] ">
              <h2 className="text-text_white_primary font-bold text-[24px] font-special">
                {projects[0].title}
              </h2>
              <h3 className="text-text_white_secondary font-regular text-[12px] font-normal">
                {projects[0].desc}
              </h3>
            </div>
          </div>
        )}
        <div className="w-full flex gap-[15px] overflow-x-auto">
          {projects.slice(1, -1).map((project) => (
            <div key={project.title} className="w-full relative">
              <div
                className="bg-border_dark w-full h-[270px] rounded-[20px]"
                style={{ backgroundImage: `url(${project.img})`, backgroundSize: "cover" }}
              ></div>
              <div className="absolute bottom-[20px] left-[20px] ">
                <h2 className="text-text_white_primary font-bold text-[24px] font-special">
                  {project.title}
                </h2>
                <h3 className="text-text_white_secondary font-regular text-[12px] font-normal">
                  {project.desc}
                </h3>
              </div>
            </div>
          ))}
        </div>
        {projects.at(-1) && (
          <div className="w-full relative">
            <div
              className="bg-border_dark w-full h-[270px] rounded-[20px]"
              style={{ backgroundImage: `url(${projects.at(-1).img})`, backgroundSize: "cover" }}
            ></div>
            <div className="absolute bottom-[20px] left-[20px] ">
              <h2 className="text-text_white_primary font-bold text-[24px] font-special">
                {projects.at(-1).title}
              </h2>
              <h3 className="text-text_white_secondary font-regular text-[12px] font-normal">
                {projects.at(-1).desc}
              </h3>
            </div>
          </div>
        )}
      </div>

      <button className="flex justify-center items-center gap-[10px] h-[50px] font-semibold font-regular text-[18px] text-primary_main border-solid border-2 border-primary_main rounded-[15px] ">
        <span>Completed Projects</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};
const Journal = () => {
  const journalPapers = [
    {
      title:
        "Comparison of three different types of exercises for selective contractions of supra- and infrahyoid muscles",
      authors: ["M. Tufail", "HB Lee", "YG Moon H.", "Kim", "M. Kim"],
      year: "2021",
      conference: "IASDR",
      color: "#08DBE9",
    },
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      authors: ["Jaehan Park", "M. Tufail", "HB. Lee", "KM. Kim"],
      year: "2021",
      conference: "IASDR",
      color: "#08DBE9",
    },
    {
      title:
        "Classification of Transformable Products based on Changes in Product Form and Function,Virtual Conference, Sweden",
      authors: ["Haebin Lee", "M. Tufail", "KwanMyung Kim"],
      year: "2021",
      conference: "ICED",
      color: "#476BE8",
    },

    {
      title:
        "Integrated Keyword Mapping Process: Bridging User Research to Style Concept Development ,Virtual Conference, USA",
      authors: ["Sangjin Joo", "Dabin Lee", "Soyoon Park", "Hwang Kim", "KwanMyung Kim"],
      year: "2020",
      conference: "AHFE",
      color: "#AF3BE7",
    },
    {
      title:
        "Rehabilitation Design Intervention for Older Adult Women through Community-based Co-Design Activities , Manchester, United Kingdom",
      authors: ["M. Tufail", "YG. Moon", "KM. Kim"],
      year: "2019",
      conference: "IASDR",
      color: "#2BC04C",
    },
    {
      title:
        "Discomfort with Low-back Pain Relief Exercise Training for Older Adult Women , Washington, USA",
      authors: ["M. Tufail", "S. Park", "HB. Lee", "YG. Moon", "KM. Kim"],
      year: "2019",
      conference: "AHFE",
      color: "#6E95E0",
    },
    {
      title:
        "A Critical Usability Problem-Solving Case of MazeCube Through Design Exploration Based on Scientific Experiments , Washington, USA",
      authors: ["Jihyeon Yang", "Hwisu Jeon", "M. Tufail", "KM. Kim"],
      year: "2019",
      conference: "AHFE",
      color: "#EA37CE",
    },
  ];

  return (
    <div className="w-dvw px-[25px] py-[30px] flex flex-col gap-[30px] bg-primary_main">
      <div className="flex flex-col gap-[20px]">
        <h2 className="text-5xl font-super_special text-text_white_primary leading-[48px] tracking-normal">
          Journal Papers
        </h2>
        <div className="flex gap-[10px]">
          <button className="grid place-content-center px-6 py-2 font-medium font-regular text-[16px] border-solid border-2 rounded-[183px] bg-primary_main text-text_black_primary">
            International
          </button>
          <button className="grid place-content-center px-6 py-2 font-medium font-regular text-[16px] border-solid border-2 rounded-[183px] bg-primary_main text-text_black_primary">
            Domestic
          </button>
        </div>
      </div>
      <div className="flex gap-[10px]">
        {journalPapers.map((paper) => (
          <div
            key={paper.title}
            className="shrink-0 h-[300px] w-[310px] flex flex-col justify-between p-[20px] rounded-[20px] bg-text_black_primary "
          >
            <h3 className="text-[18px] font-regular font-normal text-text_white_primary">
              {paper.title}
            </h3>
            <div className="flex justify-between">
              <div
                className={`flex flex-col text-[14px] font-regular font-semibold`}
                style={{ color: paper.color }}
              >
                {paper.authors.map((author) => (
                  <span key={author}>{author}</span>
                ))}
              </div>
              <div className="flex flex-col font-special text-[20px]">
                <span className=" text-text_white_tertiary font-normal"> {paper.year} </span>
                <span className="font-bold text-text_white_primary "> {paper.conference} </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="h-[50px] w-full flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-text_white_primary border-solid border-2 rounded-[15px] ">
        <span>All Journal Papers</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};
const Conference = () => {
  const journalPapers = [
    {
      title: "Understanding Detail Phase using 3D CAD: A case study on Anybaro",
      authors: ["M Gabbas", "KM. Kim"],
      year: "2021",
      conference: "IASDR",
      color: "#10719A",
    },
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      authors: ["Jaehan Park", "M. Tufail", "HB. Lee", "KM. Kim"],
      year: "2021",
      conference: "IASDR",
      color: "#003152",
    },
    {
      title:
        "Classification of Transformable Products based on Changes in Product Form and Function,Virtual Conference, Sweden",
      authors: ["Haebin Lee", "M. Tufail", "KwanMyung Kim"],
      year: "2021",
      conference: "ICED",
      color: "#03ADBB",
    },
  ];

  return (
    <div className="w-dvw px-[25px] py-[30px] flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[20px]">
        <h2 className="flex items-end text-5xl font-super_special text-text_black_primary leading-[48px] tracking-normal">
          <span>Conference Papers</span>
          <Down_left_dark_arrow className="size-[51px]" />
        </h2>
        <div className="flex gap-[10px]">
          <button className="grid place-content-center px-6 py-2 font-medium font-regular text-[16px] border-solid border-2 rounded-[183px] text-primary_main">
            International
          </button>
          <button className="grid place-content-center px-6 py-2 font-medium font-regular text-[16px] border-solid border-2 rounded-[183px] text-primary_main">
            Domestic
          </button>
        </div>
      </div>
      <div className="flex gap-[10px]">
        {journalPapers.map((paper) => (
          <div
            key={paper.title}
            className="shrink-0 h-[300px] w-[310px] flex flex-col justify-between p-[20px] rounded-[20px] bg-[#C1EDFF] "
          >
            <h3 className="text-[18px] font-regular font-normal text-text_black_primary">
              {paper.title}
            </h3>
            <div className="flex justify-between">
              <div
                className="flex flex-col text-[14px] font-regular font-semibold"
                style={{ color: paper.color }}
              >
                {paper.authors.map((author) => (
                  <span key={author}>{author}</span>
                ))}
              </div>
              <div className="flex flex-col font-special text-[20px]">
                <span className=" text-text_black_primary font-normal"> {paper.year} </span>
                <span className="font-bold text-text_black_primary "> {paper.conference} </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="h-[50px] w-full flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-primary_main border-solid border-2 rounded-[15px] ">
        <span>All Conference Papers</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};
