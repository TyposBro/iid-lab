import { useRef, useState, useEffect } from "react";
import { MainCarousel } from "@/components/"; // Assume these are responsive
import { useNavigate } from "react-router";
import { HashLink } from "react-router-hash-link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import PropTypes from "prop-types";

import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { truncateText } from "@/utils/text";
import { BASE_URL } from "@/config/api";
import { LinkedIn } from "@mui/icons-material";

// Main Home Component
export const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  return (
    // Removed h-dvh, overflow-y-scroll. Added min-h-screen. pt-[95px] assumes fixed navbar height.
    <div className="flex flex-col justify-start items-center pt-[95px] w-full min-h-screen">
      {/* Wrap sections in fragments or divs if needed, spacing managed internally */}
      <Intro navigate={navigate} />
      {/* YouTube Embed Section */}
      <div className="my-6 sm:my-[30px] px-4 sm:px-6 lg:px-[25px] w-full">
        <LiteYouTubeEmbed
          id="Xd-lcSxIsHM"
          adNetwork={true}
          params=""
          playlist={false}
          playlistCoverId="Xd-lcSxIsHM"
          poster="hqdefault"
          title="YouTube Embed"
          noCookie={true}
          ref={ref} // Keep ref if needed
          activeClass="lyt-activated"
          iframeClass=""
          playerClass="lty-playbtn"
          // Responsive rounding
          wrapperClass="yt-lite rounded-[20px] sm:rounded-[30px]"
          muted={true}
        />
      </div>
      <Prof navigate={navigate} />
      <Members />
      <Projects />
      <Journal />
      <Conference />
    </div>
  );
};

// Intro Component
const Intro = ({ navigate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGalleryEvents();
  }, []);

  const fetchGalleryEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/gallery`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const slides = data
        .map((event) => event.images[0])
        .filter(Boolean)
        .slice(0, 7); // Limit to 7 images
      setEvents(slides);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Gallery...</div>;
  if (error) return <div>Error loading Gallery: {error}</div>;

  return (
    // Responsive padding and gap
    <div className="flex flex-col px-4 sm:px-6 lg:px-[25px] w-full gap-6 sm:gap-8">
      <MainCarousel slides={events} /> {/* Assume MainCarousel is responsive */}
      <div className="flex flex-col gap-6 sm:gap-[30px] w-full sm:flex-row sm:justify-between">
        {/* Text Content */}
        <div className="flex flex-col gap-2 sm:gap-[8px]">
          {/* Responsive heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] text-text_black_primary tracking-tight lg:tracking-[-4%] leading-tight lg:leading-[48px]">
            Integration <span className="text-primary_main">&</span> Innovation Design
          </h1>
          {/* Responsive description */}
          <h3 className="text-sm lg:text-[12px] xl:text-sm text-text_black_secondary">
            Integration + Innovation Design Lab focuses on design and development of innovative
            products and services by integrating Design, Ergonomics, Engineering, Technology and
            Entrepreneurship.
          </h3>
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:gap-[10px] font-semibold text-base sm:text-[18px]">
          {/* Responsive buttons */}
          <button
            className="place-content-center border-2 border-border_dark active:border-border_dark grid active:bg-border_dark border-solid rounded-[15px] w-full sm:w-64 h-12 sm:h-14 text-border_dark active:text-white no-underline transition-colors duration-200 hover:bg-border_dark hover:text-white"
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="place-content-center border-2 border-border_dark active:border-border_dark grid active:bg-border_dark border-solid rounded-[15px] w-full sm:w-64 h-12 sm:h-14 text-border_dark active:text-white no-underline transition-colors duration-200 hover:bg-border_dark hover:text-white"
            onClick={() => navigate("/publications")}
          >
            Publications
          </button>
        </div>
      </div>
    </div>
  );
};
Intro.propTypes = { navigate: PropTypes.func.isRequired };

// Prof Component
const Prof = ({ navigate }) => {
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/prof`); // Ensure this endpoint exists
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched professor data:", data);
        setProf(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch professor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessorData();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading professor data...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600">Error loading professor data: {error}</div>
    );
  if (!prof) return <div className="p-6 text-center">No professor data found.</div>;

  return (
    // Responsive padding, margin, gap, and layout
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-[30px] my-6 sm:my-[30px] px-4 sm:px-6 lg:px-[25px] w-full">
      {/* Responsive image container */}
      <div
        className="mx-auto sm:mx-0 rounded-[20px] sm:rounded-[30px] w-full max-w-[240px] sm:w-[240px] h-[300px] bg-gray-300 sm:flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${prof.img || "/img/placeholder.png"})` }} // Added placeholder
      ></div>
      {/* Text and Buttons Content */}
      <div className="flex flex-col gap-6 sm:gap-[30px] sm:justify-between w-full">
        {/* Text Details */}
        <div className="flex flex-col gap-1 sm:gap-[5px] w-full">
          {/* Responsive text */}
          <h2 className="font-bold text-lg sm:text-[20px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-3xl sm:text-[36px] text-text_black_primary leading-tight sm:leading-[36px]">
            {prof.name}
          </h1>
          <h3 className="text-sm lg:text-[12px] xl:text-sm text-text_black_secondary">
            {prof.desc}
          </h3>
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-[10px] font-semibold text-base sm:text-[18px]">
          {/* Responsive Buttons */}
          <button // Changed to button for consistency, could be Link/HashLink too
            onClick={() => navigate("/prof")}
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full sm:w-36 h-12 sm:h-[50px] text-primary_main active:text-white no-underline cursor-pointer transition-colors duration-200 hover:bg-primary_main hover:text-white"
          >
            CV
          </button>
          <HashLink
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full sm:w-36 h-12 sm:h-[50px] text-primary_main active:text-white no-underline transition-colors duration-200 hover:bg-primary_main hover:text-white"
            to="/#contact" // Ensure you have an element with id="contact" in Footer or elsewhere
          >
            Contact
          </HashLink>
        </div>
      </div>
    </div>
  );
};
Prof.propTypes = { navigate: PropTypes.func.isRequired };

