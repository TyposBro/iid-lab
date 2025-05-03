import { useRef, useState, useEffect } from "react";
import { GoTo, MainCarousel } from "@/components/"; // Assume these are responsive
import { useNavigate } from "react-router";
import { HashLink } from "react-router-hash-link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import PropTypes from "prop-types";

import { Down_left_dark_arrow, Link, Up_right_neutral_arrow } from "@/assets/";
import { truncateText } from "@/utils/text";
import { BASE_URL } from "@/config/api";

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
      <GoTo title="Projects Gallery" link="/gallery" /> {/* Assume GoTo is responsive */}
    </div>
  );
};

// Intro Component
const Intro = ({ navigate }) => {
  const slides = [
    "/img/home/home_intro.png",
    "/img/gallery/jeju-2024/1.png",
    "/img/gallery/croatia-2024/1.png",
    "/img/gallery/unist-2024/1.png",
    "/img/gallery/gyeongju-2023/1.png",
  ];

  return (
    // Responsive padding and gap
    <div className="flex flex-col px-4 sm:px-6 lg:px-[25px] w-full gap-6 sm:gap-8">
      <MainCarousel slides={slides} /> {/* Assume MainCarousel is responsive */}
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
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full sm:w-64 h-12 sm:h-14 text-primary_main active:text-white no-underline transition-colors duration-200 hover:bg-primary_main hover:text-white"
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full sm:w-64 h-12 sm:h-14 text-primary_main active:text-white no-underline transition-colors duration-200 hover:bg-primary_main hover:text-white"
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
        <h1 className="font-light text-3xl sm:text-[42px] text-text_black_primary leading-tight sm:leading-[46px]">
          Team Members
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
              <div className="flex flex-col gap-1 sm:gap-[4px] w-[170px]">
                {" "}
                {/* Match width */}
                {/* Responsive text */}
                <h2 className="font-bold text-base sm:text-[18px] text-text_black_primary truncate">
                  {member.name}
                </h2>
                <h3 className="text-xs sm:text-[12px] text-text_black_primary truncate">
                  {member.role}
                </h3>
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
    <div className="flex flex-col gap-6 sm:gap-[30px] bg-black text-white px-4 sm:px-6 lg:px-[25px] py-6 sm:py-[30px] w-full">
      {/* Title and Description Section */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-10 sm:items-center sm:flex-row">
        {/* Responsive title */}
        <h2 className="font-extralight text-4xl sm:text-5xl lg:text-[80px] leading-tight text-text_white_primary sm:shrink-0">
          Current Projects
        </h2>
        {/* Responsive description */}
        <h3 className="font-light text-sm sm:text-base lg:text-lg text-text_white_secondary">
          We create innovative design concepts through systematic, human-centered methods,
          developing them into products and services using engineering design. Our focus is on
          elderly care, rehabilitation, healthcare, and safety... {/* Truncated for brevity */}
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
            <div key={project._id} className="relative w-full group overflow-hidden rounded-[20px]">
              {/* Background Image */}
              <div
                className="relative bg-gray-700 rounded-[20px] w-full aspect-video lg:h-[270px] bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image || "/img/placeholder.png"})` }} // Added placeholder
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-[20px]"></div>
              </div>
              {/* Text Overlay */}
              <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 right-3 pointer-events-none">
                {/* Responsive text */}
                <h2 className="font-bold text-lg sm:text-xl lg:text-[24px] text-text_white_primary">
                  {project.title}
                </h2>
                <h3 className="text-xs sm:text-sm lg:text-[12px] text-text_white_secondary mt-1">
                  {project.desc}
                </h3>
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
  const [journalPapers, setJournalPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store all fetched papers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(""); // Default to empty or first type

  useEffect(() => {
    const fetchJournalPapers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/publications/type/journal`); // Ensure endpoint exists
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAllPapers(data); // Store all fetched papers
        setJournalPapers(data.slice(0, 5)); // Show initial slice
        // Set initial filter type if data exists
        if (data.length > 0) {
          const types = [...new Set(data.map((p) => p.type))];
          if (types.length > 0) {
            setSelectedType(types[0]);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch journal papers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournalPapers();
  }, []);

  const filters = [...new Set(allPapers.map((item) => item.type))]; // Derive filters from all papers

  // Filter papers based on selected type for display
  const filteredPapers = selectedType
    ? allPapers.filter((paper) => paper.type === selectedType).slice(0, 5) // Show max 5 of selected type
    : journalPapers; // Show initial slice if no type selected

  // NOTE: Loading/Error states removed for brevity here, add them back like in Prof component if needed

  return (
    // Responsive padding, background, gap
    <div className="flex flex-col gap-6 sm:gap-[30px] bg-primary_main text-white py-6 sm:py-[30px] w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-4 sm:gap-5 px-4 sm:px-6 lg:px-[25px]">
        {/* Responsive title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text_white_primary leading-tight lg:leading-[48px] tracking-normal">
          Journal Papers
        </h2>
        {/* Filter Buttons - Allow wrapping */}
        <div className="flex gap-2 sm:gap-[10px] flex-wrap">
          {loading && <div className="text-sm text-text_white_secondary">Loading filters...</div>}
          {!loading &&
            filters.map((item) => (
              <button
                key={item}
                className={`place-content-center border-2 grid px-4 py-1 sm:px-5 sm:py-[6px] border-solid rounded-full font-medium text-sm sm:text-[16px] transition-colors duration-200 ${
                  selectedType === item
                    ? "bg-white text-primary_main border-white" // Active state
                    : "bg-transparent text-white border-white hover:bg-white hover:text-primary_main" // Inactive state
                }`}
                onClick={() => setSelectedType(item)}
              >
                {item}
              </button>
            ))}
          {!loading && filters.length === 0 && (
            <div className="text-sm text-text_white_secondary">No paper types found.</div>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling List */}
      <div className="flex gap-3 sm:gap-[10px] px-4 sm:px-6 lg:px-[25px] overflow-x-scroll no-scrollbar min-h-[320px] sm:min-h-[340px]">
        {" "}
        {/* Added min-height */}
        {loading && <div className="py-10 text-center w-full">Loading papers...</div>}
        {error && (
          <div className="py-10 text-center text-red-600 w-full">Error loading papers.</div>
        )}
        {!loading &&
          !error &&
          filteredPapers.map((paper) => (
            <div
              key={paper._id}
              // Responsive width, min-height instead of fixed height
              className="flex flex-col justify-between bg-black bg-opacity-80 p-4 sm:p-[20px] rounded-[20px] w-[280px] sm:w-[310px] lg:w-96 min-h-[300px] sm:min-h-[300px] shrink-0"
            >
              {/* Paper Title */}
              <span className="text-sm sm:text-[16px] text-text_white_primary break-words">
                {truncateText(paper.title, 130)} {/* Slightly less truncation */}
              </span>
              {/* Paper Details & Link */}
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col gap-1 overflow-hidden mr-2">
                  {" "}
                  {/* Added gap and overflow */}
                  <div className="flex flex-col text-base sm:text-[18px] lg:text-[20px]">
                    <div className="font-bold text-text_white_primary break-words truncate">
                      {paper.conference}
                    </div>
                    <div className="text-text_white_tertiary text-sm sm:text-base">
                      {paper.year}
                    </div>
                  </div>
                  <div
                    className="font-semibold text-xs sm:text-[14px] truncate"
                    style={{ color: paper.color || "#FFFFFF" }}
                  >
                    {" "}
                    {/* Default color */}
                    {paper.authors.join(", ")}
                  </div>
                </div>
                {paper.link && ( // Conditionally render link
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-auto shrink-0"
                  >
                    <Link className="text-text_white_primary hover:text-gray-300 size-5 sm:size-[25px]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        {!loading && !error && filteredPapers.length === 0 && (
          <div className="py-10 text-center w-full text-text_white_secondary">
            No papers found for this type.
          </div>
        )}
      </div>

      {/* Link to All Papers */}
      <div className="px-4 sm:px-6 lg:px-[25px] mt-4">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-white border-solid rounded-[15px] w-full h-12 sm:h-[50px] font-semibold text-base sm:text-[18px] text-text_white_primary hover:bg-white hover:text-primary_main transition-colors duration-200"
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
  const [conferencePapers, setConferencePapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store all fetched papers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(""); // Default to empty or first type

  useEffect(() => {
    const fetchConferencePapers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/publications/type/conference`); // Ensure endpoint exists
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAllPapers(data); // Store all
        setConferencePapers(data.slice(0, 5)); // Initial slice
        // Set initial filter type if data exists
        if (data.length > 0) {
          const types = [...new Set(data.map((p) => p.type))];
          if (types.length > 0) {
            setSelectedType(types[0]);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch conference papers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConferencePapers();
  }, []);

  const filters = [...new Set(allPapers.map((item) => item.type))]; // Derive filters from all papers

  // Filter papers based on selected type for display
  const filteredPapers = selectedType
    ? allPapers.filter((paper) => paper.type === selectedType).slice(0, 5) // Show max 5 of selected type
    : conferencePapers; // Show initial slice if no type selected

  // NOTE: Loading/Error states removed for brevity here, add them back like in Prof component if needed

  return (
    // Responsive padding, margin, gap
    <div className="flex flex-col gap-6 sm:gap-[30px] py-6 sm:py-[30px] w-full">
      {/* Title and Filters Section */}
      <div className="flex flex-col gap-4 sm:gap-5 px-4 sm:px-6 lg:px-[25px]">
        {/* Responsive title with icon */}
        <h2 className="flex items-end text-3xl sm:text-4xl lg:text-5xl text-text_black_primary leading-tight lg:leading-[48px] tracking-normal">
          <span>Conference Papers</span>
          <Down_left_dark_arrow className="size-10 sm:size-12 lg:size-[51px] ml-1" />
        </h2>
        {/* Filter Buttons - Allow wrapping */}
        <div className="flex gap-2 sm:gap-[10px] flex-wrap">
          {loading && <div className="text-sm text-gray-600">Loading filters...</div>}
          {!loading &&
            filters.map((item) => (
              <button
                key={item}
                className={`place-content-center border-2 grid px-4 py-1 sm:px-5 sm:py-[6px] border-solid rounded-full font-medium text-sm sm:text-[16px] transition-colors duration-200 ${
                  selectedType === item
                    ? "bg-primary_main text-white border-primary_main" // Active state
                    : "bg-transparent text-primary_main border-primary_main hover:bg-primary_main hover:text-white" // Inactive state
                }`}
                onClick={() => setSelectedType(item)}
              >
                {item}
              </button>
            ))}
          {!loading && filters.length === 0 && (
            <div className="text-sm text-gray-600">No paper types found.</div>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling List */}
      <div className="flex gap-3 sm:gap-[10px] px-4 sm:px-6 lg:px-[25px] overflow-x-scroll no-scrollbar min-h-[320px] sm:min-h-[340px]">
        {" "}
        {/* Added min-height */}
        {loading && <div className="py-10 text-center w-full">Loading papers...</div>}
        {error && (
          <div className="py-10 text-center text-red-600 w-full">Error loading papers.</div>
        )}
        {!loading &&
          !error &&
          filteredPapers.map((paper) => (
            <div
              key={paper._id}
              // Responsive width, min-height
              className="flex flex-col justify-between bg-[#C1EDFF] p-4 sm:p-[20px] rounded-[20px] w-[280px] sm:w-[310px] lg:w-96 min-h-[300px] sm:min-h-[300px] shrink-0"
            >
              {/* Paper Title */}
              <span className="text-base sm:text-[18px] text-text_black_primary break-words">
                {truncateText(paper.title, 130)}
              </span>
              {/* Paper Details & Link */}
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col gap-1 overflow-hidden mr-2">
                  {" "}
                  {/* Added gap and overflow */}
                  <div className="flex flex-col text-base sm:text-[18px] lg:text-[20px]">
                    <span className="font-bold text-text_black_primary truncate">
                      {" "}
                      {paper.conference}{" "}
                    </span>
                    <span className="text-text_black_primary text-sm sm:text-base">
                      {" "}
                      {paper.year}{" "}
                    </span>
                    <span className="text-text_black_primary text-sm sm:text-base truncate">
                      {" "}
                      {paper.location}{" "}
                    </span>
                  </div>
                  <div
                    className="font-semibold text-xs sm:text-[14px] truncate"
                    style={{ color: paper.color || "#000000" }}
                  >
                    {" "}
                    {/* Default color */}
                    {paper.authors.join(", ")}
                  </div>
                </div>
                {paper.link && ( // Conditionally render link
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-auto shrink-0"
                  >
                    <Link className="text-text_black_primary hover:text-gray-700 size-5 sm:size-[25px]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        {!loading && !error && filteredPapers.length === 0 && (
          <div className="py-10 text-center w-full text-gray-600">
            No papers found for this type.
          </div>
        )}
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
