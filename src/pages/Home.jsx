import { useRef, useState } from "react";
import { GoTo, MainCarousel } from "components/";
import { useNavigate } from "react-router";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import PropTypes from "prop-types";

import { Down_left_dark_arrow, Link, Up_right_neutral_arrow } from "assets/";
import { truncateText } from "utils/text";
import { HashLink } from "react-router-hash-link";

export const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full h-dvh overflow-y-scroll no-scrollbar">
      <Intro navigate={navigate} />
      <div className="my-[30px] px-[25px] w-full">
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
      <Prof navigate={navigate} />
      <Members />
      <Projects />
      <Journal />
      <Conference />
      <GoTo title="Projects Gallery" link="/gallery" />
    </div>
  );
};

export default Home;

const Intro = ({ navigate }) => {
  const slides = [
    "/img/home/home_intro.png",
    "/img/gallery/jeju-2024/1.png",
    "/img/gallery/croatia-2024/1.png",
    "/img/gallery/unist-2024/1.png",
    "/img/gallery/gyeongju-2023/1.png",
  ];

  return (
    <div className="flex flex-col px-[25px] w-full sm:gap-8">
      <MainCarousel slides={slides} />
      {/* <div className="rounded-[30px] w-full h-[210px]"></div> */}
      <div className="flex flex-col gap-[30px] w-full sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[44px] text-text_black_primary tracking-[-4%] leading-[48px]">
            Integration <span className="text-primary_main">&</span> Innovation Design
          </h1>
          <h3 className="text-[12px] text-text_black_secondary">
            Integration + Innovation Design Lab focuses on design and development of innovative
            products and services by integrating Design, Ergonomics, Engineering, Technology and
            Entrepreneurship.
          </h3>
        </div>
        <div className="flex flex-col gap-[10px] font-semibold text-[18px]">
          <button
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline sm:h-14 sm:w-64"
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline sm:h-14 sm:w-64"
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

const Prof = ({ navigate }) => {
  const prof = {
    img: "/img/people/director/prof.png",
    name: "Professor KwanMyung Kim",
    role: "Lab Director",
    desc: "Dr. KwanMyung Kim, a full professor and director of IIDL, has 14 years of industry experience. He integrates design and engineering, focusing on elderly care, rehabilitation, and healthcare. He's also the CEO of ID SPACE Corp. and has held key academic roles, including Dean and journal editor.",
  };

  return (
    <div className="flex flex-col gap-[30px] my-[30px] px-[25px] w-full sm:flex-row">
      <div
        className="mx-auto rounded-[30px] w-[240px] h-[300px] sm:flex-shrink-0 "
        style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      ></div>
      <div className="flex flex-col gap-[30px] sm:justify-between">
        <div className="flex flex-col gap-[5px] w-full">
          <h2 className="font-bold text-[20px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
            {prof.name}
          </h1>
          <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>
        </div>
        <div className="flex flex-col gap-[10px] font-semibold text-[18px] sm:flex-row sm:w-72">
          <div
            onClick={() => navigate("/prof")}
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
          >
            CV
          </div>
          <HashLink
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
            to="#contact"
          >
            Contact
          </HashLink>
        </div>
      </div>
    </div>
  );
};

Prof.propTypes = {
  navigate: PropTypes.func.isRequired,
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
    <div className="flex flex-col gap-[30px] my-[30px] w-full shrink-0">
      <div className="flex flex-col gap-[10px] px-[25px]">
        <h1 className="font-light text-[42px] text-text_black_primary leading-[46px]">
          Team Members
        </h1>
      </div>
      <div className="flex flex-row gap-[10px] px-[25px] w-full overflow-x-scroll">
        {members.map((member) => (
          <div key={member.name} className="flex flex-col gap-[14px] w-full">
            <div
              className="bg-border_dark rounded-[20px] w-[170px] h-[270px] shrink-0"
              style={{
                backgroundImage: `url(${member.img})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="flex flex-col gap-[4px]">
              <h2 className="font-bold text-[18px] text-text_black_primary">{member.name}</h2>
              <h3 className="text-[12px] text-text_black_primary">{member.role}</h3>
            </div>
          </div>
        ))}
      </div>
      <HashLink
        className="flex justify-center items-center gap-[10px] font-semibold text-[18px] text-primary_main no-underline  active:border-primary_main active:bg-primary_main active:text-white rounded-[15px] mx-6 h-[50px]"
        to="/team#alumni"
      >
        <span>View Past Members</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </HashLink>
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
    <div className="flex flex-col gap-[30px] bg-black px-[25px] py-[30px] w-full">
      <div className="flex flex-col gap-[10px]">
        <h2 className="font-extralight text-[42px] text-text_white_primary leading-[48px]">
          Current Projects
        </h2>
        <h3 className="font-light text-[12px] text-text_white_secondary">
          We create innovative design concepts through systematic, human-centered methods,
          developing them into products and services using engineering design. Our focus is on
          elderly care, rehabilitation, healthcare, and safety, and we collaborate closely with
          experts in medicine, geriatrics, physical therapy, materials, and production.
        </h3>
      </div>

      <div className="flex flex-col items-center gap-[10px]">
        {projects[0] && (
          <div className="relative w-full">
            <div
              className="relative bg-border_dark rounded-[20px] w-full h-[270px]"
              style={{ backgroundImage: `url(${projects[0].img})`, backgroundSize: "cover" }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
              {/* Dark Overlay */}
            </div>
            <div className="bottom-[20px] left-[20px] absolute">
              <h2 className="font-bold text-[24px] text-text_white_primary">{projects[0].title}</h2>
              <h3 className="text-[12px] text-text_white_secondary">{projects[0].desc}</h3>
            </div>
          </div>
        )}
        <div className="relative flex gap-[15px] w-full overflow-x-auto">
          {projects.slice(1, -1).map((project) => (
            <div key={project.title} className="relative w-full">
              <div
                className="bg-border_dark rounded-[20px] w-full h-[270px]"
                style={{ backgroundImage: `url(${project.img})`, backgroundSize: "cover" }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
                {/* Dark Overlay */}
              </div>
              <div className="bottom-[20px] left-[20px] absolute">
                <h2 className="font-bold text-[24px] text-text_white_primary">{project.title}</h2>
                <h3 className="text-[12px] text-text_white_secondary">{project.desc}</h3>
              </div>
            </div>
          ))}
        </div>
        {projects.at(-1) && (
          <div className="relative w-full">
            <div
              className="bg-border_dark rounded-[20px] w-full h-[270px]"
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
            <div className="bottom-[20px] left-[20px] absolute">
              <h2 className="font-bold text-[24px] text-text_white_primary">
                {projects.at(-1).title}
              </h2>
              <h3 className="text-[12px] text-text_white_secondary">{projects.at(-1).desc}</h3>
            </div>
          </div>
        )}
      </div>

      <HashLink
        className="flex justify-center items-center gap-[10px] border-2 border-primary_main border-solid rounded-[15px] h-[50px] font-semibold text-[18px] text-primary_main"
        to="/projects#completed"
      >
        <span>Completed Projects</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </HashLink>
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
      type: "International",
    },
    {
      title:
        "How do visitors perceive the significance of tangible cultural heritage through a 3D reconstructed immersive visual experience at the Seokguram Grotto, South Korea?",
      authors: ["M. Tufail", "J. Park", "H. Kim", "S. Kim", "KM. Kim"],
      year: "2022",
      conference: "Journal of Heritage Tourism",
      link: "https://www.tandfonline.com/doi/full/10.1080/1743873X.2022.2039672",
      color: "#6E95E0",
      type: "International",
    },
    {
      title:
        "Comparison of three different types of exercises for selective contractions of supra- and infrahyoid muscles",
      authors: ["MC. Chang", "S. Park", "JY. Cho", "BJ. Lee", "JM. Hwang", "KM. Kim", "D. Park"],
      year: "2021",
      conference: "Science Reports",
      link: "https://www.nature.com/articles/s41598-021-86502-w",
      color: "#476BE8",
      type: "International",
    },

    {
      title:
        "The Effect of Lumbar Erector Spinae Muscle Endurance Exercise on Perceived Low-back Pain in Older Adults",
      authors: ["M. Tufail", "HB. Lee", "YG. Moon", "H. Kim", "KM. Kim"],
      year: "2021",
      conference: "Physical Activity Review",
      link: "https://www.physactiv.eu/wp-content/uploads/2021/05/2021_929.pdf",
      color: "#AF3BE7",
      type: "International",
    },
    {
      title:
        "Effects of standing exercise tasks with a sloped surface intervention on trunk muscle activation and low-back pain intensity in women aged ≥ 70 years",
      authors: ["M. Tufail", "HB. Lee", "YG. Moon", "H. Kim", "KM. Kim"],
      year: "2021",
      conference: "HFE",
      link: "https://www.inderscience.com/offers.php?id=118217",
      color: "#2BC04C",
      type: "Domestic",
    },
  ];

  const filters = [...new Set(journalPapers.map((item) => item.type))];
  const [selected, setSelected] = useState(filters[0]);

  return (
    <div className="flex flex-col gap-[30px] bg-primary_main py-[30px] w-full">
      <div className="flex flex-col gap-[20px] px-[25px]">
        <h2 className="text-5xl text-text_white_primary leading-[48px] tracking-normal">
          Journal Papers
        </h2>
        <div className="flex gap-[10px]">
          {filters.map((item) => (
            <button
              key={item}
              className={`place-content-center border-2 grid bg-primary_main px-6 py-2 border-solid rounded-[183px] font-medium text-[16px] text-text_black_primary ${
                selected === item ? "text-white bg-primary_main" : ""
              }`}
              onClick={() => setSelected(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-[10px] px-[25px] overflow-x-scroll">
        {journalPapers
          .filter((event) => event.type === selected)
          .map((paper) => (
            <div
              key={paper.title}
              className="flex flex-col justify-between bg-text_black_primary p-[20px] rounded-[20px] w-[310px] h-[300px] shrink-0 sm:w-96"
            >
              <span className="text-[16px] text-text_white_primary break-words">
                {truncateText(paper.title, 150)}
              </span>
              <div className="flex justify-center items-center">
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col text-[20px]">
                    <div className="font-bold text-text_white_primary break-words">
                      {paper.conference}
                    </div>
                    <div className="text-text_white_tertiary">{paper.year}</div>
                  </div>
                  <div className="font-semibold text-[14px]" style={{ color: paper.color }}>
                    {paper.authors.join(", ")}
                  </div>
                </div>
                <a href={paper.link} target="_blank" rel="noreferrer">
                  <Link className="text-text_white_primary size-[25px]" />
                </a>
              </div>
            </div>
          ))}
      </div>
      <div className="px-[25px] w-full">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-solid rounded-[15px] w-full h-[50px] font-semibold text-[18px] text-text_white_primary"
          to="/publications#journal"
        >
          <span>All Journal Papers</span>
          <Up_right_neutral_arrow alt="up right light arrow icon" />
        </HashLink>
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
      type: "International",
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
      type: "International",
    },
    {
      title: "Dynamic personalities for elderly care robots: user-based recommendations",
      authors: ["D. Lee", "A. Saduakas", "U. Ismatullaev", "BB. Garza", "J. Kim", "KM. Kim"],
      year: "2023",
      conference: "IASDR",
      location: "Milan, Italy",
      color: "#03ADBB",
      link: "https://dl.designresearchsociety.org/iasdr/iasdr2023/fullpapers/210/",
      type: "International",
    },

    {
      title: "Human Factors Considerations in Design for the Elderly",
      authors: ["U. Ismatullaev", "A. Saduakas", "KM. Kim"],
      year: "2022",
      conference: "AHFE",
      location: "New York, USA",
      color: "#03ADBB",
      link: "https://openaccess.cms-conferences.org/publications/book/978-1-958651-14-8/article/978-1-958651-14-8_3",
      type: "International",
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
      type: "Domestic",
    },
  ];

  const filters = [...new Set(conferencePapers.map((item) => item.type))];
  const [selected, setSelected] = useState(filters[0]);

  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full">
      <div className="flex flex-col gap-[20px] px-[25px]">
        <h2 className="flex items-end text-5xl text-text_black_primary leading-[48px] tracking-normal">
          <span>Conference Papers</span>
          <Down_left_dark_arrow className="size-[51px]" />
        </h2>
        <div className="flex gap-[10px]">
          {filters.map((item) => (
            <button
              key={item}
              className={`place-content-center border-2 grid px-6 py-2 border-solid rounded-[183px] font-medium text-[16px] text-primary_main border-primary_main ${
                selected === item ? "bg-primary_main text-white" : ""
              }`}
              onClick={() => setSelected(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-[10px] px-[25px] overflow-x-scroll">
        {conferencePapers
          .filter((event) => event.type === selected)
          .map((paper) => (
            <div
              key={paper.title}
              className="flex flex-col justify-between bg-[#C1EDFF] p-[20px] rounded-[20px] w-[310px] h-[300px] shrink-0 sm:w-96"
            >
              <span className="text-[18px] text-text_black_primary break-words">
                {truncateText(paper.title, 150)}
              </span>
              <div className="flex justify-between items-center">
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col text-[20px]">
                    <span className="font-bold text-text_black_primary"> {paper.conference} </span>
                    <span className="text-text_black_primary"> {paper.year} </span>
                    <span className="text-text_black_primary"> {paper.location} </span>
                  </div>
                  <div
                    className="flex flex-col font-semibold text-[14px]"
                    style={{ color: paper.color }}
                  >
                    {paper.authors.join(", ")}
                  </div>
                </div>
                <a href={paper.link} target="_blank" rel="noreferrer">
                  <Link className="text-text_black_primary size-[25px]" />
                </a>
              </div>
            </div>
          ))}
      </div>
      <div className="px-[25px] w-full">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-solid rounded-[15px] w-full h-[50px] font-semibold text-[18px] text-primary_main"
          to="/publications#conference"
        >
          <span>All Conference Papers</span>
          <Up_right_neutral_arrow alt="up right light arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};