// Members Component
const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/team`); // Ensure this endpoint exists
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  // NOTE: Loading/Error states removed for brevity here, add them back like in Prof component if needed

  return (
    // Responsive padding, margin, gap
    <div className="flex flex-col gap-6 sm:gap-[30px] my-6 sm:my-[30px] w-full shrink-0">
      {/* Title Section */}
      <div className="flex flex-col gap-2 sm:gap-[10px] px-4 sm:px-6 lg:px-[25px]">
        {/* Responsive title */}
        <h1 className="font-semibold text-5xl sm:text-[42px] text-text_black_primary leading-tight sm:leading-[46px]">
          Current Team
        </h1>
        {/* Optional: Add description text here if needed */}
      </div>
      {/* Horizontal Scrolling List */}
      <div className="flex flex-row gap-4 sm:gap-[10px] px-4 sm:px-6 lg:px-[25px] w-full overflow-x-scroll no-scrollbar">
        {loading && <div className="py-10 text-center w-full">Loading members...</div>}
        {error && (
          <div className="py-10 text-center text-red-600 w-full">Error loading members.</div>
        )}
        {!loading &&
          !error &&
          members.map((member) => (
            <div key={member._id} className="flex flex-col gap-3 sm:gap-[14px] w-auto">
              {/* Member Card Image */}
              <div
                className="bg-gray-300 rounded-[20px] w-[170px] h-[270px] shrink-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${member.img || "/img/placeholder.png"})` }} // Added placeholder
              ></div>
              {/* Member Card Text */}
              <div className="flex flex-col sm:gap-1 w-[170px]">
                {/* Match width */}
                {/* Responsive text */}
                <h2 className="font-bold text-base sm:text-lg text-text_black_primary truncate">
                  {member.name}
                </h2>
                <h3 className="text-xs sm:text-sm text-text_black_primary truncate">
                  {member.role}
                </h3>
                {console.log("Member data:", member)} {/* Debugging log */}
                {member.linkedIn && (
                  <a href={member.linkedIn} target="_blank" rel="noreferrer noopener">
                    <LinkedIn className="text-text_black_primary hover:text-blue-400 size-5 sm:size-[25px]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        {!loading && !error && members.length === 0 && (
          <div className="py-10 text-center w-full">No members found.</div>
        )}
      </div>
      {/* Link to Past Members */}
      <div className="px-4 sm:px-6 lg:px-[25px]">
        <HashLink
          className="flex justify-center items-center gap-[10px] font-semibold text-base sm:text-[18px] text-primary_main no-underline active:border-primary_main active:bg-primary_main active:text-white rounded-[15px] h-12 sm:h-[50px] border-2 border-transparent hover:border-primary_main transition-all duration-200"
          to="/team#alumni"
        >
          <span>View Past Members</span>
          <Up_right_neutral_arrow className="size-4 sm:size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};

