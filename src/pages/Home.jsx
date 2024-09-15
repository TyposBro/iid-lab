import { useRef } from "react";
import { MainCarousel } from "components/";
import { useNavigate } from "react-router";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import PropTypes from "prop-types";

import { Down_left_dark_arrow, Up_right_neutral_arrow } from "assets/";

export const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="w-full h-dvh flex flex-col justify-start items-center overflow-y-scroll px-[25px] pt-[95px] no-scrollbar">
      <Intro navigate={navigate} />
      <div className="w-full my-[30px]">
        <LiteYouTubeEmbed
          id="Xd-lcSxIsHM" // Default none, id of the video or playlist
          adNetwork={true} // Default true, to preconnect or not to doubleclick addresses called by YouTube iframe (the adnetwork from Google)
          params="" // any params you want to pass to the URL, assume we already had '&' and pass your parameters string
          playlist={false} // Use true when your ID be from a playlist
          playlistCoverId="Xd-lcSxIsHM" // The ids for playlists did not bring the cover in a pattern to render so you'll need pick up a video from the playlist (or in fact, whatever id) and use to render the cover. There's a programmatic way to get the cover from YouTube API v3 but the aim of this component is do not make any another call and reduce requests and bandwidth usage as much as possibe
          poster="hqdefault" // Defines the image size to call on first render as poster image. Possible values are "default","mqdefault",  "hqdefault", "sddefault" and "maxresdefault". Default value for this prop is "hqdefault". Please be aware that "sddefault" and "maxresdefault", high resolution images are not always avaialble for every video. See: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
          title="YouTube Embed" // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
          noCookie={true} // Default false, connect to YouTube via the Privacy-Enhanced Mode using https://www.youtube-nocookie.com
          ref={ref} // Use this ref prop to programmatically access the underlying iframe element
          activeClass="lyt-activated" // Default as "lyt-activated", gives control to wrapper once clicked
          iframeClass="" // Default none, gives control to add a class to iframe element itself
          playerClass="lty-playbtn" // Default as "lty-playbtn" to control player button styles
          wrapperClass="yt-lite rounded-[30px]" // Default as "yt-lite" for the div wrapping the area, the most important class and needs extra attention, please refer to LiteYouTubeEmbed.css for a reference.
          muted={true}
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

const Intro = ({ navigate }) => {
  const slides = [
    "/img/home/home_intro.png",
    "/img/home/home_intro.png",
    "/img/home/home_intro.png",
    "/img/home/home_intro.png",
  ];

  return (
    <div className="w-full flex flex-col">
      <MainCarousel slides={slides} />
      {/* <div className="w-full h-[210px] rounded-[30px]"></div> */}
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
          <button
            className="w-full h-[50px] border-border_dark rounded-[15px] grid place-content-center border-2 border-solid active:bg-primary_main active:text-white active:border-primary_main"
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="w-full h-[50px] border-border_dark rounded-[15px] grid place-content-center border-2 border-solid active:bg-primary_main active:text-white active:border-primary_main"
            onClick={() => navigate("/publications")}
          >
            Publications
          </button>
        </div>
      </div>
    </div>
  );
};

Intro.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const Prof = () => {
  const prof = {
    img: "/img/people/director/prof.png",
    name: "Professor KwanMyung Kim",
    role: "Lab Director",
    desc: "Dr. KwanMyung Kim, a full professor and director of IIDL, has 14 years of industry experience. He integrates design and engineering, focusing on elderly care, rehabilitation, and healthcare. He's also the CEO of ID SPACE Corp. and has held key academic roles, including Dean and journal editor.",
  };

  return (
    <div className="my-[30px] w-full flex flex-col gap-[30px]">
      <div
        className="w-[240px] h-[300px] rounded-[30px] mx-auto"
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
        <a
          href="https://iidl.unist.ac.kr/Profiles/index.html"
          target="_blank"
          className="w-full h-[50px] border-primary_main bg-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-text_white_primary no-underline"
        >
          CV
        </a>
        <a
          className="w-full h-[50px]  border-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-primary_main  no-underline"
          href="#contact"
        >
          Contact
        </a>
      </div>
    </div>
  );
};

