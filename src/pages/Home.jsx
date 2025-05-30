// {PATH_TO_THE_PROJECT}/src/pages/Home.jsx

import { useRef, useState, useEffect, useCallback, useMemo } from "react"; // Added useCallback
import { MainCarousel } from "@/components/"; // Assume these are responsive
import { useNavigate } from "react-router";
import { HashLink } from "react-router-hash-link";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import PropTypes from "prop-types";

import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { truncateText } from "@/utils/text"; // Ensure this utility exists
import { BASE_URL } from "@/config/api";
import { LinkedIn } from "@mui/icons-material";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminMetaControls } from "@/components/AdminMetaControls";
import { LoadingSpinner } from "@/components/"; // Ensure this component is available

// Main Home Component
export const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [homeMeta, setHomeMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultHomeMeta = useMemo(
    () => ({
      title: "Integration & Innovation Design",
      description:
        "Integration + Innovation Design Lab focuses on design and development of innovative products and services by integrating Design, Ergonomics, Engineering, Technology and Entrepreneurship.",
      homeYoutubeId: "Xd-lcSxIsHM",
    }),
    []
  );

  const fetchHomeMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/home`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Home meta data not found, using defaults.");
          setHomeMeta(defaultHomeMeta);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setHomeMeta(data);
        if (data.title) {
          document.title = data.title + " Lab";
        } else {
          document.title = defaultHomeMeta.title + " Lab";
        }
      }
    } catch (err) {
      setMetaError(err.message);
      console.error("Failed to fetch home meta:", err);
      setHomeMeta(defaultHomeMeta);
      document.title = defaultHomeMeta.title + " Lab";
    } finally {
      setMetaLoading(false);
    }
  }, [defaultHomeMeta]);

  useEffect(() => {
    fetchHomeMeta();
  }, [fetchHomeMeta, refreshMetaKey]);

  const handleMetaUpdated = () => {
    setRefreshMetaKey((prev) => prev + 1);
  };

  const currentTitle = homeMeta?.title || defaultHomeMeta.title;
  const currentDescription = homeMeta?.description || defaultHomeMeta.description;
  const currentYoutubeId = homeMeta?.homeYoutubeId || defaultHomeMeta.homeYoutubeId;

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full min-h-screen">
      {isAdmin && homeMeta && (
        <AdminMetaControls
          pageIdentifier="home"
          initialData={homeMeta}
          fieldsConfig={[
            {
              name: "title",
              label: "Page Title (e.g., Integration & Innovation Design)",
              type: "text",
              hint: "The '&' symbol will be styled. 'Lab' is appended automatically.",
            },
            { name: "description", label: "Page Description/Subtitle", type: "textarea" },
            { name: "homeYoutubeId", label: "Home Page YouTube Video ID", type: "text" },
          ]}
          onUpdateSuccess={handleMetaUpdated}
          containerClass="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-[25px] py-2 bg-gray-50 rounded-b-lg shadow"
        />
      )}

      {metaLoading && (
        <div className="p-10 text-center w-full">
          <LoadingSpinner message="Loading page details..." />
        </div>
      )}
      {metaError && !metaLoading && (
        <div className="p-6 text-center text-red-500 w-full">
          Error loading page details: {metaError}. Displaying default content.
        </div>
      )}

      {(!metaLoading || homeMeta) && (
        <>
          <Intro
            navigate={navigate}
            titleText={currentTitle}
            descriptionText={currentDescription}
          />
          <div className="my-6 sm:my-[30px] px-4 sm:px-6 lg:px-[25px] w-full">
            <LiteYouTubeEmbed
              id={currentYoutubeId}
              adNetwork={true}
              params=""
              playlist={false}
              playlistCoverId={currentYoutubeId}
              poster="hqdefault"
              title={currentTitle + " Lab Video"}
              noCookie={true}
              ref={ref}
              activeClass="lyt-activated"
              iframeClass=""
              playerClass="lty-playbtn"
              wrapperClass="yt-lite rounded-[20px] sm:rounded-[30px]"
              muted={true}
            />
          </div>
          <Prof navigate={navigate} />
          <Members />
          <Projects />
          <Journal />
          <Conference />
        </>
      )}
    </div>
  );
};

// Intro Component
const Intro = ({ navigate, titleText, descriptionText }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          .slice(0, 7);
        setEvents(slides);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching gallery events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryEvents();
  }, []);

  let titlePart1 = titleText || "Integration & Innovation Design";
  let titleEmphasis = "";
  let titlePart2 = "";
  const labSuffix = " Lab";

  const titleWithoutSuffix = titleText.endsWith(labSuffix)
    ? titleText.slice(0, -labSuffix.length)
    : titleText;

  const emphasisIndex = titleWithoutSuffix.indexOf("&");
  if (emphasisIndex !== -1) {
    titlePart1 = titleWithoutSuffix.substring(0, emphasisIndex).trim();
    titleEmphasis = "&";
    titlePart2 = titleWithoutSuffix.substring(emphasisIndex + 1).trim();
  } else {
    titlePart1 = titleWithoutSuffix;
  }

  if (loading && !events.length)
    return (
      <div className="w-full px-4 sm:px-6 lg:px-[25px]">
        <div className="h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse rounded-lg my-6"></div>
      </div>
    );

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-[25px] w-full gap-6 sm:gap-8">
      {events.length > 0 && <MainCarousel slides={events} />}
      {error && !loading && (
        <div className="text-xs text-red-400 text-center py-2">
          Could not load gallery images: {error}
        </div>
      )}

      <div className="flex flex-col gap-6 sm:gap-[30px] w-full sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 sm:gap-[8px]">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] text-text_black_primary tracking-tight lg:tracking-[-4%] leading-tight lg:leading-[48px]">
            {titlePart1}
            {titleEmphasis && <span className="text-primary_main">{titleEmphasis}</span>}
            {titlePart2}
            {(titlePart1 || titlePart2) && labSuffix}
          </h1>
          <h3 className="text-sm lg:text-[12px] xl:text-sm text-text_black_secondary max-w-xl">
            {descriptionText}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-[10px] font-semibold text-base sm:text-[18px] flex-shrink-0">
          <button
            className="place-content-center border-2 border-border_dark active:border-border_dark grid active:bg-border_dark border-solid rounded-[15px] w-full sm:w-auto sm:px-10 h-12 sm:h-14 text-border_dark active:text-white no-underline transition-colors duration-200 hover:bg-border_dark hover:text-white"
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="place-content-center border-2 border-border_dark active:border-border_dark grid active:bg-border_dark border-solid rounded-[15px] w-full sm:w-auto sm:px-10 h-12 sm:h-14 text-border_dark active:text-white no-underline transition-colors duration-200 hover:bg-border_dark hover:text-white"
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
  titleText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
};

// Prof Component
const Prof = ({ navigate }) => {
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/prof`);
        if (!response.ok) {
          if (response.status === 404) {
            console.warn("Professor data not found.");
            setProf(null);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setProf(data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch professor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessorData();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center w-full">
        <LoadingSpinner message="Loading professor data..." />
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600 w-full">
        Error loading professor data: {error}
      </div>
    );
  if (!prof)
    return (
      <div className="p-6 text-center text-gray-500 w-full">
        Professor data is not available at the moment.
      </div>
    );

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-[30px] my-6 sm:my-[30px] px-4 sm:px-6 lg:px-[25px] w-full">
      <div
        className="mx-auto sm:mx-0 rounded-[20px] sm:rounded-[30px] w-full max-w-[240px] sm:w-[240px] h-[300px] bg-gray-200 sm:flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${prof.img || "/img/placeholder.png"})` }}
        role="img"
        aria-label={`Image of ${prof.name}`}
      ></div>
      <div className="flex flex-col gap-6 sm:gap-[30px] sm:justify-between w-full">
        <div className="flex flex-col gap-1 sm:gap-[5px] w-full">
          <h2 className="font-bold text-lg sm:text-[20px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-3xl sm:text-[36px] text-text_black_primary leading-tight sm:leading-[36px]">
            {prof.name}
          </h1>
          <h3 className="text-sm lg:text-[12px] xl:text-sm text-text_black_secondary max-w-lg">
            {prof.desc}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-[10px] font-semibold text-base sm:text-[18px]">
          <button
            onClick={() => navigate("/prof")}
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full sm:w-auto sm:px-10 h-12 sm:h-[50px] text-primary_main active:text-white no-underline cursor-pointer transition-colors duration-200 hover:bg-primary_main hover:text-white"
          >
            CV
          </button>
          <HashLink
            className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full sm:w-auto sm:px-10 h-12 sm:h-[50px] text-primary_main active:text-white no-underline transition-colors duration-200 hover:bg-primary_main hover:text-white"
            to="/#contact"
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
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/team`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMembers(data.filter((member) => member.type !== "alumni"));
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  if (loading)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] py-10 text-center w-full">
        <LoadingSpinner message="Loading team members..." />
      </div>
    );
  if (error)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] py-10 text-center text-red-600 w-full">
        Error loading team members: {error}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 sm:gap-[30px] my-6 sm:my-[30px] w-full shrink-0">
      <div className="flex flex-col gap-2 sm:gap-[10px] px-4 sm:px-6 lg:px-[25px]">
        <h1 className="font-semibold text-5xl sm:text-[42px] text-text_black_primary leading-tight sm:leading-[46px]">
          Current Team
        </h1>
      </div>
      <div className="flex flex-row gap-4 sm:gap-[10px] px-4 sm:px-6 lg:px-[25px] w-full overflow-x-auto no-scrollbar pb-2">
        {members.length === 0 && !loading && (
          <div className="py-10 text-center text-gray-500 w-full">
            No current team members found.
          </div>
        )}
        {members.map((member) => (
          <div key={member._id} className="flex flex-col gap-3 sm:gap-[14px] w-auto shrink-0">
            <div
              className="bg-gray-200 rounded-[20px] w-[170px] h-[270px] shrink-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${member.img || "/img/placeholder.png"})` }}
              role="img"
              aria-label={`Image of ${member.name}`}
            ></div>
            <div className="flex flex-col sm:gap-1 w-[170px]">
              <h2
                className="font-bold text-base sm:text-lg text-text_black_primary truncate"
                title={member.name}
              >
                {member.name}
              </h2>
              <h3
                className="text-xs sm:text-sm text-text_black_primary truncate"
                title={member.role}
              >
                {member.role}
              </h3>
              {member.linkedIn && (
                <a
                  href={member.linkedIn}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-block"
                  aria-label={`${member.name}'s LinkedIn Profile`}
                >
                  <LinkedIn className="text-text_black_primary hover:text-blue-600 size-5 sm:size-[25px]" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
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

// Projects Component (Updated to reflect File 1 design)
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/projects/status/current`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProjects(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProjects();
  }, []);

  const handleLearnMore = (projectLink, projectId) => {
    if (projectLink) {
      window.open(projectLink, "_blank", "noopener,noreferrer");
    } else if (projectId) {
      console.log("No direct link, project ID:", projectId);
      // Potentially navigate to a detail page: navigate(`/projects/${projectId}`);
    }
  };

  if (loading)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] bg-text_black_primary py-10 text-center w-full">
        <LoadingSpinner message="Loading projects..." />
      </div>
    );
  if (error)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] bg-text_black_primary py-10 text-center text-red-400 w-full">
        Error loading projects: {error}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 sm:gap-[30px] bg-text_black_primary text-white px-4 sm:px-6 lg:px-[25px] py-6 sm:py-[30px] w-full">
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-10 sm:items-center sm:flex-row">
        <h2 className="font-semibold text-5xl sm:text-5xl lg:text-[80px] leading-tight text-text_white_primary sm:shrink-0">
          Current Projects
        </h2>
        <h3 className="text-sm sm:text-base lg:text-lg text-text_white_secondary max-w-2xl">
          We create innovative design concepts through systematic, human-centered methods,
          developing them into products and services using engineering design. Our focus is on
          elderly care, rehabilitation, healthcare, and safety, and we collaborate closely with
          experts in medicine, geriatrics, physical therapy, materials, and production.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {projects.length === 0 && !loading && (
          <div className="py-10 text-center text-gray-400 w-full md:col-span-2">
            No current projects found.
          </div>
        )}
        {projects.map((project) => (
          // Project Card based on File 1 design
          <div key={project._id} className="relative w-full rounded-3xl">
            {" "}
            {/* Container for positioning */}
            <img
              className="absolute top-0 left-0 rounded-t-3xl w-full h-60 object-cover z-0" // Image layer
              src={`${project.image || "/img/placeholder.png"}`}
              alt={project.title || "Project image"}
            />
            {/* The card's main body, which includes the border and background for content */}
            <div className="relative w-full min-h-[250px] rounded-3xl flex flex-col items-end border border-[#282828f2] bg-transparent overflow-hidden">
              {/* This div creates space for the image above it. Content starts below this. */}
              <div className="w-full h-60 flex-shrink-0" /> {/* Spacer for image height */}
              {/* Text content area */}
              <div className="w-full flex flex-col gap-2 px-5 pt-4 flex-grow">
                <h2 className="font-bold text-base sm:text-xl lg:text-[24px] text-text_white_primary">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <h3 className="text-sm text-text_white_primary">{project.subtitle}</h3>
                )}
              </div>
              {/* Button */}
              <button
                onClick={() => handleLearnMore(project.link, project._id)}
                className="mb-5 mr-5 mt-2 px-4 py-2 border-2 border-primary_main rounded-md font-semibold text-sm text-primary_main hover:bg-primary_main hover:text-text_black_primary transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-primary_main border-solid rounded-[15px] h-12 sm:h-[50px] font-semibold text-base sm:text-[18px] text-primary_main hover:bg-primary_main hover:text-text_black_primary transition-colors duration-200"
          to="/projects#completed"
        >
          <span>Completed Projects</span>
          <Up_right_neutral_arrow className="size-4 sm:size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};

// Journal Component (Updated to reflect File 1 design)
const Journal = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournalPapersDirectly = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/publications/type/journal`);
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
    fetchJournalPapersDirectly();
  }, []);

  if (loading)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] bg-primary_main py-10 text-center w-full">
        <LoadingSpinner message="Loading journal papers..." />
      </div>
    );
  if (error)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] bg-primary_main py-10 text-center text-red-300 w-full">
        Error loading journal papers: {error}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 sm:gap-[30px] bg-primary_main text-white py-6 sm:py-[30px] w-full">
      <div className="flex flex-col gap-4 sm:gap-5 px-5 sm:px-6 lg:px-[25px]">
        <h2 className="text-5xl text-text_black_primary tracking-normal font-semibold">
          Journal Papers
        </h2>
      </div>

      <div className="flex gap-2.5 overflow-x-scroll no-scrollbar min-h-[240px] px-2 sm:px-0 pb-2">
        <div className="w-1 sm:w-3 shrink-0" />
        {list.length === 0 && !loading && (
          <div className="py-10 text-center text-text_black_secondary w-full">
            No journal papers found.
          </div>
        )}
        {list.map((paper) => (
          // Journal Card based on File 1 design
          <div
            key={paper._id}
            className="flex flex-col justify-between bg-black bg-opacity-80 p-4 rounded-2xl w-80 shrink-0 shadow-lg"
          >
            <a
              href={paper.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-[16px] text-text_white_primary break-words hover:underline font-medium"
              title={paper.title}
            >
              {truncateText(paper.title, 130)}
            </a>
            <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col text-sm text-[#08DBE9] truncate">
                {paper.authors.map((author, index) => (
                  <span key={index} className="truncate">
                    {author}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-end gap-1">
                {paper.year && (
                  <div className="text-text_white_tertiary text-base">{paper.year}</div>
                )}
                {paper.venue && (
                  <div className="text-text_white_primary font-bold text-base truncate max-w-[120px] sm:max-w-[150px]">
                    {paper.venue}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="w-1 sm:w-3 shrink-0" />
      </div>

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

// Conference Component (Updated to reflect File 1 design)
const Conference = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferencePapersDirectly = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/publications/type/conference`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setList(data.slice(0, 5));
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch conference papers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConferencePapersDirectly();
  }, []);

  if (loading)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] py-10 text-center w-full">
        <LoadingSpinner message="Loading conference papers..." />
      </div>
    );
  if (error)
    return (
      <div className="px-4 sm:px-6 lg:px-[25px] py-10 text-center text-red-600 w-full">
        Error loading conference papers: {error}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 sm:gap-[30px] py-6 sm:py-[30px] w-full">
      <h2 className="flex justify-between items-end px-4 sm:px-6 lg:px-[25px] text-5xl font-semibold text-text_black_primary tracking-normal">
        <span>Conference Papers</span>
        <Down_left_dark_arrow className="size-12 lg:size-14" style={{ path: { strokeWidth: 1 } }} />
      </h2>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar min-h-[240px] px-2 sm:px-0 pb-2">
        <div className="w-1 sm:w-3 shrink-0" />
        {list.length === 0 && !loading && (
          <div className="py-10 text-center text-gray-500 w-full">No conference papers found.</div>
        )}
        {list.map((item) => (
          // Conference Card based on File 1 design
          <div
            key={item._id}
            className="flex flex-col justify-between bg-[#C1EDFF] p-4 rounded-2xl w-80 shrink-0 shadow-md"
          >
            <a
              href={item.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-[16px] text-text_black_primary break-words hover:underline font-medium"
              title={item.title}
            >
              {truncateText(item.title, 130)}
            </a>
            <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col text-sm text-[#10719A] truncate">
                {item.authors.map((author, index) => (
                  <span key={index} className="truncate">
                    {author}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-end gap-1">
                {item.year && <div className="text-text_black_primary text-xl">{item.year}</div>}
                {item.venue && (
                  <div className="text-text_black_primary font-bold text-base truncate max-w-[120px] sm:max-w-[150px]">
                    {item.venue}
                  </div>
                )}
                {item.location && (
                  <div className="text-text_black_primary text-xl truncate max-w-[120px] sm:max-w-[150px]">
                    {item.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="w-1 sm:w-3 shrink-0" />
      </div>

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