// Projects Component
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentProjects = async () => {
      try {
        // Fetch only 'current' projects - ensure API supports this or filter client-side
        const response = await fetch(`${BASE_URL}/projects/status/current`); // Ensure endpoint exists
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched current projects:", data);
        setProjects(data.slice(0, 4)); // Keep limiting to 4 for home page
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProjects();
  }, []);

  // NOTE: Loading/Error states removed for brevity here, add them back like in Prof component if needed

  return (
    // Responsive padding, background, gap
    <div className="flex flex-col gap-6 sm:gap-[30px] bg-text_black_primary text-white px-4 sm:px-6 lg:px-[25px] py-6 sm:py-[30px] w-full">
      {/* Title and Description Section */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-10 sm:items-center sm:flex-row">
        {/* Responsive title */}
        <h2
          className="font-semibold
         text-5xl sm:text-5xl lg:text-[80px] leading-tight text-text_white_primary sm:shrink-0"
        >
          Current Projects
        </h2>
        {/* Responsive description */}
        <h3 className="text-sm sm:text-base lg:text-lg text-text_white_secondary">
          We create innovative design concepts through systematic, human-centered methods,
          developing them into products and services using engineering design. Our focus is on
          elderly care, rehabilitation, healthcare, and safety, and we collaborate closely with
          experts in medicine, geriatrics, physical therapy, materials, and production.
        </h3>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {loading && (
          <div className="py-10 text-center w-full md:col-span-2">Loading projects...</div>
        )}
        {error && (
          <div className="py-10 text-center text-red-600 w-full md:col-span-2">
            Error loading projects.
          </div>
        )}
        {!loading &&
          !error &&
          projects.map((project) => (
            <div key={project._id} className="relative w-full rounded-3xl">
              <img
                className="absolute rounded-3xl w-full h-60 object-cover z-10"
                src={`${project.image || "/img/placeholder.png"}`}
                alt={project.title}
              />
              <div className="w-full h-full rounded-3xl flex flex-col items-end gap-4 border border-[#282828f2]">
                <div className="w-full h-60 bg-transparent" />
                <div className="w-full flex flex-col gap-2 px-5 pt-4">
                  <h2 className="font-bold text-base sm:text-xl lg:text-[24px] text-text_white_primary">
                    {project.title}
                  </h2>
                  <h3 className="text-sm text-text_white_primary">{project.subtitle}</h3>
                </div>

                <button className="mb-5 mr-5 px-4 py-2 border-2 border-primary_main rounded-md font-semibold text-sm text-primary_main">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        {!loading && !error && projects.length === 0 && (
          <div className="py-10 text-center w-full md:col-span-2">No current projects found.</div>
        )}
      </div>

      {/* Link to Completed Projects */}
      <div className="mt-4">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-primary_main border-solid rounded-[15px] h-12 sm:h-[50px] font-semibold text-base sm:text-[18px] text-primary_main hover:bg-primary_main hover:text-black transition-colors duration-200"
          to="/projects#completed"
        >
          <span>Completed Projects</span>
          <Up_right_neutral_arrow className="size-4 sm:size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};

// Journal Component
const Journal = () => {
  const [list, setList] = useState([]); // Store all fetched papers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJournalPapers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/publications/type/journal`); // Ensure endpoint exists
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setList(data.slice(0, 5));
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch journal papers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalPapers();
  }, []);

  return (
    // Responsive padding, background, gap
    <div className="flex flex-col gap-6 sm:gap-[30px] bg-primary_main text-white py-6 sm:py-[30px] w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-4 sm:gap-5 px-5 sm:px-6 lg:px-[25px]">
        {/* Responsive title */}
        <h2 className="text-5xl text-text_black_primary tracking-normal font-semibold">
          Journal Papers
        </h2>
        {/* Filter Buttons - Allow wrapping */}
        <div className="flex gap-2 sm:gap-[10px] flex-wrap">
          {loading && <div className="text-sm text-text_white_secondary">Loading filters...</div>}

          {!loading && list.length === 0 && (
            <div className="text-sm text-text_white_secondary">No paper types found.</div>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling List */}
      <div className="flex gap-2.5 overflow-x-scroll no-scrollbar min-h-60">
        <div className="w-3" />
        {loading && <div className="py-10 text-center w-full">Loading papers...</div>}
        {error && (
          <div className="py-10 text-center text-red-600 w-full">Error loading papers.</div>
        )}
        {!loading &&
          !error &&
          list.map((paper) => (
            <div
              key={paper._id}
              // Responsive width, min-height instead of fixed height
              className="flex flex-col justify-between bg-black bg-opacity-80 p-4 rounded-2xl w-80 shrink-0"
            >
              {/* Paper Title */}
              <a
                href={paper.link}
                target="_blank"
                className="text-sm underline sm:text-[16px] text-text_white_primary break-words"
              >
                {truncateText(paper.title, 130)} {/* Slightly less truncation */}
              </a>
              {/* Paper Details & Link */}
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col text-sm text-[#08DBE9] truncate">
                  {paper.authors.map((author, index) => (
                    <span key={index}>{author}</span>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {paper.year && (
                    <div className="text-text_white_tertiary text-base">{paper.year}</div>
                  )}
                  {paper.venue && (
                    <div className="text-text_white_primary font-bold text-base">{paper.venue}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div className="w-3" />
      </div>

      {/* Link to All Papers */}
      <div className="px-4 sm:px-6 lg:px-[25px] mt-4">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-text_black_primary border-solid rounded-[15px] w-full h-12 sm:h-[50px] font-semibold text-base sm:text-[18px] text-text_black_primary hover:bg-text_black_primary hover:text-primary_main transition-colors duration-200"
          to="/publications#journal"
        >
          <span>All Journal Papers</span>
          <Up_right_neutral_arrow className="size-4 sm:size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};

// Conference Component
const Conference = () => {
  const [list, setList] = useState([]); // Store all fetched papers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConferencePapers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/publications/type/conference`); // Ensure endpoint exists
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setList(data.slice(0, 5)); // Store all
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch conference papers:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchConferencePapers();
  }, []);

  return (
    // Responsive padding, margin, gap
    <div className="flex flex-col gap-6 sm:gap-[30px] py-6 sm:py-[30px] w-full">
      <h2 className="flex justify-between items-end px-4 text-5xl font-semibold text-text_black_primary tracking-normal">
        <span>Conference Papers</span>
        <Down_left_dark_arrow className="size-12 lg:size-14" style={{ strokeWidth: 1 }} />
      </h2>

      {/* Horizontal Scrolling List */}
      <div className="flex gap-2 overflow-x-scroll no-scrollbar min-h-60">
        <div className="w-2" />
        {/* Added min-height */}
        {loading && <div className="py-10 text-center w-full">Loading papers...</div>}
        {error && (
          <div className="py-10 text-center text-red-600 w-full">Error loading papers.</div>
        )}
        {!loading &&
          !error &&
          list.map((item) => (
            <div
              key={item._id}
              // Responsive width, min-height instead of fixed height
              className="flex flex-col justify-between bg-[#C1EDFF] p-4 rounded-2xl w-80 shrink-0"
            >
              {/* Paper Title */}
              <a
                href={item.link}
                target="_blank"
                className="text-sm underline sm:text-[16px] text-text_black_primary break-words"
              >
                {truncateText(item.title, 130)} {/* Slightly less truncation */}
              </a>
              {/* Paper Details & Link */}
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col text-sm text-[#10719A] truncate">
                  {item.authors.map((author, index) => (
                    <span key={index}>{author}</span>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {item.year && <div className="text-text_black_primary text-xl">{item.year}</div>}
                  {item.venue && (
                    <div className="text-text_black_primary font-bold text-base">{item.venue}</div>
                  )}
                  {item.location && (
                    <div className="text-text_black_primary text-xl">{item.location}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div className="w-2" />
      </div>

      {/* Link to All Papers */}
      <div className="px-4 sm:px-6 lg:px-[25px] mt-4">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-primary_main border-solid rounded-[15px] w-full h-12 sm:h-[50px] font-semibold text-base sm:text-[18px] text-primary_main hover:bg-primary_main hover:text-white transition-colors duration-200"
          to="/publications#conference"
        >
          <span>All Conference Papers</span>
          <Up_right_neutral_arrow className="size-4 sm:size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};

export default Home;
