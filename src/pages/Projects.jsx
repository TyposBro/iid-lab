/* eslint-disable react/prop-types */ // Or define PropTypes rigorously
import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import PropTypes from "prop-types";
import { Down_left_dark_arrow, Down_straight_neutral_arrow } from "@/assets/";
import { LoadingSpinner, AdminMetaControls } from "@/components/"; // Added AdminMetaControls
import { ProjectCard } from "@/components/ProjectCard";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";

// Main Projects Page Component
export const Projects = () => {
  const { isAdmin } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  // --- Overall Projects Page Meta ---
  const [projectsPageMeta, setProjectsPageMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshPageMetaKey, setRefreshPageMetaKey] = useState(0);

  const defaultProjectsPageMeta = useMemo(
    () => ({
      title: "",
      description: "",
    }),
    []
  );

  const fetchProjectsPageMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/projects`); // e.g., /meta/projects-main
      if (!response.ok) {
        if (response.status === 404) {
          setProjectsPageMeta(defaultProjectsPageMeta);
          document.title = defaultProjectsPageMeta.title + " - I&I Design Lab";
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setProjectsPageMeta(data);
        document.title = (data.title || defaultProjectsPageMeta.title) + " - I&I Design Lab";
      }
    } catch (err) {
      setMetaError(err.message);
      setProjectsPageMeta(defaultProjectsPageMeta);
      document.title = defaultProjectsPageMeta.title + " - I&I Design Lab";
      console.error("Failed to fetch projects page meta:", err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultProjectsPageMeta]);

  useEffect(() => {
    fetchProjectsPageMeta();
  }, [fetchProjectsPageMeta, refreshPageMetaKey]);
  const handleProjectsPageMetaUpdated = () => setRefreshPageMetaKey((prev) => prev + 1);

  const refetchAllProjects = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const currentPageTitle = projectsPageMeta?.title || defaultProjectsPageMeta.title;
  const currentPageDescription =
    projectsPageMeta?.description || defaultProjectsPageMeta.description;

  return (
    <div className="flex flex-col justify-start items-center pt-16 md:pt-[95px] w-full">
      {/* Overall Projects Page Meta Controls */}
      {isAdmin && projectsPageMeta && (
        <AdminMetaControls
          pageIdentifier="projects" // For the main projects page meta
          initialData={projectsPageMeta}
          fieldsConfig={[
            { name: "title", label: "Projects Page Title (Document Title & Header)", type: "text" },
            { name: "description", label: "Projects Page Main Introduction", type: "textarea" },
          ]}
          onUpdateSuccess={handleProjectsPageMetaUpdated}
          containerClass="w-full max-w-screen-xl mx-auto px-4 md:px-[25px] py-2 bg-gray-50 rounded-b-lg shadow mb-6"
        />
      )}
      {metaLoading && (
        <div className="text-center py-6">
          <LoadingSpinner message="Loading page details..." />
        </div>
      )}
      {metaError && (
        <div className="text-red-500 text-center p-4">Error loading page details: {metaError}</div>
      )}

      {/* Intro Section - Now driven by meta */}
      {(!metaLoading || projectsPageMeta) && (
        <div className="flex flex-col gap-[10px] px-4 md:px-[25px] py-8 w-full max-w-screen-xl mx-auto">
          <h1 className="font-bold text-5xl md:text-[48px] text-black leading-tight md:leading-[48px]">
            {currentPageTitle}
          </h1>
          {currentPageDescription && (
            <div className="border-text_black_secondary text-sm md:text-[12px] max-w-prose">
              {currentPageDescription}
            </div>
          )}
        </div>
      )}

      {/* Admin controls for individual project items */}
      {isAdmin && <AdminProjectControls onProjectsUpdated={refetchAllProjects} />}

      {/* Sections will have their own meta controls below */}
      <Current refreshKey={refreshKey} />
      <Completed refreshKey={refreshKey} />
      <Awards refreshKey={refreshKey} />
    </div>
  );
};

export default Projects;

// --- Current Projects Section ---
const Current = ({ refreshKey }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAdmin(); // Get admin status

  // Meta for Current Projects Section
  const [currentProjectsMeta, setCurrentProjectsMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultCurrentProjectsMeta = useMemo(
    () => ({
      title: "",
      description: "", // Optional description
    }),
    []
  );

  const fetchCurrentProjectsMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/projects-current`);
      if (!response.ok) {
        if (response.status === 404) {
          setCurrentProjectsMeta(defaultCurrentProjectsMeta);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setCurrentProjectsMeta(await response.json());
      }
    } catch (err) {
      setMetaError(err.message);
      setCurrentProjectsMeta(defaultCurrentProjectsMeta);
      console.error("Failed to fetch current projects meta:", err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultCurrentProjectsMeta]);

  useEffect(() => {
    fetchCurrentProjectsMeta();
  }, [fetchCurrentProjectsMeta, refreshMetaKey]);
  const handleCurrentProjectsMetaUpdated = () => setRefreshMetaKey((prev) => prev + 1);

  const fetchCurrentProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/current`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setProjects(await response.json());
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch current projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentProjects();
  }, [fetchCurrentProjects, refreshKey]);

  const sectionTitle = currentProjectsMeta?.title || defaultCurrentProjectsMeta.title;
  const sectionDescription = currentProjectsMeta?.description; // Optional

  return (
    <div className="flex flex-col gap-6 md:gap-[30px] px-4 md:px-[25px] py-6 md:py-[30px] w-full max-w-screen-xl mx-auto">
      {isAdmin && currentProjectsMeta && (
        <AdminMetaControls
          pageIdentifier="projects-current"
          initialData={currentProjectsMeta}
          fieldsConfig={[
            { name: "title", label: "Current Projects Section Title", type: "text" },
            {
              name: "description",
              label: "Current Projects Section Intro (Optional)",
              type: "textarea",
            },
          ]}
          onUpdateSuccess={handleCurrentProjectsMetaUpdated}
          containerClass="py-2 bg-gray-100 rounded-lg shadow my-4"
        />
      )}
      {metaLoading && (
        <div className="text-center py-4">
          <LoadingSpinner message="Loading section details..." />
        </div>
      )}
      {metaError && <div className="text-red-500 text-center p-4">Error: {metaError}</div>}

      {(!metaLoading || currentProjectsMeta) && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-light text-4xl md:text-[48px] text-text_black_primary leading-tight md:leading-[48px]">
              {sectionTitle}
            </h2>
            <Down_left_dark_arrow className="size-12 md:size-[58px]" />
          </div>
          {sectionDescription && (
            <p className="text-sm text-text_black_secondary max-w-2xl">{sectionDescription}</p>
          )}
        </>
      )}

      {loading && (
        <div className="text-center p-4">
          <LoadingSpinner message="Loading Current Projects..." />
        </div>
      )}
      {error && <div className="text-center p-4 text-red-600">Error: {error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center p-4 text-gray-500">No current projects found.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {!loading &&
          !error &&
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              imageSrc={project.image || "/img/placeholder.png"}
              title={project.title}
              subtitle={project.subtitle}
              link={project.link}
              buttonText="Learn More"
              cardBgColor="bg-transparent"
              borderColor="border-[#D9D9D9]"
              primaryTextColor="text_black_secondary"
              secondaryTextColor="text_black_secondary"
              buttonBorderColor="border-primary_main"
              buttonTextColor="text-primary_main"
              imageHeight="h-52"
            />
          ))}
      </div>
    </div>
  );
};
Current.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

// --- Completed Projects Section ---
const Completed = ({ refreshKey }) => {
  const [allCompleted, setAllCompleted] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("Recent");
  const [availableYears, setAvailableYears] = useState([]);
  const { isAdmin } = useAdmin();

  // Meta for Completed Projects Section
  const [completedProjectsMeta, setCompletedProjectsMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultCompletedProjectsMeta = useMemo(
    () => ({
      title: "",
      description: "", // Optional
    }),
    []
  );

  const fetchCompletedProjectsMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/projects-completed`);
      if (!response.ok) {
        if (response.status === 404) {
          setCompletedProjectsMeta(defaultCompletedProjectsMeta);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setCompletedProjectsMeta(await response.json());
      }
    } catch (err) {
      setMetaError(err.message);
      setCompletedProjectsMeta(defaultCompletedProjectsMeta);
      console.error("Failed to fetch completed projects meta:", err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultCompletedProjectsMeta]);

  useEffect(() => {
    fetchCompletedProjectsMeta();
  }, [fetchCompletedProjectsMeta, refreshMetaKey]);
  const handleCompletedProjectsMetaUpdated = () => setRefreshMetaKey((prev) => prev + 1);

  const fetchCompletedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/completed`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAllCompleted(data);
      const years = ["Recent", ...new Set(data.map((p) => p.year).filter(Boolean))].sort((a, b) => {
        if (a === "Recent") return -1;
        if (b === "Recent") return 1;
        return b - a;
      });
      setAvailableYears(years);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch completed projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompletedProjects();
  }, [fetchCompletedProjects, refreshKey]);

  useEffect(() => {
    if (selectedYear === "Recent") setFilteredProjects(allCompleted);
    else setFilteredProjects(allCompleted.filter((p) => p.year?.toString() === selectedYear));
  }, [allCompleted, selectedYear]);

  const handleYearFilter = (year) => setSelectedYear(year.toString());

  const sectionTitle = completedProjectsMeta?.title || defaultCompletedProjectsMeta.title;
  const sectionDescription = completedProjectsMeta?.description; // Optional

  return (
    <div
      className="flex flex-col gap-6 md:gap-[30px] bg-text_black_primary py-6 md:py-[30px] w-full"
      id="completed"
    >
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
        {" "}
        {/* Added max-width & w-full */}
        {isAdmin && completedProjectsMeta && (
          <AdminMetaControls
            pageIdentifier="projects-completed"
            initialData={completedProjectsMeta}
            fieldsConfig={[
              { name: "title", label: "Completed Projects Section Title", type: "text" },
              {
                name: "description",
                label: "Completed Projects Section Intro (Optional)",
                type: "textarea",
              },
            ]}
            onUpdateSuccess={handleCompletedProjectsMetaUpdated}
            containerClass="py-2 bg-gray-700 text-white rounded-lg shadow my-4" // Adjusted bg for dark section
          />
        )}
        {metaLoading && (
          <div className="text-center py-4 text-white">
            <LoadingSpinner message="Loading section details..." />
          </div>
        )}
        {metaError && <div className="text-red-400 text-center p-4">Error: {metaError}</div>}
        {(!metaLoading || completedProjectsMeta) && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="font-extralight text-4xl md:text-[48px] text-white leading-tight md:leading-[50px]">
                {sectionTitle}
              </h2>
              <Down_straight_neutral_arrow className="text-text_white_primary -rotate-45 size-12 md:size-[56px]" />
            </div>
            {sectionDescription && (
              <p className="text-sm text-gray-300 max-w-2xl">{sectionDescription}</p>
            )}
          </>
        )}
        {availableYears.length > 1 && (
          <div className="flex gap-2 md:gap-[12px] font-medium text-xs md:text-base text-white overflow-x-auto pb-2 no-scrollbar">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearFilter(year)}
                className={`border-2 px-6 py-2 md:px-8 md:py-3 rounded-full whitespace-nowrap transition-colors ${
                  selectedYear === year.toString()
                    ? "bg-white text-text_black_primary border-white"
                    : "border-white text-white hover:bg-gray-700"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center p-4 text-white">
          <LoadingSpinner message="Loading Completed Projects..." />
        </div>
      )}
      {error && <div className="text-center p-4 text-red-400">Error: {error}</div>}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="text-center p-4 text-gray-400 px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
          No completed projects found{selectedYear !== "Recent" ? ` for ${selectedYear}` : ""}.
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <div className="px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
          {" "}
          {/* Added container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                imageSrc={project.image || "/img/placeholder.png"}
                title={project.title}
                subtitle={project.subtitle}
                projectYear={project.year}
                link={project.link}
                buttonText="View Details"
                cardBgColor="bg-transparent"
                borderColor="border-[#282828]"
                primaryTextColor="text-background_light"
                secondaryTextColor="text-background_light"
                buttonBorderColor="border-white"
                buttonTextColor="text-white"
                imageHeight="h-52"
              />
            ))}
          </div>
          {/* Consider if "View All" button is needed if pagination/full list page exists */}
          {/* <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-semibold text-base md:text-[18px] text-text_white_primary hover:bg-gray-700 transition-colors duration-200 mt-6 mx-auto px-6">
            <span>View All Completed Projects</span>
            <Up_right_neutral_arrow alt="up right light arrow icon" />
          </button> */}
        </div>
      )}
    </div>
  );
};
Completed.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