const Members = () => {
  const members = [
    {
      img: "/img/people/current/ulugbek_ismatullaev.png",
      name: "Ulugbek Ismatullaev",
      role: "PhD Candidate",
    },
    { img: "/img/people/current/daehun_lee_home.png", name: "Daehun Lee", role: "PhD Candidate" },
    { img: "/img/people/current/haebin_lee.png", name: "Haebin Lee", role: "PhD Candidate" },
    {
      img: "/img/people/current/danyal_sarfraz.png",
      name: "Danyal Sarfraz",
      role: "Masters Researcher",
    },
    {
      img: "/img/people/current/jonghyun_kim.png",
      name: "Jonghyun Kim",
      role: "Masters Researcher",
    },
    {
      img: "/img/people/current/donierbek_abdurakhimov.png",
      name: "Donierbek Abdurakhimov",
      role: "Intern",
    },
  ];

  return (
    <div className="w-dvw my-[30px] shrink-0 flex flex-col gap-[30px] ">
      <div className="flex flex-col gap-[10px] px-[25px]">
        <h1 className="text-[42px] text-text_black_primary font-light font-super_special leading-[46px] ">
          Team Members
        </h1>
      </div>
      <div className="w-full flex flex-row gap-[10px] overflow-x-scroll px-[25px]">
        {members.map((member) => (
          <div key={member.name} className="w-full flex flex-col gap-[14px]">
            <div
              className="w-[170px] h-[270px] rounded-[20px] bg-border_dark shrink-0"
              style={{
                backgroundImage: `url(${member.img})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="flex flex-col gap-[4px] font-regular">
              <h2 className="font-bold text-[18px] text-text_black_primary">{member.name}</h2>
              <h3 className="font-regular font-normal text-[12px] text-text_black_primary">
                {member.role}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <a
        className="flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-primary_main  no-underline"
        href="/team#alumni"
        target="_blank"
      >
        <span>View Past Members</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </a>
    </div>
  );
};
const Projects = () => {
  const projects = [
    {
      title: "Military Backpack",
      desc: "Military Backpack and Frame Design for effective Weight Distribution System",
      img: "/img/projects/current/military_backpack.png",
    },
    {
      title: "LG Hower Gym",
      desc: "Description goes here up to two lines max",
      img: "/img/projects/current/lg_hower_gym.png",
    },
    {
      title: "Military Sleeping Bag",
      desc: "Winter sleeping bag for Special Forces",
      img: "/img/projects/military_sleeping_bag1.png",
    },
    {
      title: "Lemmy - AI Based Robot",
      desc: "Elderly care robot-service system",
      img: "/img/projects/current/lemmy_ai_based_robot.png",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] bg-black ">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-text_white_primary font-extralight text-[42px] leading-[48px] font-super_special">
          Current Projects
        </h2>
        <h3 className="text-text_white_secondary font-regular font-light text-[12px]">
          We create innovative design concepts through systematic, human-centered methods,
          developing them into products and services using engineering design. Our focus is on
          elderly care, rehabilitation, healthcare, and safety, and we collaborate closely with
          experts in medicine, geriatrics, physical therapy, materials, and production.
        </h3>
      </div>

      <div className="flex flex-col gap-[10px] items-center">
        {projects[0] && (
          <div className="w-full relative">
            <div
              className="bg-border_dark w-full h-[270px] rounded-[20px] relative"
              style={{ backgroundImage: `url(${projects[0].img})`, backgroundSize: "cover" }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
              {/* Dark Overlay */}
            </div>
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
        <div className="w-full flex gap-[15px] overflow-x-auto relative">
          {projects.slice(1, -1).map((project) => (
            <div key={project.title} className="w-full relative">
              <div
                className="bg-border_dark w-full h-[270px] rounded-[20px]"
                style={{ backgroundImage: `url(${project.img})`, backgroundSize: "cover" }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
                {/* Dark Overlay */}
              </div>
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
              style={{
                backgroundImage: `url(${projects.at(-1).img})`,
                backgroundSize: "100% 270px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
              {/* Dark Overlay */}
            </div>
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

      <a
        className="flex justify-center items-center gap-[10px] h-[50px] font-semibold font-regular text-[18px] text-primary_main border-solid border-2 border-primary_main rounded-[15px] "
        href="/projects#completed"
        target="_blank"
      >
        <span>Completed Projects</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </a>
    </div>
  );
};
const Journal = () => {
  const journalPapers = [
    {
      title:
        "Interdisciplinary Co-Design Research Practice in the Rehabilitation of Elderly Individuals with Chronic Low Back Pain from a Senior Care Center in South Korea",
      authors: ["M. Tufail", "HB Lee", "YG Moon", "H. Kim", "KM. Kim"],
      year: "2022",
      conference: "Applied Sciences",
      link: "https://www.mdpi.com/2076-3417/12/9/4687",
      color: "#08DBE9",
    },
    {
      title:
        "How do visitors perceive the significance of tangible cultural heritage through a 3D reconstructed immersive visual experience at the Seokguram Grotto, South Korea?",
      authors: ["M. Tufail", "J. Park", "H. Kim", "S. Kim", "KM. Kim"],
      year: "2022",
      conference: "Journal of Heritage Tourism",
      link: "https://www.tandfonline.com/doi/full/10.1080/1743873X.2022.2039672",
      color: "#6E95E0",
    },
    {
      title:
        "Comparison of three different types of exercises for selective contractions of supra- and infrahyoid muscles",
      authors: ["MC. Chang", "S. Park", "JY. Cho", "BJ. Lee", "JM. Hwang", "KM. Kim", "D. Park"],
      year: "2021",
      conference: "Science Reports",
      link: "https://www.nature.com/articles/s41598-021-86502-w",
      color: "#476BE8",
    },

    {
      title:
        "The Effect of Lumbar Erector Spinae Muscle Endurance Exercise on Perceived Low-back Pain in Older Adults",
      authors: ["M. Tufail", "HB. Lee", "YG. Moon", "H. Kim", "KM. Kim"],
      year: "2021",
      conference: "Physical Activity Review",
      link: "https://www.physactiv.eu/wp-content/uploads/2021/05/2021_929.pdf",
      color: "#AF3BE7",
    },
    {
      title:
        "Effects of standing exercise tasks with a sloped surface intervention on trunk muscle activation and low-back pain intensity in women aged ≥ 70 years",
      authors: ["M. Tufail", "HB. Lee", "YG. Moon", "H. Kim", "KM. Kim"],
      year: "2021",
      conference: "HFE",
      link: "https://www.inderscience.com/offers.php?id=118217",
      color: "#2BC04C",
    },
  ];

  return (
    <div className="w-dvw py-[30px] flex flex-col gap-[30px] bg-primary_main">
      <div className="flex flex-col gap-[20px] px-[25px]">
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
      <div className="px-[25px] flex gap-[10px] overflow-x-scroll">
        {journalPapers.map((paper) => (
          <div
            key={paper.title}
            className="shrink-0 h-[300px] w-[310px] flex flex-col justify-between p-[20px] rounded-[20px] bg-text_black_primary "
          >
            <a
              className="text-[16px] font-regular font-normal text-text_white_primary underline break-words"
              href={paper.link}
              target="_blank"
              rel="noreferrer"
            >
              {paper.title}
            </a>
            <div className="flex justify-between items-end">
              <div
                className="flex flex-col text-[14px] font-regular font-semibold grow shrink-0"
                style={{ color: paper.color }}
              >
                {paper.authors.map((author) => (
                  <div key={author}>{author}</div>
                ))}
              </div>
              <div className="flex flex-col justify-end font-special text-[20px]">
                <div className="text-text_white_tertiary font-normal text-right">{paper.year}</div>
                <div className="font-bold text-text_white_primary break-words text-right">
                  {paper.conference}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full px-[25px]">
        <a
          className="h-[50px] w-full flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-text_white_primary border-solid border-2 rounded-[15px] "
          href="/publications#journal"
        >
          <span>All Journal Papers</span>
          <Up_right_neutral_arrow alt="up right light arrow icon" />
        </a>
      </div>
    </div>
  );
};
const Conference = () => {
  const conferencePapers = [
    {
      title:
        "Introducing a framework to translate user scenarios into engineering specifications with “action steps”",
      authors: ["Ulugbek Ismatullaev", "KM. Kim"],
      year: "2024",
      conference: "DESIGN CONFERENCE",
      location: "Dubrovnik, Croatia",
      color: "#10719A",
      link: "https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/introducing-a-framework-to-translate-user-scenarios-into-engineering-specifications-with-action-steps/21306D946ED8FF4C56AEC995CAE50768",
    },
    {
      title:
        "Exercise Characteristics of Older Adults and Considerations for Exercise Equipment Design for them",
      authors: ["J. Kim", "A. Saduakas", "U. Ismatullaev", "D. Lee", "BB. Garza", "KM. Kim"],
      year: "2023",
      conference: "IASDR",
      location: "Milan, Italy",
      color: "#003152",
      link: "https://dl.designresearchsociety.org/iasdr/iasdr2023/fullpapers/223/",
    },
    {
      title: "Dynamic personalities for elderly care robots: user-based recommendations",
      authors: ["D. Lee", "A. Saduakas", "U. Ismatullaev", "BB. Garza", "J. Kim", "KM. Kim"],
      year: "2023",
      conference: "IASDR",
      location: "Milan, Italy",
      color: "#03ADBB",
      link: "https://dl.designresearchsociety.org/iasdr/iasdr2023/fullpapers/210/",
    },

    {
      title: "Human Factors Considerations in Design for the Elderly",
      authors: ["U. Ismatullaev", "A. Saduakas", "KM. Kim"],
      year: "2022",
      conference: "AHFE",
      location: "New York, USA",
      color: "#03ADBB",
      link: "https://openaccess.cms-conferences.org/publications/book/978-1-958651-14-8/article/978-1-958651-14-8_3",
    },
    {
      title:
        "Addressing the Gaps in Elderly Falling Prevention from the Perspective of a Human-Centered Design.",
      authors: ["A. Saduakas", "U. Ismatullaev", "KM. Kim"],
      year: "2022",
      conference: "AHFE",
      location: "New York, USA",
      color: "#03ADBB",
      link: "https://openaccess.cms-conferences.org/publications/book/978-1-958651-14-8/article/978-1-958651-14-8_3",
    },
  ];

  return (
    <div className="w-dvw py-[30px] flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[20px] px-[25px]">
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
      <div className="px-[25px] flex gap-[10px] overflow-x-scroll">
        {conferencePapers.map((paper) => (
          <div
            key={paper.title}
            className="shrink-0 h-[300px] w-[310px] flex flex-col justify-between p-[20px] rounded-[20px] bg-[#C1EDFF] "
          >
            <a
              className="text-[18px] font-regular font-normal text-text_black_primary underline break-words"
              href={paper.link}
              target="_blank"
              rel="noreferrer"
            >
              {paper.title}
            </a>
            <div className="flex justify-between items-end">
              <div
                className="flex flex-col text-[14px] font-regular font-semibold"
                style={{ color: paper.color }}
              >
                {paper.authors.map((author) => (
                  <span key={author}>{author}</span>
                ))}
              </div>
              <div className="flex flex-col font-special text-[20px] text-right">
                <span className=" text-text_black_primary font-normal"> {paper.year} </span>
                <span className="font-bold text-text_black_primary "> {paper.conference} </span>
                <span className="text-text_black_primary font-normal"> {paper.location} </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full px-[25px]">
        <a
          className="h-[50px] w-full flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-primary_main border-solid border-2 rounded-[15px] "
          href="/publications#conference"
        >
          <span>All Conference Papers</span>
          <Up_right_neutral_arrow alt="up right light arrow icon" />
        </a>
      </div>
    </div>
  );
};
