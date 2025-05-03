// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
// Removed LiteYouTubeEmbed import as it's not used here
import { MainCarousel, LoadingSpinner } from "@/components";
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Down_left_dark_arrow } from "@/assets/"; // Icon for Tracks section title

// Helper to create default data structure matching the NEW schema
const createDefaultAboutData = () => ({
  head: { title: "Integration & Innovation Design", description: "" }, // Default head title
  body: { title: "Research Tracks", list: [{ title: "", text: [], img: [] }] }, // Start with one empty track
});

// --- Reusable Form Field Components ---
const InputField = ({ label, path, value, onChange, placeholder = "", type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={path} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={path}
      name={path}
      value={value || ""} // Ensure controlled component has a value
      onChange={(e) => onChange(path, e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary_main focus:border-primary_main outline-none sm:text-sm"
      placeholder={placeholder || label}
    />
  </div>
);
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

const TextareaField = ({ label, path, value, onChange, rows = 3, placeholder = "" }) => (
  <div className="mb-4">
    <label htmlFor={path} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={path}
      name={path}
      value={value || ""} // Ensure controlled component has a value
      onChange={(e) => onChange(path, e.target.value)}
      rows={rows}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary_main focus:border-primary_main outline-none sm:text-sm text-base" // Added text-base
      placeholder={placeholder || label}
    />
  </div>
);
TextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
};

// --- Main About Component ---
export const About = () => {
  // State for data from different sources
  const [aboutData, setAboutData] = useState(null); // Holds fetched /about content
  const [carouselSlides, setCarouselSlides] = useState([]); // Holds combined image URLs for top carousel

  // Loading and error states
  const [loadingAbout, setLoadingAbout] = useState(true); // Loading state for /about content
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for /news & /gallery images
  const [error, setError] = useState(null); // General error state

  // Admin related state
  const { isAdmin, adminToken } = useAdmin();
  const [isEditing, setIsEditing] = useState(false); // Is the admin currently editing?
  const [editedData, setEditedData] = useState(null); // Holds temporary form data during edit
  const [isSaving, setIsSaving] = useState(false); // Is a save operation in progress?

  // --- Fetching Logic ---

  // Fetch content specifically for the /about page
  const fetchAboutContent = useCallback(async () => {
    setLoadingAbout(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/about`);
      if (response.status === 404) {
        setAboutData(null);
        return;
      } // Handle not found
      if (!response.ok) throw new Error(`About fetch failed: ${response.status}`);
      const data = await response.json();
      setAboutData(data);
    } catch (err) {
      console.error("Fetch about error:", err);
      setError("Failed to load about page content.");
    } finally {
      setLoadingAbout(false);
    }
  }, [BASE_URL]); // Add BASE_URL dependency

  // Fetch images for the carousel from /news and /gallery
  const fetchCarouselImages = useCallback(async () => {
    setLoadingImages(true);
    try {
      const results = await Promise.allSettled([
        fetch(`${BASE_URL}/news`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
        fetch(`${BASE_URL}/gallery`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
      ]);
      const [newsResult, galleryResult] = results;
      let fetchedNews = newsResult.status === "fulfilled" ? newsResult.value : [];
      let fetchedGallery = galleryResult.status === "fulfilled" ? galleryResult.value : [];
      if (newsResult.status !== "fulfilled") console.error("News fetch failed:", newsResult.reason);
      if (galleryResult.status !== "fulfilled")
        console.error("Gallery fetch failed:", galleryResult.reason);
      fetchedNews.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort news
      const newsImages = fetchedNews
        .flatMap((item) => item.images || [])
        .filter(Boolean)
        .slice(0, 5);
      const galleryImages = fetchedGallery
        .flatMap((item) => item.images || [])
        .filter(Boolean)
        .slice(0, 5);
      setCarouselSlides([...newsImages, ...galleryImages]);
    } catch (err) {
      console.error("Carousel image fetch error:", err);
    } finally {
      setLoadingImages(false);
    }
  }, [BASE_URL]); // Add BASE_URL dependency

  // Fetch data on component mount
  useEffect(() => {
    fetchAboutContent();
    fetchCarouselImages();
  }, [fetchAboutContent, fetchCarouselImages]);

  // --- Admin Actions ---

  // Toggle edit mode on/off
  const handleEditToggle = () => {
    if (!isEditing) {
      // Entering edit mode: Prepare data
      const dataToEdit = aboutData
        ? JSON.parse(JSON.stringify(aboutData))
        : createDefaultAboutData();
      // Ensure body and body.list structure exists
      if (!dataToEdit.body) dataToEdit.body = { title: "Research Tracks", list: [] };
      if (!dataToEdit.body.list) dataToEdit.body.list = [];
      if (dataToEdit.body.list.length === 0) {
        dataToEdit.body.list.push({ title: "", text: [], img: [] });
      }
      // Convert arrays to strings for form textareas
      dataToEdit.body.list.forEach((item) => {
        item.text = Array.isArray(item.text) ? item.text.join("\n\n") : item.text || "";
        item.img = Array.isArray(item.img) ? item.img.join(", ") : item.img || "";
      });
      setEditedData(dataToEdit);
    } else {
      setEditedData(null);
    } // Clear edits on cancel
    setIsEditing(!isEditing);
    setError(null); // Reset error state
  };

  // Generic input handler (Handles nested paths including arrays like body.list[0].title)
  const handleInputChange = (path, value) => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const keys = path.split(".");
      let current = newData;
      try {
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
          if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            if (!current[arrayKey]) current[arrayKey] = [];
            if (!current[arrayKey][index]) current[arrayKey][index] = {};
            current = current[arrayKey][index];
          } else {
            if (typeof current[key] === "undefined" || current[key] === null) current[key] = {};
            current = current[key];
          }
        }
        const finalKey = keys[keys.length - 1];
        const finalArrayMatch = finalKey.match(/^(\w+)\[(\d+)\]$/);
        if (finalArrayMatch) {
          const arrayKey = finalArrayMatch[1];
          const index = parseInt(finalArrayMatch[2], 10);
          if (!current[arrayKey]) current[arrayKey] = [];
          current[arrayKey][index] = value;
        } else {
          current[finalKey] = value;
        }
      } catch (e) {
        console.error("Error updating state path:", path, e);
        return prevData;
      } // Avoid breaking state on error
      return newData;
    });
  };

  // Adds an empty track object to the form state (fields initialized as strings for textareas)
  const addTrack = () => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (!newData.body) newData.body = { title: "Research Tracks", list: [] };
      if (!newData.body.list) newData.body.list = [];
      newData.body.list.push({ title: "", text: "", img: "" }); // Add empty track with fields as strings
      return newData;
    });
  };

  // Removes a track from the form state by index
  const removeTrack = (indexToRemove) => {
    if (!window.confirm("Are you sure you want to remove this track?")) return;
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (newData.body?.list) {
        newData.body.list.splice(indexToRemove, 1);
        // Optional: Ensure at least one item remains for form usability if needed
        // if(newData.body.list.length === 0) {
        //     newData.body.list.push({ title: "", text: "", img: "" });
        // }
      }
      return newData;
    });
  };

  // Save handler: prepares clean data matching schema and sends PUT request
  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    setError(null);

    // Prepare payload: Start fresh to only include schema fields
    const dataToSave = {
      head: {
        title: editedData.head?.title || "",
        description: editedData.head?.description || "",
      },
      body: {
        title: editedData.body?.title || "Research Tracks",
        list: [], // Initialize list
      },
    };

    // Process and validate the list items from the form state
    if (editedData.body?.list) {
      dataToSave.body.list = editedData.body.list
        .map((item) => ({
          title: item.title || "",
          // Convert text textarea string back to array (split by double newline)
          text:
            typeof item.text === "string"
              ? item.text
                  .split(/\n\s*\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          // Convert img textarea string back to array (split by comma)
          img:
            typeof item.img === "string"
              ? item.img
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
        }))
        .filter((item) => item.title || item.text.length > 0 || item.img.length > 0); // Optional: filter out completely empty tracks
    }

    // Validation before sending
    if (!dataToSave.head?.title || !dataToSave.head?.description || !dataToSave.body?.title) {
      alert("Please fill required fields (Head Title/Description, Body Title).");
      setIsSaving(false);
      return;
    }

    console.log("--- Frontend: Data being sent to PUT /api/about ---");
    console.log(JSON.stringify(dataToSave, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/about`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave), // SEND THE CLEANED PAYLOAD
      });
      if (!response.ok) throw new Error(`Save failed: ${response.status} ${await response.text()}`);
      const savedData = await response.json();

      console.log("--- Frontend: Response received from PUT /api/about ---");
      console.log(JSON.stringify(savedData, null, 2));

      setAboutData(savedData); // Update canonical data
      setIsEditing(false);
      setEditedData(null); // Exit edit mode
      alert("About page saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Logic ---
  const displayData = isEditing ? editedData : aboutData;
  // Can show content if about content isn't loading AND (we are editing OR about data exists)
  const canShowAboutContent = !loadingAbout && (isEditing || aboutData);

  // Tailwind classes inspired by Figma (adjust breakpoints sm/md/lg as needed)
  return (
    // Main container
    <div className="flex flex-col items-center w-full min-h-screen  pt-[95px] bg-white">
      {/* Top Carousel Section */}
      <section className="w-full px-4 md:px-[50px] pt-6 md:pt-0">
        {" "}
        {/* Figma hero padding */}
        <div className="w-full max-w-[1340px] mx-auto mb-6 md:mb-8">
          {" "}
          {/* Matches Frame 30 width */}
          {loadingImages && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {!loadingImages && carouselSlides.length > 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-100 rounded-lg md:rounded-[30px] overflow-hidden">
              {" "}
              {/* Container for carousel */}
              <MainCarousel slides={carouselSlides} />
            </div>
          )}
          {!loadingImages && carouselSlides.length === 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center text-gray-500">
              No carousel images.
            </div>
          )}
        </div>
      </section>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="w-full max-w-4xl px-4 md:px-0 mb-6 flex justify-center gap-4">
          {/* Cancel button shown only when editing */}
          {isEditing && (
            <button
              className="px-4 py-2 rounded shadow-md bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
              onClick={handleEditToggle}
              disabled={isSaving}
            >
              Cancel
            </button>
          )}
          {/* Edit / Save Changes button */}
          <button
            className={`px-4 py-2 rounded shadow-md text-white ${
              isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50`}
            onClick={isEditing ? handleSave : handleEditToggle}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Page"}
          </button>
        </div>
      )}

      {/* Loading/Error for About Content */}
      {loadingAbout && (
        <div className="mt-10">
          <LoadingSpinner message="Loading content..." />
        </div>
      )}
      {!loadingAbout && error && <div className="text-red-600 text-center mt-10 px-4">{error}</div>}

      {/* Page Content: Head and Body Sections */}
      {!loadingAbout && !error && (
        <div className="w-full">
          {canShowAboutContent ? (
            isEditing ? (
              // --- EDITING FORM ---
              <div className="w-full max-w-4xl mx-auto px-4 space-y-8 mb-12">
                {/* Head Section Form */}
                <section className="p-4 border rounded-lg shadow bg-gray-50">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                    Header Section
                  </h2>
                  <InputField
                    label="Title"
                    path="head.title"
                    value={displayData?.head?.title}
                    onChange={handleInputChange}
                  />
                  <TextareaField
                    label="Description"
                    path="head.description"
                    value={displayData?.head?.description}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </section>
                {/* Body Section Form */}
                <section className="p-4 border rounded-lg shadow bg-gray-50">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
                    Body Section (Research Tracks)
                  </h2>
                  <InputField
                    label="Section Title"
                    path="body.title"
                    value={displayData?.body?.title}
                    onChange={handleInputChange}
                  />
                  <hr className="my-6" />
                  <h3 className="text-lg font-medium mb-3 text-gray-600">Tracks List</h3>
                  <div className="space-y-6">
                    {displayData?.body?.list?.map((item, index) => (
                      <div
                        key={`track-edit-${index}`}
                        className="p-4 border rounded bg-white shadow-sm relative"
                      >
                        {/* Remove Button - visible if more than one track, or always if needed */}
                        <button
                          type="button"
                          onClick={() => removeTrack(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold p-1 bg-white rounded-full leading-none z-10"
                          title="Remove Track"
                        >
                          × REMOVE
                        </button>
                        <InputField
                          label={`Track ${index + 1}: Title`}
                          path={`body.list[${index}].title`}
                          value={item.title}
                          onChange={handleInputChange}
                        />
                        <TextareaField
                          label={`Track ${index + 1}: Text (Paragraphs separated by blank lines)`}
                          path={`body.list[${index}].text`}
                          value={item.text}
                          onChange={handleInputChange}
                          rows={6}
                        />
                        <TextareaField
                          label={`Track ${index + 1}: Image URLs (comma-separated)`}
                          path={`body.list[${index}].img`}
                          value={item.img}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="e.g., /img1.jpg, /img2.png"
                        />
                      </div>
                    ))}
                    {/* Message if no tracks in edit mode */}
                    {(!displayData?.body?.list || displayData.body.list.length === 0) && (
                      <p className="text-gray-400 italic text-sm">
                        No tracks added yet. Click 'Add Track' below.
                      </p>
                    )}
                  </div>
                  {/* Add Track Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={addTrack}
                      className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      + Add Track
                    </button>
                  </div>
                </section>
                {/* Bottom Save/Cancel Buttons */}
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    className="px-4 py-2 rounded shadow-md bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded shadow-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              // --- DISPLAY MODE ---
              <div className="w-full">
                {/* Head Section Display */}
                <section className="px-4 md:px-[70px] pb-8 md:pb-10">
                  <div className="max-w-[1280px] mx-auto space-y-2 md:space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk text-text_black_primary tracking-tight">
                      {displayData?.head?.title || ""}
                    </h1>
                    <p className="text-base md:text-lg text-text_black_secondary leading-relaxed md:leading-snug">
                      {displayData?.head?.description || ""}
                    </p>
                  </div>
                </section>

                {/* Body Section Display */}
                <section className="w-full px-4 md:px-[70px] py-8 md:py-12 border-t border-gray-200">
                  <div className="max-w-[1280px] mx-auto">
                    <div className="flex justify-between items-center mb-8 md:mb-12">
                      <h2 className="text-4xl md:text-5xl lg:text-[80px] font-light font-space-grotesk text-text_black_primary leading-tight">
                        {displayData?.body?.title || "Research Tracks"}
                      </h2>
                      <Down_left_dark_arrow className="w-10 h-10 md:w-14 md:h-14 text-primary_main shrink-0" />
                    </div>

                    {/* Research Tracks List */}
                    <div className="space-y-12 md:space-y-16 lg:space-y-20">
                      {displayData?.body?.list?.map((item, index) => (
                        // Simple alternating layout example (text left/img right vs img left/text right)
                        <div
                          key={`track-${index}`}
                          className={`flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-start ${
                            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                          }`}
                        >
                          {/* Text Content */}
                          <div className="w-full lg:w-2/3 space-y-3 md:space-y-4">
                            <h3 className="text-2xl md:text-3xl font-bold font-space-grotesk text-primary_main">
                              {item.title}
                            </h3>
                            {item.text?.map((paragraph, pIndex) => (
                              <p
                                key={pIndex}
                                className="text-base md:text-lg text-text_black_secondary leading-relaxed"
                              >
                                {paragraph}
                              </p>
                            ))}
                            {(!item.text || item.text.length === 0) && (
                              <p className="text-gray-400 italic">No description.</p>
                            )}
                          </div>
                          {/* Image Gallery */}
                          {item.img && item.img.length > 0 && (
                            <div className="w-full lg:w-1/3 grid grid-cols-2 gap-3 md:gap-4 self-center lg:self-start mt-4 lg:mt-0">
                              {item.img.slice(0, 4).map(
                                (
                                  url,
                                  iIndex // Show max 4 images
                                ) => (
                                  <img
                                    key={iIndex}
                                    src={url}
                                    alt={`${item.title} illustration ${iIndex + 1}`}
                                    className="w-full h-auto object-cover rounded-lg md:rounded-xl shadow aspect-square bg-gray-200"
                                    loading="lazy"
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Message if no tracks exist */}
                      {(!displayData?.body?.list || displayData.body.list.length === 0) && (
                        <p className="text-center text-gray-500 italic py-10">
                          No research tracks have been added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )
          ) : (
            // Message when content doesn't exist and not editing
            <div className="text-center text-gray-500 mt-10 px-4">
              About page content has not been created yet.
              {isAdmin ? " Click 'Edit Page' above to add content." : ""}
            </div>
          )}
        </div> // End Conditional Content Wrapper
      )}
    </div> // End Main Page Container
  );
};

// Add PropTypes validation
About.propTypes = {
  // No props expected for the page component itself
};

export default About;