// --- Awards Section ---
const Awards = ({ refreshKey }) => {
  const [allAwards, setAllAwards] = useState([]);
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [availableFilters, setAvailableFilters] = useState(["All"]);
  const { isAdmin } = useAdmin();

  // Meta for Awards Section
  const [awardsMeta, setAwardsMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultAwardsMeta = useMemo(
    () => ({
      title: "",
      description: "", // Optional
    }),
    []
  );

  const fetchAwardsMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/projects-awards`);
      if (!response.ok) {
        if (response.status === 404) {
          setAwardsMeta(defaultAwardsMeta);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setAwardsMeta(await response.json());
      }
    } catch (err) {
      setMetaError(err.message);
      setAwardsMeta(defaultAwardsMeta);
      console.error("Failed to fetch awards meta:", err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultAwardsMeta]);

  useEffect(() => {
    fetchAwardsMeta();
  }, [fetchAwardsMeta, refreshMetaKey]);
  const handleAwardsMetaUpdated = () => setRefreshMetaKey((prev) => prev + 1);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/award`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAllAwards(data);
      const filters = new Set(["All"]);
      data.forEach((award) => {
        if (award.awardName?.toLowerCase().includes("reddot")) filters.add("Reddot");
        else if (award.awardName?.toLowerCase().includes("if")) filters.add("iF");
        else if (award.awardName) filters.add("Others");
      });
      setAvailableFilters([...filters]);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch awards:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards, refreshKey]);

  useEffect(() => {
    if (selectedFilter === "All") setFilteredAwards(allAwards);
    else if (selectedFilter === "Reddot")
      setFilteredAwards(allAwards.filter((a) => a.awardName?.toLowerCase().includes("reddot")));
    else if (selectedFilter === "iF")
      setFilteredAwards(allAwards.filter((a) => a.awardName?.toLowerCase().includes("if")));
    else if (selectedFilter === "Others")
      setFilteredAwards(
        allAwards.filter(
          (a) =>
            a.awardName &&
            !a.awardName.toLowerCase().includes("reddot") &&
            !a.awardName.toLowerCase().includes("if")
        )
      );
    else setFilteredAwards(allAwards);
  }, [allAwards, selectedFilter]);

  const handleFilter = (filter) => setSelectedFilter(filter);

  const sectionTitle = awardsMeta?.title || defaultAwardsMeta.title;
  const sectionDescription = awardsMeta?.description; // Optional

  return (
    <div className="flex flex-col gap-6 md:gap-[30px] bg-primary_main py-6 md:py-[30px] w-full">
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
        {" "}
        {/* Added max-width & w-full */}
        {isAdmin && awardsMeta && (
          <AdminMetaControls
            pageIdentifier="projects-awards"
            initialData={awardsMeta}
            fieldsConfig={[
              { name: "title", label: "Awards Section Title", type: "text" },
              { name: "description", label: "Awards Section Intro (Optional)", type: "textarea" },
            ]}
            onUpdateSuccess={handleAwardsMetaUpdated}
            containerClass="py-2 bg-blue-200 text-black rounded-lg shadow my-4" // Adjusted bg for primary_main section
          />
        )}
        {metaLoading && (
          <div className="text-center py-4 text-black">
            <LoadingSpinner message="Loading section details..." />
          </div>
        )}
        {metaError && <div className="text-red-700 text-center p-4">Error: {metaError}</div>}
        {(!metaLoading || awardsMeta) && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="font-light text-4xl md:text-[48px] leading-tight md:leading-[48px] text-black">
                {sectionTitle}
              </h2>
              <Down_straight_neutral_arrow className="rotate-45 size-10 md:size-[46px] text-black" />
            </div>
            {sectionDescription && (
              <p className="text-sm text-gray-800 max-w-2xl">{sectionDescription}</p>
            )}
          </>
        )}
        {availableFilters.length > 1 && (
          <div className="flex gap-2 md:gap-[12px] font-medium text-xs md:text-base overflow-x-auto pb-2 no-scrollbar">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilter(filter)}
                className={`border-2 px-6 py-2 md:px-8 md:py-3 rounded-full whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? "bg-black text-white border-black"
                    : "border-black text-black hover:bg-gray-800 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center p-4 text-black">
          <LoadingSpinner message="Loading Awards..." />
        </div>
      )}
      {error && <div className="text-center p-4 text-red-700">Error: {error}</div>}
      {!loading && !error && filteredAwards.length === 0 && (
        <div className="text-center p-4 text-gray-700 px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
          No awards found{selectedFilter !== "All" ? ` for ${selectedFilter}` : ""}.
        </div>
      )}

      {!loading && !error && filteredAwards.length > 0 && (
        <div className="max-w-screen-xl mx-auto w-full">
          {" "}
          {/* Added container */}
          <div className="flex gap-4 md:gap-[6px] px-4 md:px-[25px] w-full overflow-x-auto no-scrollbar pb-4">
            {filteredAwards.map((award) => (
              <ProjectCard
                key={award._id}
                imageSrc={award.image || "/img/placeholder.png"}
                awardName={award.awardName}
                title={award.title}
                projectYear={award.year}
                projectAuthors={award.authors}
                link={award.link}
                buttonText="Details"
                cardBgColor="bg-white"
                borderColor="border-gray-200"
                primaryTextColor="text-text_black_primary"
                secondaryTextColor="text-text_black_primary"
                buttonBorderColor="border-primary_main"
                buttonTextColor="text-primary_main"
                imageHeight="h-64"
                customClasses="w-[280px] md:w-[300px] shrink-0"
              />
            ))}
          </div>
          {/* <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-bold text-base md:text-lg text-black hover:bg-blue-100 transition-colors duration-200 mt-6 mx-auto px-6">
            <span>View All Awards</span>
            <Up_right_neutral_arrow alt="up right neutral arrow icon" className="text-black" />
          </button> */}
        </div>
      )}
    </div>
  );
};
Awards.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

// --- Admin UI Component for Projects ---
const AdminProjectControls = ({ onProjectsUpdated }) => {
  const { adminToken } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("current");
  const [year, setYear] = useState("");
  const [authors, setAuthors] = useState(""); // Storing as a string for input
  const [awardName, setAwardName] = useState("");
  const [tags, setTags] = useState(""); // Storing as a string for input
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // For preview and keeping existing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const fetchAllAdminProjects = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects`); // GET all projects
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setProjects(
        data.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
        )
      ); // Sort by most recent
    } catch (error) {
      console.error("Error fetching projects for admin:", error);
      setListError(error.message);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAdminProjects();
  }, [fetchAllAdminProjects, onProjectsUpdated]); // Re-fetch when onProjectsUpdated changes

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setLink("");
    setStatus("current");
    setYear("");
    setAuthors("");
    setAwardName("");
    setTags("");
    setSelectedFile(null);
    setCurrentImageUrl(null);
    setEditingProject(null);
    setIsCreating(false);
    setIsEditing(false);
    setSubmitError(null);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCurrentImageUrl(e.target.result); // Show preview of new file
      reader.readAsDataURL(file);
    } else {
      // If file selection is cleared
      setSelectedFile(null);
      // Revert to original image if editing, or null if creating
      setCurrentImageUrl(editingProject?.image || null);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null; // No file to upload
    const formData = new FormData();
    formData.append("images", file); // Ensure your backend /upload endpoint expects "images"
    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || `Image upload failed: ${uploadResponse.status}`);
      }
      const uploadedUrls = await uploadResponse.json();
      return uploadedUrls[0] || null; // Assuming it returns an array with one URL
    } catch (error) {
      console.error("Image upload error:", error);
      setSubmitError(`Image Upload Failed: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    if (!title || !status) {
      setSubmitError("Title and Status are required.");
      return;
    }
    if ((status === "award" || status === "completed") && !year) {
      setSubmitError("Year is required for 'Award' or 'Completed'.");
      return;
    }
    if (status === "award" && !awardName) {
      setSubmitError("Award Name is required for 'Award'.");
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = isEditing ? editingProject?.image || null : null;

    if (selectedFile) {
      // If a new file was selected, upload it
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl === null && selectedFile) {
        // Upload failed but a file was selected
        setIsSubmitting(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (isEditing && currentImageUrl === null && editingProject?.image) {
      // If editing and currentImageUrl is explicitly nulled (meaning user removed it), set to undefined to delete
      finalImageUrl = undefined;
    }

    const projectData = {
      title,
      subtitle,
      description,
      link: link || undefined,
      status,
      year: year ? parseInt(year, 10) : undefined,
      authors: authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean), // Convert to array
      awardName: status === "award" ? awardName : undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean), // Convert to array
      image: finalImageUrl,
    };

    // Remove undefined fields to prevent sending them, especially for image updates
    Object.keys(projectData).forEach(
      (key) => projectData[key] === undefined && delete projectData[key]
    );

    const url = isEditing ? `${BASE_URL}/projects/${editingProject._id}` : `${BASE_URL}/projects`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} project. Status: ${response.status}`
        );
      }
      resetForm();
      onProjectsUpdated(); // Trigger refresh in parent
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} project:`, error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    resetForm(); // Clear previous form state
    setIsEditing(true);
    setIsCreating(false);
    setEditingProject(project);
    setTitle(project.title);
    setSubtitle(project.subtitle || "");
    setDescription(project.description || "");
    setLink(project.link || "");
    setStatus(project.status);
    setYear(project.year?.toString() || "");
    setAuthors(project.authors?.join(", ") || ""); // Join array for input
    setAwardName(project.awardName || "");
    setTags(project.tags?.join(", ") || ""); // Join array for input
    setCurrentImageUrl(project.image || null); // Set for preview
    setSelectedFile(null); // Clear any selected file from previous edit/create
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This will also attempt to delete its image if stored with us."
      )
    ) {
      setDeletingId(id);
      setSubmitError(null);
      try {
        const response = await fetch(`${BASE_URL}/projects/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to delete project. Status: ${response.status}`
          );
        }
        onProjectsUpdated(); // Trigger refresh
        if (editingProject?._id === id) resetForm(); // If currently editing deleted item, reset form
      } catch (error) {
        console.error("Error deleting project:", error);
        setSubmitError(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100";
  const buttonClass =
    "font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50";
  const primaryButtonClass = `bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`;
  const secondaryButtonClass = `bg-gray-200 hover:bg-gray-300 text-gray-700 ${buttonClass}`;
  const dangerButtonClass = `bg-red-600 hover:bg-red-700 text-white ${buttonClass} text-xs px-3 py-1.5`;
  const warningButtonClass = `bg-yellow-500 hover:bg-yellow-600 text-white ${buttonClass} text-xs px-3 py-1.5`;
  const successButtonClass = `bg-green-600 hover:bg-green-700 text-white ${buttonClass}`;

  const projectFormFields = (
    <>
      {submitError && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
          {submitError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${inputClass} bg-white`}
            required
            disabled={isSubmitting}
          >
            <option value="current">Current</option>
            <option value="completed">Completed</option>
            <option value="award">Award</option>
          </select>
        </div>
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>
        {(status === "completed" || status === "award") && (
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year {(status === "completed" || status === "award") && "*"}
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
              required={status === "completed" || status === "award"}
              disabled={isSubmitting}
              placeholder="YYYY"
            />
          </div>
        )}
        {status === "award" && (
          <div>
            <label htmlFor="awardName" className="block text-sm font-medium text-gray-700 mb-1">
              Award Name *
            </label>
            <input
              type="text"
              id="awardName"
              value={awardName}
              onChange={(e) => setAwardName(e.target.value)}
              className={inputClass}
              required={status === "award"}
              disabled={isSubmitting}
              placeholder="e.g., Reddot Design Award"
            />
          </div>
        )}
        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
            Authors (comma-separated)
          </label>
          <input
            type="text"
            id="authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
            placeholder="J. Doe, A. Smith"
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Project Link (URL)
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
            placeholder="healthcare, iot, design"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className={inputClass}
          disabled={isSubmitting}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
          {isEditing && editingProject?.image ? "Replace Image (Optional)" : "Image"}
        </label>
        {currentImageUrl && (
          <div className="my-2 relative w-40 h-32">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded border border-gray-300"
            />
            {isEditing &&
              editingProject?.image && ( // Show remove button only if editing an existing image
                <button
                  type="button"
                  onClick={() => {
                    setCurrentImageUrl(null);
                    setSelectedFile(
                      null
                    ); /* This means image will be removed on update if no new file is selected */
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none focus:outline-none hover:bg-red-600"
                  title="Remove Image"
                  disabled={isSubmitting}
                >
                  {" "}
                  ×{" "}
                </button>
              )}
          </div>
        )}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          disabled={isSubmitting}
        />
      </div>
    </>
  );

  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="p-4 sm:p-6 border border-gray-200 rounded-lg my-8 bg-gray-50 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Admin: Manage Projects
          </h3>
          {!isCreating && !isEditing && (
            <button
              onClick={() => {
                resetForm();
                setIsCreating(true);
              }}
              className={successButtonClass}
              disabled={isSubmitting || deletingId !== null || isLoadingList}
            >
              + Add New Project
            </button>
          )}
        </div>

        {(isSubmitting || deletingId !== null || isLoadingList) && (
          <div className="my-4">
            <LoadingSpinner
              message={
                isLoadingList
                  ? "Loading projects..."
                  : isSubmitting
                  ? isCreating
                    ? "Creating..."
                    : "Updating..."
                  : deletingId
                  ? "Deleting..."
                  : "Processing..."
              }
            />
          </div>
        )}

        {!isCreating && !isEditing && (
          <div className="space-y-3 w-full max-h-96 overflow-y-auto pr-2">
            {listError && (
              <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
                Error loading list: {listError}
              </div>
            )}
            {!isLoadingList &&
              projects.map((project) => (
                <div
                  key={project._id}
                  className="border border-gray-200 rounded-md p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded flex-shrink-0 border"
                      />
                    )}
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold text-gray-800 truncate" title={project.title}>
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {project.status}
                        {project.year ? `, ${project.year}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-end md:self-center mt-2 md:mt-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className={warningButtonClass}
                      disabled={isSubmitting || deletingId !== null || isLoadingList}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className={`${dangerButtonClass} ${
                        deletingId === project._id ? "opacity-50 cursor-wait" : ""
                      }`}
                      disabled={isSubmitting || !!deletingId || isLoadingList}
                    >
                      {deletingId === project._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            {!isLoadingList && !listError && projects.length === 0 && (
              <p className="text-gray-500 italic text-center py-4">
                No projects found. Click &quot;Add New Project&quot; to create one.
              </p>
            )}
          </div>
        )}

        {(isCreating || isEditing) && (
          <div className="p-4 border border-gray-200 rounded-md mt-4 bg-white shadow-md w-full">
            <h4 className="text-lg font-medium mb-4 text-gray-700">
              {isCreating ? "Create New Project" : `Edit Project: ${editingProject?.title}`}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              {projectFormFields}
              <div className="flex gap-4 pt-2">
                <button type="submit" className={primaryButtonClass} disabled={isSubmitting}>
                  {isSubmitting
                    ? isCreating
                      ? "Creating..."
                      : "Updating..."
                    : isCreating
                    ? "Create Project"
                    : "Update Project"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={secondaryButtonClass}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
AdminProjectControls.propTypes = {
  onProjectsUpdated: PropTypes.func.isRequired,
};
