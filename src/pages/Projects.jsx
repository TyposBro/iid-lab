/* eslint-disable react/prop-types */ // Or define PropTypes rigorously
import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react"; // Added Suspense, lazy for code-splitting
import PropTypes from "prop-types";
import { Down_left_dark_arrow, Down_straight_neutral_arrow } from "@/assets/";
import { LoadingSpinner, AdminMetaControls } from "@/components/"; // Added AdminMetaControls
import { ProjectCard } from "@/components/ProjectCard";
import { useAdmin } from "@/contexts/AdminContext";
// Removed BASE_URL import (no longer needed after extracting admin controls)
import {
  useProjectsPageMeta,
  useCurrentProjectsMeta,
  useCompletedProjectsMeta,
  useAwardsProjectsMeta,
  useProjectsList,
} from "@/hooks";

// Main Projects Page Component
const AdminProjectControlsLazy = lazy(() => import("@/components/admin/ProjectsAdminControls"));

export const Projects = () => {
  const { isAdmin } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  // --- Overall Projects Page Meta ---
  const {
    data: projectsPageMeta,
    isLoading: metaLoading,
    error: metaError,
  } = useProjectsPageMeta();
  const defaultProjectsPageMeta = { title: "", description: "" };
  const handleProjectsPageMetaUpdated = () => {
    // invalidate occurs automatically via AdminMetaControls implementation (assumed) or can be triggered externally
  };

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
          <LoadingSpinner variant="block" message="Loading page details..." />
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

      {/* Admin controls for individual project items (lazy loaded) */}
      {isAdmin && (
        <Suspense
          fallback={
            <div className="w-full max-w-screen-xl mx-auto px-4 md:px-[25px] py-4">
              <LoadingSpinner variant="block" message="Loading admin controls..." />
            </div>
          }
        >
          <AdminProjectControlsLazy
            onProjectsUpdated={refetchAllProjects}
            refreshKey={refreshKey}
          />
        </Suspense>
      )}

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
  const { isAdmin } = useAdmin();
  const {
    data: currentProjectsMeta,
    isLoading: metaLoading,
    error: metaError,
  } = useCurrentProjectsMeta();
  const { data: projects = [], isLoading: loading, error } = useProjectsList("current");
  const defaultCurrentProjectsMeta = { title: "", description: "" };
  const sectionTitle = currentProjectsMeta?.title || defaultCurrentProjectsMeta.title;
  const sectionDescription = currentProjectsMeta?.description;

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
          onUpdateSuccess={() => {}} // React Query will auto-refetch
          containerClass="py-2 bg-gray-100 rounded-lg shadow my-4"
        />
      )}
      {metaLoading && (
        <div className="text-center py-4">
          <LoadingSpinner variant="block" message="Loading section details..." />
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
          <LoadingSpinner variant="block" message="Loading Current Projects..." />
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
  const { isAdmin } = useAdmin();
  const {
    data: completedMeta,
    isLoading: metaLoading,
    error: metaError,
  } = useCompletedProjectsMeta();
  const { data: allCompleted = [], isLoading: loading, error } = useProjectsList("completed");
  const [selectedYear, setSelectedYear] = useState("Recent");
  const [availableYears, setAvailableYears] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const defaultCompletedProjectsMeta = { title: "", description: "" };
  useEffect(() => {
    const years = ["Recent", ...new Set(allCompleted.map((p) => p.year).filter(Boolean))].sort(
      (a, b) => {
        if (a === "Recent") return -1;
        if (b === "Recent") return 1;
        return b - a;
      }
    );
    setAvailableYears(years);
  }, [allCompleted]);
  useEffect(() => {
    if (selectedYear === "Recent") setFilteredProjects(allCompleted);
    else setFilteredProjects(allCompleted.filter((p) => p.year?.toString() === selectedYear));
  }, [allCompleted, selectedYear]);
  const handleYearFilter = (year) => setSelectedYear(year.toString());
  const sectionTitle = completedMeta?.title || defaultCompletedProjectsMeta.title;
  const sectionDescription = completedMeta?.description;

  return (
    <div
      className="flex flex-col gap-6 md:gap-[30px] bg-text_black_primary py-6 md:py-[30px] w-full"
      id="completed"
    >
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
        {" "}
        {/* Added max-width & w-full */}
        {isAdmin && completedMeta && (
          <AdminMetaControls
            pageIdentifier="projects-completed"
            initialData={completedMeta}
            fieldsConfig={[
              { name: "title", label: "Completed Projects Section Title", type: "text" },
              {
                name: "description",
                label: "Completed Projects Section Intro (Optional)",
                type: "textarea",
              },
            ]}
            onUpdateSuccess={() => {}} // React Query will auto-refetch
            containerClass="py-2 bg-gray-700 text-white rounded-lg shadow my-4" // Adjusted bg for dark section
          />
        )}
        {metaLoading && (
          <div className="text-center py-4 text-white">
            <LoadingSpinner variant="block" message="Loading section details..." />
          </div>
        )}
        {metaError && <div className="text-red-400 text-center p-4">Error: {metaError}</div>}
        {(!metaLoading || completedMeta) && (
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
          <LoadingSpinner variant="block" message="Loading Completed Projects..." />
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
  const { isAdmin } = useAdmin();
  const { data: awardsMeta, isLoading: metaLoading, error: metaError } = useAwardsProjectsMeta();
  const { data: allAwards = [], isLoading: loading, error } = useProjectsList("award");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [availableFilters, setAvailableFilters] = useState(["All"]);
  const defaultAwardsMeta = { title: "", description: "" };
  useEffect(() => {
    const filters = new Set(["All"]);
    const categoryMap = new Map(); // Map to store category -> awards mapping

    allAwards.forEach((award) => {
      if (award.awardName) {
        // Extract the base award name (before "Award" or other common suffixes)
        let category = award.awardName.trim();

        // Common patterns to extract category
        // e.g., "Reddot Design Award" -> "Reddot"
        // e.g., "iF Design Award" -> "iF"
        // e.g., "Spark Award" -> "Spark"
        const awardLower = category.toLowerCase();

        if (awardLower.includes("reddot")) {
          category = "Reddot";
        } else if (awardLower.includes("if")) {
          category = "iF";
        } else {
          // Extract the first word or meaningful part before "award"
          const words = category.split(/\s+/);
          if (words.length > 0) {
            // Take the first significant word
            category = words[0];
          }
        }

        filters.add(category);

        // Store the mapping
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }
        categoryMap.get(category).push(award);
      }
    });

    setAvailableFilters([...filters]);
    // Store category map for filtering
    setFilteredAwards(allAwards);
  }, [allAwards]);
  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredAwards(allAwards);
    } else {
      // Filter based on the selected category
      setFilteredAwards(
        allAwards.filter((award) => {
          if (!award.awardName) return false;

          const awardLower = award.awardName.toLowerCase();
          const filterLower = selectedFilter.toLowerCase();

          // Check if the award name contains the filter category
          return awardLower.includes(filterLower);
        })
      );
    }
  }, [allAwards, selectedFilter]);
  const handleFilter = (filter) => setSelectedFilter(filter);
  const sectionTitle = awardsMeta?.title || defaultAwardsMeta.title;
  const sectionDescription = awardsMeta?.description;

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
            onUpdateSuccess={() => {}} // React Query will auto-refetch
            containerClass="py-2 bg-blue-200 text-black rounded-lg shadow my-4" // Adjusted bg for primary_main section
          />
        )}
        {metaLoading && (
          <div className="text-center py-4 text-black">
            <LoadingSpinner variant="block" message="Loading section details..." />
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
          <LoadingSpinner variant="block" message="Loading Awards..." />
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

// Admin project controls moved to components/admin/ProjectsAdminControls.jsx (lazy loaded)
