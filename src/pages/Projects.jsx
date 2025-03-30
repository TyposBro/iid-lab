/* eslint-disable react/prop-types */ // Or define PropTypes rigorously
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Down_left_dark_arrow,
  Down_straight_neutral_arrow,
  Up_right_neutral_arrow,
} from "@/assets/"; // Adjust path if needed
import { Card, GoTo, LoadingSpinner } from "@/components/"; // Adjust path if needed
import { useAdmin } from "@/contexts/AdminContext"; // Adjust path if needed
import { BASE_URL } from "@/config/api"; // Adjust path if needed
import { useNavigate } from "react-router";

// Main Projects Page Component
export const Projects = () => {
  const { isAdmin } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger refetch in children

  // Function to trigger refetch in all child components
  const refetchAllProjects = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="flex flex-col justify-start items-center pt-16 md:pt-[95px] w-full min-h-dvh overflow-y-scroll no-scrollbar">
      {/* Intro Section */}
      <div className="flex flex-col gap-[10px] px-4 md:px-[25px] py-8 w-full">
        <h2 className="font-bold text-5xl md:text-[48px] text-black leading-tight md:leading-[48px]">
          Projects
        </h2>
        <div className="border-text_black_secondary text-sm md:text-[12px] max-w-prose">
          We create innovative design concepts using systematic, human-centered methods and develop
          them into products and services through engineering design. Our focus is on elderly care,
          rehabilitation, healthcare, and safety, collaborating with experts in medicine,
          geriatrics, physical therapy, materials, and production.
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <AdminProjectControls
          onProjectsUpdated={refetchAllProjects} // Pass the refetch trigger
        />
      )}

      {/* Sections */}
      <Current refreshKey={refreshKey} />
      <Completed refreshKey={refreshKey} />
      <Awards refreshKey={refreshKey} />

      {/* Navigation */}
      <div className="w-full px-4 md:px-[25px] py-8">
        {window.innerWidth <= 640 ? (
          <GoTo title="Projects Gallery" link="/gallery" />
        ) : (
          <div className="sm:w-full sm:items-center sm:flex sm:justify-between">
            <GoTo title="Team members" link="/team" />
            <GoTo title="Publications" link="/publications" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

// --- Current Projects Section ---
const Current = ({ refreshKey }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/current`); // Use BASE_URL
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch current projects:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this useCallback creates the function once

  useEffect(() => {
    fetchCurrentProjects();
  }, [fetchCurrentProjects, refreshKey]); // Refetch when refreshKey changes

  return (
    <div className="flex flex-col gap-6 md:gap-[30px] px-4 md:px-[25px] py-6 md:py-[30px] w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-light text-4xl md:text-[48px] text-text_black_primary leading-tight md:leading-[48px]">
          Current Projects
        </h2>
        <Down_left_dark_arrow className="size-12 md:size-[58px]" />
      </div>

      {loading && <div className="text-center p-4">Loading Current Projects...</div>}
      {error && <div className="text-center p-4 text-red-600">Error: {error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center p-4 text-gray-500">No current projects found.</div>
      )}

      <div className="flex flex-col items-center gap-4 md:gap-[10px]">
        {projects.map((project) => (
          <Card
            key={project._id} // Use _id for key
            title={project.title}
            subtitle={project.subtitle} // Use subtitle field
            bg={project.image} // Use image field
            desc={project.description} // Use description field
            action={
              project.link
                ? () => window.open(project.link, "_blank", "noopener,noreferrer") // Function to open link
                : undefined // No action if no link
            }
            // Pass other props to Card if needed
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
  const [selectedYear, setSelectedYear] = useState("Recent"); // "Recent", "2024", "2023", etc.
  const [availableYears, setAvailableYears] = useState([]);

  const fetchCompletedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/completed`); // Use BASE_URL
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllCompleted(data);
      // Extract unique years and sort them descending, add "Recent"
      const years = ["Recent", ...new Set(data.map((p) => p.year).filter(Boolean))].sort((a, b) => {
        if (a === "Recent") return -1;
        if (b === "Recent") return 1;
        return b - a; // Sort years numerically descending
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
  }, [fetchCompletedProjects, refreshKey]); // Refetch when refreshKey changes

  // Filter projects when data or selectedYear changes
  useEffect(() => {
    if (selectedYear === "Recent") {
      // Show all or top N recent projects based on your preference
      setFilteredProjects(allCompleted); // Show all for now
    } else {
      setFilteredProjects(allCompleted.filter((p) => p.year?.toString() === selectedYear));
    }
  }, [allCompleted, selectedYear]);

  const handleYearFilter = (year) => {
    setSelectedYear(year.toString());
  };

  return (
    <div
      className="flex flex-col gap-6 md:gap-[30px] bg-text_black_primary py-6 md:py-[30px] w-full"
      id="completed"
    >
      {/* Header and Filters */}
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-extralight text-4xl md:text-[48px] text-white leading-tight md:leading-[50px]">
            Completed Projects
          </h2>
          <Down_straight_neutral_arrow className="text-text_white_primary -rotate-45 size-12 md:size-[56px]" />
        </div>
        {availableYears.length > 1 && ( // Only show filters if there are multiple years
          <div className="flex gap-2 md:gap-[12px] font-medium text-xs md:text-base text-white overflow-x-auto pb-2 no-scrollbar">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearFilter(year)}
                className={`border-2 px-4 py-1 md:px-[24px] md:py-[8px] rounded-full whitespace-nowrap ${
                  selectedYear === year.toString()
                    ? "bg-white text-text_black_primary border-white"
                    : "border-white text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading/Error/Empty States */}
      {loading && <div className="text-center p-4 text-white">Loading Completed Projects...</div>}
      {error && <div className="text-center p-4 text-red-400">Error: {error}</div>}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="text-center p-4 text-gray-400">
          No completed projects found{selectedYear !== "Recent" ? ` for ${selectedYear}` : ""}.
        </div>
      )}

      {/* Project Grid/List */}
      {!loading && !error && filteredProjects.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[15px] px-4 md:px-[25px] w-full">
            {filteredProjects.map((project) => (
              <div key={project._id} className="relative w-full cursor-pointer group">
                <div
                  className="relative bg-gray-700 rounded-[20px] w-full aspect-[3/2] overflow-hidden" // Use aspect ratio for consistent height
                  style={{
                    backgroundImage: `url(${project.image || "/placeholder.jpg"})`, // Fallback image
                    backgroundSize: "cover", // Use cover for better scaling
                    backgroundPosition: "center",
                  }}
                >
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#323232AA] via-transparent to-transparent rounded-[20px] group-hover:from-[#323232DD] transition-all duration-300"></div>
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-[20px] text-white">
                    <h2 className="font-bold text-lg md:text-[24px] text-text_white_primary">
                      {project.title}
                    </h2>
                    {/* Optionally show subtitle or description */}
                    {project.subtitle && (
                      <h3 className="text-xs md:text-[12px] text-text_white_secondary mt-1">
                        {project.subtitle}
                      </h3>
                    )}
                    {project.year && (
                      <h3 className="text-xs md:text-[12px] text-text_white_secondary mt-1">
                        {project.year}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button - Conditionally link or implement modal */}
          <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-semibold text-base md:text-[18px] text-text_white_primary hover:bg-gray-700 transition-colors duration-200 mt-4">
            <span>View All Completed Projects</span> {/* Needs functionality */}
            <Up_right_neutral_arrow alt="up right light arrow icon" />
          </button>
        </>
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
  const [selectedFilter, setSelectedFilter] = useState("All"); // "All", "Reddot", "iF", "Others"
  const [availableFilters, setAvailableFilters] = useState(["All"]);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/award`); // Use BASE_URL
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllAwards(data);
      // Determine available filters based on awardName
      const filters = new Set(["All"]);
      data.forEach((award) => {
        if (award.awardName?.toLowerCase().includes("reddot")) filters.add("Reddot");
        else if (
          award.awardName?.toLowerCase().includes("if") ||
          award.awardName?.toLowerCase().includes("iF")
        )
          filters.add("iF"); // Handle iF casing
        else if (award.awardName) filters.add("Others"); // Add 'Others' if any award exists
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
  }, [fetchAwards, refreshKey]); // Refetch when refreshKey changes

  // Filter awards when data or selectedFilter changes
  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredAwards(allAwards);
    } else if (selectedFilter === "Reddot") {
      setFilteredAwards(allAwards.filter((a) => a.awardName?.toLowerCase().includes("reddot")));
    } else if (selectedFilter === "iF") {
      setFilteredAwards(
        allAwards.filter(
          (a) =>
            a.awardName?.toLowerCase().includes("if") || a.awardName?.toLowerCase().includes("iF")
        )
      );
    } else if (selectedFilter === "Others") {
      setFilteredAwards(
        allAwards.filter(
          (a) =>
            a.awardName &&
            !a.awardName.toLowerCase().includes("reddot") &&
            !a.awardName.toLowerCase().includes("if") &&
            !a.awardName.toLowerCase().includes("iF")
        )
      );
    } else {
      setFilteredAwards(allAwards); // Default to all
    }
  }, [allAwards, selectedFilter]);

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-[30px] bg-primary_main py-6 md:py-[30px] w-full">
      {/* Header and Filters */}
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-light text-4xl md:text-[48px] leading-tight md:leading-[48px]">
            Awards
          </h2>
          <Down_straight_neutral_arrow className="rotate-45 size-10 md:size-[46px]" />
        </div>
        {availableFilters.length > 1 && ( // Show only if more than just "All"
          <div className="flex gap-2 md:gap-[12px] font-medium text-xs md:text-base overflow-x-auto pb-2 no-scrollbar">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilter(filter)}
                className={`border-2 px-4 py-1 md:px-[24px] md:py-[8px] rounded-full whitespace-nowrap ${
                  selectedFilter === filter
                    ? "bg-black text-white border-black"
                    : "border-black text-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading/Error/Empty States */}
      {loading && <div className="text-center p-4">Loading Awards...</div>}
      {error && <div className="text-center p-4 text-red-600">Error: {error}</div>}
      {!loading && !error && filteredAwards.length === 0 && (
        <div className="text-center p-4 text-gray-700">
          No awards found{selectedFilter !== "All" ? ` for ${selectedFilter}` : ""}.
        </div>
      )}

      {/* Awards Carousel/List */}
      {!loading && !error && filteredAwards.length > 0 && (
        <>
          <div className="flex gap-4 md:gap-[15px] px-4 md:px-[25px] w-full overflow-x-auto no-scrollbar pb-4">
            {filteredAwards.map((award) => (
              <div
                key={award._id}
                className="flex flex-col gap-3 md:gap-[12px] bg-white rounded-[20px] w-[280px] md:w-[300px] shrink-0 cursor-pointer shadow-md overflow-hidden"
                onClick={() => award.link && window.open(award.link, "_blank")} // Optional: make card clickable if link exists
              >
                <div
                  className="relative bg-gray-200 rounded-t-[20px] w-full h-[300px] md:h-[380px]" // Adjusted height
                  style={{
                    backgroundImage: `url(${award.image || "/placeholder.jpg"})`, // Fallback image
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                />

                <div className="flex flex-col gap-2 md:gap-[15px] px-3 md:px-[15px] pb-3 md:pb-[15px]">
                  {/* Use awardName or title */}
                  <h2 className="font-bold text-lg md:text-[24px] text-text_black_primary leading-tight">
                    {award.awardName || award.title}
                  </h2>
                  {/* Display project title if awardName is primary */}
                  {award.awardName && (
                    <h3 className="text-sm text-gray-600 -mt-2">{award.title}</h3>
                  )}
                  {/* Display authors if available */}
                  {award.authors && (
                    <h3 className="text-gray-500 font-light text-sm md:text-base">
                      {award.authors}
                    </h3>
                  )}
                  {award.year && (
                    <h3 className="text-border_dark font-bold text-xs md:text-[12px]">
                      {award.year}
                    </h3>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-bold text-base md:text-lg hover:bg-gray-200 transition-colors duration-200 mt-4">
            <span>View All Awards</span> {/* Needs functionality */}
            <Up_right_neutral_arrow alt="up right neutral arrow icon" />
          </button>
        </>
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
  const [projects, setProjects] = useState([]); // To list projects for editing/deleting
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("current"); // Default status
  const [year, setYear] = useState(""); // Store as string for input compatibility
  const [authors, setAuthors] = useState("");
  const [awardName, setAwardName] = useState("");
  const [tags, setTags] = useState(""); // Comma-separated tags for input
  const [selectedFile, setSelectedFile] = useState(null); // For new image upload
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // For existing image in edit mode

  // Operation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Fetch all projects for the admin list
  const fetchAllAdminProjects = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        // Fetch ALL projects
        headers: {
          // No auth needed for GET all usually, but add if your route requires it
          // Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects for admin:", error);
      setListError(error.message);
    } finally {
      setIsLoadingList(false);
    }
  }, [adminToken]); // Re-fetch if token changes (e.g., login/logout)

  useEffect(() => {
    fetchAllAdminProjects();
  }, [fetchAllAdminProjects, onProjectsUpdated]); // Also refetch when an update happens via onProjectsUpdated trigger

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
      setSelectedFile(event.target.files[0]);
      // Preview image locally (optional)
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImageUrl(e.target.result); // Temporarily show preview
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setSelectedFile(null);
      // Restore original image preview if editing
      setCurrentImageUrl(editingProject?.image || null);
    }
  };

  // Helper to upload image and get URL
  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("images", file); // Match backend expected field name ('images')

    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        // Use your upload endpoint
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(
          errorData.message || `Image upload failed with status: ${uploadResponse.status}`
        );
      }
      // Assuming the upload endpoint returns an array of URLs, even for single uploads
      const uploadedUrls = await uploadResponse.json();
      return uploadedUrls[0] || null; // Return the first URL
    } catch (error) {
      console.error("Image upload error:", error);
      setSubmitError(`Image Upload Failed: ${error.message}`);
      return null; // Indicate failure
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (!title || !status) {
      setSubmitError("Title and Status are required.");
      return;
    }
    if ((status === "award" || status === "completed") && !year) {
      setSubmitError("Year is required for 'Award' or 'Completed' status.");
      return;
    }
    if (status === "award" && !awardName) {
      setSubmitError("Award Name is required for 'Award' status.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = null;
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
      if (imageUrl === null) {
        // Check for upload failure
        setIsSubmitting(false);
        return; // Stop if upload failed
      }
    }

    const projectData = {
      title,
      subtitle,
      description,
      link: link || undefined, // Send undefined if empty
      status,
      year: year ? parseInt(year, 10) : undefined,
      authors: authors || undefined,
      awardName: status === "award" ? awardName : undefined,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [], // Split comma-separated tags
      image: imageUrl, // URL from upload or null
    };

    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create project. Status: ${response.status}`
        );
      }

      resetForm();
      onProjectsUpdated(); // Trigger refetch in parent/siblings
    } catch (error) {
      console.error("Error creating project:", error);
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
    setAuthors(project.authors || "");
    setAwardName(project.awardName || "");
    setTags(project.tags?.join(", ") || ""); // Join tags for input
    setCurrentImageUrl(project.image || null); // Set existing image URL
    setSelectedFile(null); // Clear any previously selected file
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingProject) return;
    setSubmitError(null);

    if (!title || !status) {
      setSubmitError("Title and Status are required.");
      return;
    }
    if ((status === "award" || status === "completed") && !year) {
      setSubmitError("Year is required for 'Award' or 'Completed' status.");
      return;
    }
    if (status === "award" && !awardName) {
      setSubmitError("Award Name is required for 'Award' status.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = editingProject.image; // Start with the current image URL

    // If a new file was selected, upload it
    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl === null) {
        // Check for upload failure
        setIsSubmitting(false);
        return; // Stop if upload failed
      }
      imageUrl = uploadedUrl; // Use the new URL
    } else if (currentImageUrl === null && editingProject.image) {
      // If currentImageUrl is nullified (e.g., user cleared preview without selecting new file)
      // AND there was an existing image, assume user wants to remove it.
      // Backend PUT logic handles deleting the old Supabase file if `image` is different.
      // Setting imageUrl to null here signals the backend to potentially remove the old one.
      // Actually, setting to `undefined` might be clearer to remove field vs setting to `null`
      imageUrl = undefined;
    }

    const projectData = {
      title,
      subtitle,
      description,
      link: link || undefined,
      status,
      year: year ? parseInt(year, 10) : undefined,
      authors: authors || undefined,
      awardName: status === "award" ? awardName : undefined,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      image: imageUrl, // Send the final determined image URL (new, old, or undefined)
    };

    // Remove undefined fields to avoid overwriting existing values unintentionally
    // The backend PUT should handle partial updates correctly, but this is safer client-side.
    Object.keys(projectData).forEach(
      (key) => projectData[key] === undefined && delete projectData[key]
    );

    try {
      const response = await fetch(`${BASE_URL}/projects/${editingProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update project. Status: ${response.status}`
        );
      }

      resetForm();
      onProjectsUpdated(); // Trigger refetch
    } catch (error) {
      console.error("Error updating project:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project and its image?")) {
      setDeletingId(id);
      setSubmitError(null);
      try {
        const response = await fetch(`${BASE_URL}/projects/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to delete project. Status: ${response.status}`
          );
        }
        onProjectsUpdated(); // Trigger refetch
        // If the deleted item was being edited, reset form
        if (editingProject?._id === id) {
          resetForm();
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        setSubmitError(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Common Form Fields JSX
  const projectFormFields = (
    <>
      {submitError && (
        <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-300 rounded">
          {submitError}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white"
          required
          disabled={isSubmitting}
        >
          <option value="current">Current</option>
          <option value="completed">Completed</option>
          <option value="award">Award</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          type="text"
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
        />
      </div>

      {(status === "completed" || status === "award") && (
        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
            required={status === "completed" || status === "award"}
            disabled={isSubmitting}
            placeholder="YYYY"
          />
        </div>
      )}
      {status === "award" && (
        <div className="mb-4">
          <label htmlFor="awardName" className="block text-sm font-medium text-gray-700 mb-1">
            Award Name *
          </label>
          <input
            type="text"
            id="awardName"
            value={awardName}
            onChange={(e) => setAwardName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
            required={status === "award"}
            disabled={isSubmitting}
            placeholder="e.g., Reddot Design Award"
          />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
          Authors
        </label>
        <input
          type="text"
          id="authors"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
          placeholder="e.g., J. Doe, A. Smith"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
          Link (URL)
        </label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
          placeholder="https://example.com"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
          placeholder="e.g., healthcare, iot, design"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          {isEditing ? "Replace Image" : "Image"}
        </label>
        {/* Image Preview */}
        {currentImageUrl && (
          <div className="my-2 relative w-40 h-32">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded border"
            />
            {isEditing &&
              editingProject?.image && ( // Show remove button only if editing and there's an original image
                <button
                  type="button"
                  onClick={() => {
                    setCurrentImageUrl(null); // Clear preview
                    setSelectedFile(null); // Ensure no file is selected
                    // Signal update to remove image by setting currentImageUrl to null
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none focus:outline-none hover:bg-red-600"
                  title="Remove Image"
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              )}
          </div>
        )}
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isSubmitting}
        />
      </div>
    </>
  );

  return (
    <div className="p-4 border-t border-b my-8 w-full bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Admin: Manage Projects</h3>

      {(isSubmitting || deletingId || isLoadingList) && (
        <LoadingSpinner
          message={
            isLoadingList
              ? "Loading projects..."
              : isSubmitting
              ? isCreating
                ? "Creating Project..."
                : "Updating Project..."
              : deletingId
              ? "Deleting Project..."
              : "Processing..."
          }
        />
      )}

      {!isCreating && !isEditing && (
        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-4 transition-colors duration-200"
          disabled={isSubmitting || deletingId || isLoadingList}
        >
          + Add New Project
        </button>
      )}

      {/* List Projects for Editing/Deleting */}
      {!isCreating && !isEditing && (
        <div className="space-y-2">
          {listError && (
            <div className="p-2 text-red-700 bg-red-100 border border-red-300 rounded">
              Error loading list: {listError}
            </div>
          )}
          {isLoadingList && !projects.length && <div>Loading project list...</div>}
          {projects.map((project) => (
            <div
              key={project._id}
              className="border rounded p-3 flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <p>
                  <strong>{project.title}</strong>
                  <span className="text-sm text-gray-500 ml-2">
                    ({project.status}
                    {project.year ? `, ${project.year}` : ""})
                  </span>
                </p>
                {project.image && (
                  <img
                    src={project.image}
                    alt=""
                    className="w-16 h-10 object-cover rounded inline-block mr-2 my-1"
                  />
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-2 rounded text-xs transition-colors duration-200"
                  disabled={isSubmitting || deletingId || isLoadingList}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className={`bg-red-500 hover:bg-red-600 text-white p-1 px-2 rounded text-xs transition-colors duration-200 ${
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
            <p className="text-gray-500">No projects found.</p>
          )}
        </div>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className="p-4 border rounded mt-4 bg-white shadow-md">
          <h4 className="text-lg font-medium mb-3">Create New Project</h4>
          <form onSubmit={handleCreate}>
            {projectFormFields}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-800 p-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && editingProject && (
        <div className="p-4 border rounded mt-4 bg-white shadow-md">
          <h4 className="text-lg font-medium mb-3">Edit Project: {editingProject.title}</h4>
          <form onSubmit={handleUpdate}>
            {projectFormFields}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Project"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-800 p-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
AdminProjectControls.propTypes = {
  onProjectsUpdated: PropTypes.func.isRequired,
};
