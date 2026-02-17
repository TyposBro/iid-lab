// {PATH_TO_THE_PROJECT}/src/pages/Home.jsx

import { useRef } from "react";
import { useNavigate } from "react-router";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";

import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { truncateText } from "@/utils/text";
import { LinkedIn } from "@mui/icons-material";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminMetaControls } from "@/components/AdminMetaControls";
import { LoadingSpinner } from "@/components/";
import {
  useHomePageMeta,
  useGalleryEvents,
  useProfessors,
  useTeamMembers,
  useProjects,
  usePublications,
} from "@/hooks";

// Main Home Component
export const Home = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  // --- Overall Home Page Meta ---
  const {
    data: homePageMeta,
    isLoading: pageMetaLoading,
    error: pageMetaError,
    refetch: refetchHomeMeta,
  } = useHomePageMeta();

  // When admin updates meta data, trigger a refetch so UI reflects latest values
  const handlePageMetaUpdated = () => {
    // Fire and forget; react-query will update cache & re-render
    refetchHomeMeta();
  };

  // Set document title when meta data is available
  if (homePageMeta?.title) {
    document.title = homePageMeta.title;
  }

  const currentTitle = homePageMeta?.title || "";
  const currentDescription = homePageMeta?.description || "";
  const currentStaticImage = homePageMeta?.homeStaticImage || "";
  const currentProjectsTitle = homePageMeta?.currentProjectsTitle || "";
  const currentProjectsDescription = homePageMeta?.currentProjectsDescription || "";
  const journalPapersTitle = homePageMeta?.journalPapersTitle || "";
  const conferencePapersTitle = homePageMeta?.conferencePapersTitle || "";
  const currentTeamTitle = homePageMeta?.currentTeamTitle || "";

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full min-h-screen">
      {isAdmin && homePageMeta && (
        <AdminMetaControls
          pageIdentifier="home" // This will now manage all text fields for the home page
          initialData={homePageMeta} // Pass the comprehensive meta object
          fieldsConfig={[
            {
              name: "title",
              label: "Page Title (e.g., Integration & Innovation Design)",
              type: "text",
              hint: "The '&' symbol will be styled. 'Lab' is appended automatically.",
            },
            {
              name: "description",
              label: "Page Description/Subtitle (Below title)",
              type: "textarea",
            },
            { name: "homeStaticImage", label: "Home Page Static Image URL", type: "text" },
            { name: "currentProjectsTitle", label: "Current Projects Section Title", type: "text" },
            {
              name: "currentProjectsDescription",
              label: "Current Projects Section Description",
              type: "textarea",
            },
            { name: "journalPapersTitle", label: "Publications Section Title", type: "text" },
            {
              name: "conferencePapersTitle",
              label: "Conference Papers Section Title",
              type: "text",
            },
            { name: "currentTeamTitle", label: "Current Team Section Title", type: "text" },
            // Add more fields here if other sections on Home need dynamic text
          ]}
          onUpdateSuccess={handlePageMetaUpdated}
          containerClass="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-[25px] py-2 bg-gray-50 rounded-b-lg shadow"
        />
      )}

      {pageMetaLoading && (
        <div className="p-10 text-center w-full">
          <LoadingSpinner variant="block" message="Loading page details..." />
        </div>
      )}
      {pageMetaError && !pageMetaLoading && (
        <div className="p-6 text-center text-red-500 w-full">
          Error loading page details: {pageMetaError.message}. Displaying default content.
        </div>
      )}

      {(!pageMetaLoading || homePageMeta) && (
        <>
          <Intro
            navigate={navigate}
            titleText={currentTitle}
            descriptionText={currentDescription}
            staticImage={currentStaticImage}
          />
          <Prof navigate={navigate} />
          <Members sectionTitle={currentTeamTitle} />
          <Projects
            sectionTitle={currentProjectsTitle}
            sectionDescription={currentProjectsDescription}
          />
          <Journal sectionTitle={journalPapersTitle} />
          <Conference sectionTitle={conferencePapersTitle} />
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Intro / Hero
// ---------------------------------------------------------------------------
const Intro = ({ navigate, titleText, descriptionText, staticImage }) => {
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

  return (
    <div className="flex flex-col px-[25px] lg:px-[70px] w-full gap-4 lg:gap-6">
      {/* Hero image */}
      {staticImage ? (
        <img
          src={staticImage}
          alt="IID Lab"
          className="w-full h-[200px] lg:h-[465px] object-cover rounded-[30px]"
        />
      ) : (
        <div className="w-full h-[200px] lg:h-[465px] bg-background_light rounded-[30px] flex items-center justify-center text-text_black_secondary">
          No image available
        </div>
      )}

      {/* Below image: stacked on mobile, flex-row on desktop */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-10 w-full">
        {/* Title + description */}
        <div className="flex flex-col gap-2 lg:max-w-[794px]">
          <h1 className="text-[64px] leading-[56px] font-semibold lg:text-[48px] lg:leading-[61px] lg:tracking-[-0.04em] lg:font-bold font-display text-text_black_primary">
            {titlePart1}
            {titleEmphasis && (
              <span className="text-primary_main">{" " + titleEmphasis + " "}</span>
            )}
            {titlePart2}
            {(titlePart1 || titlePart2) && labSuffix}
          </h1>
          <p className="text-sm lg:text-lg text-text_black_secondary">{descriptionText}</p>
        </div>

        {/* Buttons — stacked vertically */}
        <div className="flex flex-col gap-3 w-full lg:w-[270px] shrink-0">
          <button
            className="grid place-content-center h-[50px] lg:h-[62px] rounded-[15px] border-2 border-border_dark text-border_dark text-[16px] lg:text-[18px] font-bold lg:font-semibold no-underline transition-colors duration-200 hover:bg-border_dark hover:text-white"
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
          <button
            className="grid place-content-center h-[50px] lg:h-[62px] rounded-[15px] border-2 border-border_dark text-border_dark text-[16px] lg:text-[18px] font-bold lg:font-semibold no-underline transition-colors duration-200 hover:bg-border_dark hover:text-white"
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
  staticImage: PropTypes.string,
};

// ---------------------------------------------------------------------------
// Professor
// ---------------------------------------------------------------------------
const Prof = ({ navigate }) => {
  const { data: prof, isLoading: loading, error } = useProfessors();

  if (loading)
    return (
      <div className="p-6 text-center w-full">
        <LoadingSpinner variant="block" message="Loading professor data..." />
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600 w-full">
        Error loading professor data: {error.message}
      </div>
    );
  if (!prof)
    return (
      <div className="p-6 text-center text-text_black_secondary w-full">
        Professor data is not available at the moment.
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-10 py-[30px] lg:py-[100px] px-[25px] lg:px-[70px] w-full items-center lg:items-start">
      {/* Professor image */}
      <img
        src={prof.img || "/img/placeholder.png"}
        alt={prof.name}
        className="w-[260px] h-[300px] lg:w-[292px] lg:h-[382px] rounded-[30px] object-cover mx-auto lg:mx-0 shrink-0"
      />

      {/* Text + buttons */}
      <div className="flex flex-col gap-[30px] lg:justify-between w-full">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-[15px] leading-[18px] lg:text-xl font-semibold lg:font-bold text-primary_main">
            {prof.role}
          </h2>
          <h1 className="text-[48px] leading-[48px] lg:text-[32px] lg:leading-[41px] font-semibold lg:font-bold font-display text-text_black_primary">
            {prof.name}
          </h1>
          <p className="text-sm lg:text-lg text-text_black_secondary lg:max-w-[660px]">
            {prof.desc}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-[10px] font-semibold text-[16px] lg:text-[18px]">
          <button
            onClick={() => navigate("/prof")}
            className="grid place-content-center h-[50px] lg:h-[60px] rounded-[15px] w-full lg:w-auto lg:px-10 bg-primary_main text-white no-underline cursor-pointer transition-colors duration-200 hover:opacity-90"
          >
            CV
          </button>
          <HashLink
            className="grid place-content-center h-[50px] lg:h-[60px] rounded-[15px] w-full lg:w-auto lg:px-10 border-2 border-primary_main text-primary_main no-underline transition-colors duration-200 hover:bg-primary_main hover:text-white"
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

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------
const Members = ({ sectionTitle }) => {
  const { data: members = [], isLoading: loading, error } = useTeamMembers(true);

  if (loading)
    return (
      <div className="px-[25px] lg:px-[70px] py-10 text-center w-full">
        <LoadingSpinner variant="block" message="Loading team members..." />
      </div>
    );
  if (error)
    return (
      <div className="px-[25px] lg:px-[70px] py-10 text-center text-red-600 w-full">
        Error loading team members: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-[15px] lg:gap-[38px] py-[30px] lg:py-[50px] w-full shrink-0">
      <div className="px-[25px] lg:px-[70px]">
        <h2 className="text-[48px] leading-[46px] lg:text-[80px] lg:leading-[102px] font-semibold lg:font-light font-display text-text_black_primary">
          {sectionTitle}
        </h2>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex flex-row gap-[10px] lg:gap-5 px-[25px] lg:px-[70px] w-full overflow-x-auto no-scrollbar pb-2">
        {members.length === 0 && !loading && (
          <div className="py-10 text-center text-text_black_secondary w-full">
            No current team members found.
          </div>
        )}
        {members.map((member) => (
          <div key={member._id} className="flex flex-col gap-2 lg:gap-[14px] shrink-0">
            <img
              className="w-[160px] h-[260px] lg:w-[200px] lg:h-[275px] rounded-[20px] object-cover object-top"
              src={member.img || "/img/placeholder.png"}
              alt={member.name}
            />
            <div className="flex flex-col w-[160px] lg:w-[200px]">
              <h2
                className="text-[16px] leading-[19px] lg:text-2xl lg:leading-[29px] font-bold text-text_black_primary truncate"
                title={member.name}
              >
                {member.name}
              </h2>
              <h3
                className="text-[12px] leading-[14px] lg:text-lg text-text_black_primary truncate"
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
                  <LinkedIn className="text-text_black_primary hover:text-blue-600 size-5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Past Members */}
      <div className="px-[25px] lg:px-[70px]">
        <HashLink
          className="flex justify-center items-center gap-[10px] text-[18px] font-semibold text-primary_main no-underline rounded-[15px] h-12 border-2 border-transparent hover:border-primary_main transition-all duration-200"
          to="/team#alumni"
        >
          <span>View Past Members</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};
Members.propTypes = { sectionTitle: PropTypes.string.isRequired };

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const Projects = ({ sectionTitle, sectionDescription }) => {
  const { data: projects = [], isLoading: loading, error } = useProjects("current");
  const navigate = useNavigate();

  const handleLearnMore = (projectLink, projectId) => {
    if (projectLink) window.open(projectLink, "_blank", "noopener,noreferrer");
    else if (projectId) console.log("No direct link, project ID:", projectId);
  };

  if (loading)
    return (
      <div className="px-[25px] lg:px-[70px] bg-text_black_primary py-10 text-center w-full">
        <LoadingSpinner variant="block" message="Loading projects..." />
      </div>
    );
  if (error)
    return (
      <div className="px-[25px] lg:px-[70px] bg-text_black_primary py-10 text-center text-red-400 w-full">
        Error loading projects: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 lg:gap-[35px] bg-text_black_primary py-[60px] px-[25px] lg:p-[70px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:gap-6">
        <h2 className="text-[48px] leading-[48px] lg:text-[80px] lg:leading-[102px] font-semibold lg:font-light font-display text-text_white_primary">
          {sectionTitle}
        </h2>
        <p className="text-[12px] leading-[14px] lg:text-lg text-text_white_secondary text-justify lg:text-left lg:max-w-2xl">
          {sectionDescription}
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col lg:flex-col gap-4 lg:gap-6">
        {projects.length === 0 && !loading && (
          <div className="py-10 text-center text-gray-400 w-full">
            No current projects found.
          </div>
        )}
        {projects.map((project) => (
          <div
            key={project._id}
            className="relative w-full rounded-[15px] lg:rounded-[20px] border border-[#282828f2] lg:border-0 overflow-hidden lg:h-[345px]"
          >
            {/* Image — stacked on mobile, fills card on desktop */}
            <img
              className="w-full h-[240px] lg:h-full object-cover rounded-t-[15px] lg:rounded-[20px] lg:absolute lg:inset-0"
              src={project.image || "/img/placeholder.png"}
              alt={project.title || "Project image"}
            />

            {/* Desktop gradient overlay */}
            <div className="hidden lg:block absolute inset-0 rounded-[20px]" style={{ background: "linear-gradient(180deg, rgba(50,50,50,0) 0%, #323232 100%)" }} />

            {/* Content — below image on mobile, overlaid at bottom on desktop */}
            <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-5 lg:p-8 flex flex-col gap-1">
              <h3 className="text-[16px] lg:text-[24px] lg:leading-[31px] font-bold font-display text-[#E6E6E6]">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="text-[14px] lg:text-lg text-[#E6E6E6] lg:text-text_white_secondary">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Learn More — mobile only */}
            <div className="flex justify-end px-5 pb-5 lg:hidden">
              <button
                onClick={() => handleLearnMore(project.link, project._id)}
                className="px-4 py-2 border-2 border-primary_main rounded-[5px] text-primary_main text-[14px] font-semibold hover:bg-primary_main hover:text-text_black_primary transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-2">
        <HashLink
          className="hidden lg:flex justify-center items-center gap-[10px] border-2 border-primary_main rounded-[15px] h-[50px] lg:h-[50px] lg:px-10 font-semibold text-[16px] lg:text-[18px] text-primary_main hover:bg-primary_main hover:text-text_black_primary transition-colors duration-200 no-underline"
          to="/projects"
        >
          <span>Current Projects</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-primary_main rounded-[15px] h-[50px] lg:px-10 font-semibold text-[16px] lg:text-[18px] text-primary_main hover:bg-primary_main hover:text-text_black_primary transition-colors duration-200 no-underline"
          to="/projects#completed"
        >
          <span>Completed Projects</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};
Projects.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  sectionDescription: PropTypes.string.isRequired,
};

// ---------------------------------------------------------------------------
// Journal accent colors (cycle per card)
// ---------------------------------------------------------------------------
const JOURNAL_AUTHOR_COLORS = [
  "#08DBE9",
  "#F34D4D",
  "#476BE8",
  "#AF3BE7",
  "#2BC04C",
  "#6E95E0",
  "#EA37CE",
];

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------
const Journal = ({ sectionTitle }) => {
  const { data: list = [], isLoading: loading, error } = usePublications("journal");

  if (loading)
    return (
      <div className="px-[25px] lg:px-[70px] bg-primary_main py-10 text-center w-full">
        <LoadingSpinner variant="block" message="Loading publications..." />
      </div>
    );
  if (error)
    return (
      <div className="px-[25px] lg:px-[70px] bg-primary_main py-10 text-center text-red-300 w-full">
        Error loading publications: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 lg:gap-[70px] bg-primary_main py-[60px] lg:pt-[120px] lg:pb-[80px] w-full">
      <div className="px-[25px] lg:px-[70px]">
        <h2 className="text-[48px] leading-[48px] lg:text-[80px] lg:leading-[72px] font-semibold lg:font-light font-display text-text_black_primary">
          {sectionTitle}
        </h2>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-2">
        <div className="w-[15px] lg:w-[70px] shrink-0" />
        {list.length === 0 && !loading && (
          <div className="py-10 text-center text-text_black_secondary w-full">
            No publications found.
          </div>
        )}
        {list.map((paper, idx) => {
          const accentColor = JOURNAL_AUTHOR_COLORS[idx % JOURNAL_AUTHOR_COLORS.length];
          return (
            <div
              key={paper._id}
              className="flex flex-col justify-between bg-text_black_primary rounded-[20px] w-[310px] lg:w-[400px] h-[240px] lg:h-[300px] p-5 shrink-0"
            >
              <a
                href={paper.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] leading-[17px] lg:text-xl text-text_white_primary underline break-words font-medium"
                title={paper.title}
              >
                {truncateText(paper.title, 130)}
              </a>
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col text-[14px] lg:text-sm lg:font-semibold truncate" style={{ color: accentColor }}>
                  {(Array.isArray(paper.authors)
                    ? paper.authors
                    : JSON.parse(paper.authors || "[]")
                  ).map((author, i) => (
                    <span key={i} className="truncate">
                      {author}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {paper.year && (
                    <div className="text-[16px] lg:text-xl text-text_white_tertiary font-display">
                      {paper.year}
                    </div>
                  )}
                  {paper.venue && (
                    <div className="text-[16px] lg:text-xl font-bold font-display text-text_white_primary truncate max-w-[120px] lg:max-w-[180px]">
                      {paper.venue}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="w-[15px] lg:w-[70px] shrink-0" />
      </div>

      {/* CTAs */}
      <div className="px-[25px] lg:px-[70px]">
        {/* Mobile CTA */}
        <HashLink
          className="flex lg:hidden justify-center items-center gap-[10px] border-2 border-text_black_primary rounded-[15px] w-full h-[50px] font-semibold text-[16px] text-text_black_primary hover:bg-text_black_primary hover:text-primary_main transition-colors duration-200 no-underline"
          to="/publications#journal"
        >
          <span>All Journal Papers</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
        {/* Desktop CTA */}
        <HashLink
          className="hidden lg:inline-flex items-center gap-[10px] font-semibold text-[18px] text-text_white_primary no-underline hover:underline"
          to="/publications#journal"
        >
          <span>View All Journals</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};
Journal.propTypes = { sectionTitle: PropTypes.string.isRequired };

// ---------------------------------------------------------------------------
// Conference card color palettes (cycle per card)
// ---------------------------------------------------------------------------
const CONF_BG_COLORS = ["#C1EDFF", "#FFE5E5", "#C8FBFF", "#EDC8FF", "#C8FFD4", "#E0FFC8"];
const CONF_AUTHOR_COLORS = ["#10719A", "#F34D4D", "#03ADBB", "#AF3BE7", "#2BC04C", "#6BB92F"];

// ---------------------------------------------------------------------------
// Conference
// ---------------------------------------------------------------------------
const Conference = ({ sectionTitle }) => {
  const { data: list = [], isLoading: loading, error } = usePublications("conference");

  if (loading)
    return (
      <div className="px-[25px] lg:px-[70px] py-10 text-center w-full">
        <LoadingSpinner variant="block" message="Loading conference papers..." />
      </div>
    );
  if (error)
    return (
      <div className="px-[25px] lg:px-[70px] py-10 text-center text-red-600 w-full">
        Error loading conference papers: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 lg:gap-[70px] py-[60px] lg:pt-[90px] lg:pb-[120px] w-full">
      <h2 className="flex justify-between items-end px-[25px] lg:px-[70px] text-[48px] leading-[48px] lg:text-[80px] lg:leading-[72px] font-semibold lg:font-light font-display text-text_black_primary">
        <span>{sectionTitle}</span>
        <Down_left_dark_arrow className="size-12 lg:size-14" />
      </h2>

      {/* Horizontal scroll cards */}
      <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-2">
        <div className="w-[15px] lg:w-[70px] shrink-0" />
        {list.length === 0 && !loading && (
          <div className="py-10 text-center text-text_black_secondary w-full">
            No conference papers found.
          </div>
        )}
        {list.map((item, idx) => {
          const bgColor = CONF_BG_COLORS[idx % CONF_BG_COLORS.length];
          const authorColor = CONF_AUTHOR_COLORS[idx % CONF_AUTHOR_COLORS.length];
          return (
            <div
              key={item._id}
              className="flex flex-col justify-between rounded-[20px] w-[320px] lg:w-[400px] h-[240px] lg:h-[300px] p-5 shrink-0"
              style={{ backgroundColor: bgColor }}
            >
              <a
                href={item.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] leading-[19px] lg:text-xl text-text_black_primary underline break-words font-medium"
                title={item.title}
              >
                {truncateText(item.title, 130)}
              </a>
              <div className="flex justify-between items-end mt-4">
                <div
                  className="flex flex-col text-[14px] lg:text-sm font-bold lg:font-semibold truncate"
                  style={{ color: authorColor }}
                >
                  {(Array.isArray(item.authors)
                    ? item.authors
                    : JSON.parse(item.authors || "[]")
                  ).map((author, i) => (
                    <span key={i} className="truncate">
                      {author}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {item.year && (
                    <div className="text-xl font-display text-text_black_primary">{item.year}</div>
                  )}
                  {item.venue && (
                    <div className="text-[16px] lg:text-xl font-bold font-display text-text_black_primary truncate max-w-[120px] lg:max-w-[180px]">
                      {item.venue}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="w-[15px] lg:w-[70px] shrink-0" />
      </div>

      {/* CTAs */}
      <div className="px-[25px] lg:px-[70px]">
        {/* Mobile CTA */}
        <HashLink
          className="flex lg:hidden justify-center items-center gap-[10px] border-2 border-primary_main rounded-[15px] w-full h-[50px] font-semibold text-[16px] text-primary_main hover:bg-primary_main hover:text-white transition-colors duration-200 no-underline"
          to="/publications#conference"
        >
          <span>All Conference Papers</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
        {/* Desktop CTA */}
        <HashLink
          className="hidden lg:inline-flex items-center gap-[10px] font-semibold text-[18px] text-primary_main no-underline hover:underline"
          to="/publications#conference"
        >
          <span>View All Conferences</span>
          <Up_right_neutral_arrow className="size-5" alt="arrow icon" />
        </HashLink>
      </div>
    </div>
  );
};
Conference.propTypes = { sectionTitle: PropTypes.string.isRequired };

export default Home;
