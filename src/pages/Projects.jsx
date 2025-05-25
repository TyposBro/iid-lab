/* eslint-disable react/prop-types */ // Or define PropTypes rigorously
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Down_left_dark_arrow,
  Down_straight_neutral_arrow,
  Up_right_neutral_arrow,
} from "@/assets/";
// Remove Card import if it's no longer used, or rename if it conflicts
// import { Card, GoTo, LoadingSpinner } from "@/components/";
import { LoadingSpinner } from "@/components/"; // Assuming GoTo and old Card are not needed
import { ProjectCard } from "@/components/ProjectCard"; // IMPORT THE NEW CARD
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
// useNavigate import was not used in the provided code for Current, Completed, Awards. Remove if not needed.
// import { useNavigate } from "react-router";

// Main Projects Page Component
export const Projects = () => {
  const { isAdmin } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  const refetchAllProjects = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="flex flex-col justify-start items-center pt-16 md:pt-[95px] w-full">
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

      {isAdmin && <AdminProjectControls onProjectsUpdated={refetchAllProjects} />}

      <Current refreshKey={refreshKey} />
      <Completed refreshKey={refreshKey} />
      <Awards refreshKey={refreshKey} />
    </div>
  );
};

export default Projects;

// --- Current Projects Section ---
const Current = ({ refreshKey }) => {
  // const navigate = useNavigate(); // Was not used
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/current`);
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
  }, []);

  useEffect(() => {
    fetchCurrentProjects();
  }, [fetchCurrentProjects, refreshKey]);

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

      {/* UPDATED to use ProjectCard in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {!loading &&
          !error &&
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              imageSrc={project.image || "/img/placeholder.png"} // Provide a fallback placeholder
              title={project.title}
              subtitle={project.subtitle}
              link={project.link}
              buttonText="Learn More"
              // Light theme for "Current Projects" cards
              cardBgColor="bg-transparent"
              borderColor="border-[#D9D9D9]"
              primaryTextColor="text_black_secondary"
              secondaryTextColor="text_black_secondary"
              buttonBorderColor="border-primary_main"
              buttonTextColor="text-primary_main"
              imageHeight="h-52" // Adjust as desired
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

  const fetchCompletedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/completed`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
    if (selectedYear === "Recent") {
      setFilteredProjects(allCompleted);
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
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-extralight text-4xl md:text-[48px] text-white leading-tight md:leading-[50px]">
            Completed Projects
          </h2>
          <Down_straight_neutral_arrow className="text-text_white_primary -rotate-45 size-12 md:size-[56px]" />
        </div>
        {availableYears.length > 1 && (
          <div className="flex gap-2 md:gap-[12px] font-medium text-xs md:text-base text-white overflow-x-auto pb-2 no-scrollbar">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearFilter(year)}
                className={`border-2 px-6 py-2 md:px-8 md:py-3 rounded-full whitespace-nowrap ${
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

      {loading && <div className="text-center p-4 text-white">Loading Completed Projects...</div>}
      {error && <div className="text-center p-4 text-red-400">Error: {error}</div>}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="text-center p-4 text-gray-400">
          No completed projects found{selectedYear !== "Recent" ? ` for ${selectedYear}` : ""}.
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <>
          {/* UPDATED to use ProjectCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-[25px] w-full">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                imageSrc={project.image || "/img/placeholder.png"}
                title={project.title}
                subtitle={project.subtitle}
                projectYear={project.year}
                link={project.link}
                buttonText="View Details"
                // Dark theme for "Completed Projects" cards (on dark section background)
                cardBgColor="bg-transparent" // Example: slightly lighter than section bg
                borderColor="border-[#282828]"
                primaryTextColor="text-background_light"
                secondaryTextColor="text-background_light"
                buttonBorderColor="border-white" // Or border-white
                buttonTextColor="text-white" // Or text-white
                imageHeight="h-52"
              />
            ))}
          </div>

          <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-semibold text-base md:text-[18px] text-text_white_primary hover:bg-gray-700 transition-colors duration-200 mt-4 mx-auto px-6">
            <span>View All Completed Projects</span>
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
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [availableFilters, setAvailableFilters] = useState(["All"]);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects/status/award`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllAwards(data);
      const filters = new Set(["All"]);
      data.forEach((award) => {
        if (award.awardName?.toLowerCase().includes("reddot")) filters.add("Reddot");
        else if (award.awardName?.toLowerCase().includes("if"))
          filters.add("iF"); // Handle 'if' and 'iF'
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
    if (selectedFilter === "All") {
      setFilteredAwards(allAwards);
    } else if (selectedFilter === "Reddot") {
      setFilteredAwards(allAwards.filter((a) => a.awardName?.toLowerCase().includes("reddot")));
    } else if (selectedFilter === "iF") {
      setFilteredAwards(allAwards.filter((a) => a.awardName?.toLowerCase().includes("if")));
    } else if (selectedFilter === "Others") {
      setFilteredAwards(
        allAwards.filter(
          (a) =>
            a.awardName &&
            !a.awardName.toLowerCase().includes("reddot") &&
            !a.awardName.toLowerCase().includes("if")
        )
      );
    } else {
      setFilteredAwards(allAwards);
    }
  }, [allAwards, selectedFilter]);

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-[30px] bg-primary_main py-6 md:py-[30px] w-full">
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-light text-4xl md:text-[48px] leading-tight md:leading-[48px] text-black">
            {" "}
            {/* Text color for awards title */}
            Awards
          </h2>
          <Down_straight_neutral_arrow className="rotate-45 size-10 md:size-[46px] text-black" />{" "}
          {/* Icon color */}
        </div>
        {availableFilters.length > 1 && (
          <div className="flex gap-2 md:gap-[12px] font-medium text-xs md:text-base overflow-x-auto pb-2 no-scrollbar">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilter(filter)}
                className={`border-2 px-6 py-2 md:px-8 md:py-3 rounded-full whitespace-nowrap ${
                  selectedFilter === filter
                    ? "bg-black text-white border-black" // Active filter
                    : "border-black text-black" // Inactive filter
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <div className="text-center p-4 text-black">Loading Awards...</div>}
      {error && <div className="text-center p-4 text-red-700">Error: {error}</div>}
      {!loading && !error && filteredAwards.length === 0 && (
        <div className="text-center p-4 text-gray-700">
          No awards found{selectedFilter !== "All" ? ` for ${selectedFilter}` : ""}.
        </div>
      )}

      {!loading && !error && filteredAwards.length > 0 && (
        <>
          {/* UPDATED to use ProjectCard in a horizontal scroll */}
          <div className="flex gap-4 md:gap-[6px] px-4 md:px-[25px] w-full overflow-x-auto no-scrollbar pb-4">
            {filteredAwards.map((award) => (
              <ProjectCard
                key={award._id}
                imageSrc={award.image || "/img/placeholder.png"}
                awardName={award.awardName} // Pass awardName
                title={award.title} // Pass original project title (used as subtitle if awardName exists)
                projectYear={award.year}
                projectAuthors={award.authors} // Assuming authors is an array
                link={award.link}
                buttonText="Details"
                // Light theme for Award cards (on primary_main section background)
                cardBgColor="bg-white"
                borderColor="border-gray-200"
                primaryTextColor="text-text_black_primary"
                secondaryTextColor="text-text_black_primary"
                buttonBorderColor="border-primary_main"
                buttonTextColor="text-primary_main"
                imageHeight="h-64" // Taller images for awards
                customClasses="w-[280px] md:w-[300px] shrink-0" // Critical for horizontal scroll
              />
            ))}
          </div>

          <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-bold text-base md:text-lg text-black hover:bg-blue-100 transition-colors duration-200 mt-4 mx-auto px-6">
            {" "}
            {/* Text color for button on primary_main bg */}
            <span>View All Awards</span>
            <Up_right_neutral_arrow alt="up right neutral arrow icon" className="text-black" />{" "}
            {/* Icon color */}
          </button>
        </>
      )}
    </div>
  );
};
Awards.propTypes = {
  refreshKey: PropTypes.number.isRequired,
};

// --- Admin UI Component for Projects (NO CHANGES TO THIS COMPONENT per request) ---
const AdminProjectControls = ({ onProjectsUpdated }) => {
  // ... (existing AdminProjectControls code)
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
  const [authors, setAuthors] = useState("");
  const [awardName, setAwardName] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const fetchAllAdminProjects = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const response = await fetch(`${BASE_URL}/projects`, {
        headers: {
          // Authorization: `Bearer ${adminToken}`, // Add if your /projects GET all endpoint is protected
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
  }, [adminToken]);

  useEffect(() => {
    fetchAllAdminProjects();
  }, [fetchAllAdminProjects, onProjectsUpdated]);

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
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImageUrl(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setSelectedFile(null);
      setCurrentImageUrl(editingProject?.image || null);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("images", file);
    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
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
      const uploadedUrls = await uploadResponse.json();
      return uploadedUrls[0] || null;
    } catch (error) {
      console.error("Image upload error:", error);
      setSubmitError(`Image Upload Failed: ${error.message}`);
      return null;
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
        setIsSubmitting(false);
        return;
      }
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
      image: imageUrl,
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
      onProjectsUpdated();
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    resetForm();
    setIsEditing(true);
    setIsCreating(false);
    setEditingProject(project);
    setTitle(project.title);
    setSubtitle(project.subtitle || "");
    setDescription(project.description || "");
    setLink(project.link || "");
    setStatus(project.status);
    setYear(project.year?.toString() || "");
    setAuthors(project.authors || ""); // Assuming authors is stored as string in DB or joined here
    setAwardName(project.awardName || "");
    setTags(project.tags?.join(", ") || "");
    setCurrentImageUrl(project.image || null);
    setSelectedFile(null);
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
    let imageUrl = editingProject.image;
    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl === null) {
        setIsSubmitting(false);
        return;
      }
      imageUrl = uploadedUrl;
    } else if (currentImageUrl === null && editingProject.image) {
      imageUrl = undefined; // Signal to remove image
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
      image: imageUrl,
    };
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
      onProjectsUpdated();
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
        onProjectsUpdated();
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
        {currentImageUrl && (
          <div className="my-2 relative w-40 h-32">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded border"
            />
            {isEditing && editingProject?.image && (
              <button
                type="button"
                onClick={() => {
                  setCurrentImageUrl(null);
                  setSelectedFile(null);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none focus:outline-none hover:bg-red-600"
                title="Remove Image"
                disabled={isSubmitting}
              >
                ×
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
    <div className="w-full p-4">
      <div className="p-4 border rounded my-8 w-full bg-gray-50 flex flex-wrap items-center justify-between">
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
        {!isCreating && !isEditing && (
          <div className="space-y-2 w-full max-h-96 overflow-y-auto pr-2">
            {" "}
            {/* Added max-h and overflow */}
            {listError && (
              <div className="p-2 text-red-700 bg-red-100 border border-red-300 rounded">
                Error loading list: {listError}
              </div>
            )}
            {isLoadingList && !projects.length && <div>Loading project list...</div>}
            {projects.map((project) => (
              <div
                key={project._id}
                className="border rounded p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-white shadow-sm"
              >
                <div className="flex items-start gap-3 flex-grow">
                  {project.image && (
                    <img
                      src={project.image}
                      alt=""
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-xs text-gray-500">
                      ({project.status}
                      {project.year ? `, ${project.year}` : ""})
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-3 rounded text-sm transition-colors duration-200"
                    disabled={isSubmitting || deletingId || isLoadingList}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className={`bg-red-500 hover:bg-red-600 text-white p-1 px-3 rounded text-sm transition-colors duration-200 ${
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
        {isCreating && (
          <div className="p-4 border rounded mt-4 bg-white shadow-md w-full">
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
        {isEditing && editingProject && (
          <div className="p-4 border rounded mt-4 bg-white shadow-md w-full">
            {" "}
            {/* Ensure form takes full width */}
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
    </div>
  );
};
AdminProjectControls.propTypes = {
  onProjectsUpdated: PropTypes.func.isRequired,
};
