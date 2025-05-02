// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { MainCarousel, LoadingSpinner, Markdown } from "@/components"; // Added Markdown
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
// Removed Down_left_dark_arrow as it's not used in the new structure's components

// Helper to create default data structure matching the NEW schema
const createDefaultAboutData = () => ({
  head: { title: "", description: "" },
  body: { title: "Research Tracks", list: [{ title: "", text: [], img: [] }] }, // Start with one empty track
});

// --- Main About Component ---
export const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin, adminToken } = useAdmin();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetching Logic ---
  const fetchAboutContent = useCallback(async () => {
    setLoadingAbout(true);
    setError(null); // Reset error on fetch
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
      console.error("Failed to fetch about data:", err);
      setError("Failed to load about page content.");
    } finally {
      setLoadingAbout(false);
    }
  }, []);

  const fetchCarouselImages = useCallback(async () => {
    // Carousel logic remains separate
    setLoadingImages(true);
    try {
      /* ... (same as before, fetching news/gallery) ... */
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
  }, []);

  useEffect(() => {
    fetchAboutContent();
    fetchCarouselImages();
  }, [fetchAboutContent, fetchCarouselImages]);

  // --- Admin Actions ---
  const handleEditToggle = () => {
    if (!isEditing) {
      const dataToEdit = aboutData
        ? JSON.parse(JSON.stringify(aboutData))
        : createDefaultAboutData();
      // Ensure body.list exists and has at least one item for the form
      if (!dataToEdit.body) dataToEdit.body = { title: "Research Tracks", list: [] }; // Add body if missing
      if (!dataToEdit.body.list || dataToEdit.body.list.length === 0) {
        dataToEdit.body.list = [{ title: "", text: [], img: [] }];
      }
      // Convert text/img arrays to strings for textareas
      dataToEdit.body.list.forEach((item) => {
        item.text = Array.isArray(item.text) ? item.text.join("\n\n") : ""; // Join paragraphs with double newline
        item.img = Array.isArray(item.img) ? item.img.join(", ") : ""; // Join URLs with comma+space
      });
      setEditedData(dataToEdit);
    } else {
      setEditedData(null);
    } // Clear edits on cancel
    setIsEditing(!isEditing);
    setError(null);
  };

  // --- Generic Input Handler (Handles nested structure including body.list[index].field) ---
  const handleInputChange = (path, value) => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
      const keys = path.split(".");
      let current = newData;
      try {
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/); // e.g., list[0]
          if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            if (!current[arrayKey]) current[arrayKey] = [];
            if (!current[arrayKey][index]) current[arrayKey][index] = {}; // Ensure object exists at index
            current = current[arrayKey][index];
          } else {
            if (typeof current[key] === "undefined" || current[key] === null) current[key] = {};
            current = current[key];
          }
        }
        // Handle the final key assignment
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
      }
      return newData;
    });
  };

  // --- Handlers for adding/removing items in body.list ---
  const addTrack = () => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (!newData.body) newData.body = { title: "Research Tracks", list: [] };
      if (!newData.body.list) newData.body.list = [];
      // Add new empty track (textarea format)
      newData.body.list.push({ title: "", text: "", img: "" });
      return newData;
    });
  };

  const removeTrack = (indexToRemove) => {
    if (!window.confirm("Are you sure you want to remove this track?")) return;
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (newData.body && newData.body.list) {
        newData.body.list.splice(indexToRemove, 1); // Remove item at index
      }
      // If last item removed, add a default empty one back? Optional.
      if (newData.body.list.length === 0) {
        newData.body.list.push({ title: "", text: "", img: "" });
      }
      return newData;
    });
  };

  // --- Save Handler (Adapts editedData to match Schema) ---
  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    setError(null);

    // Deep copy and prepare payload
    const dataToSave = JSON.parse(JSON.stringify(editedData));

    // Convert text/img textareas back to arrays
    if (dataToSave.body && dataToSave.body.list) {
      dataToSave.body.list.forEach((item) => {
        // Split text by double newline, trim, filter empty
        item.text =
          typeof item.text === "string"
            ? item.text
                .split(/\n\s*\n/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [];
        // Split img URLs by comma, trim, filter empty
        item.img =
          typeof item.img === "string"
            ? item.img
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];
      });
    } else if (dataToSave.body) {
      dataToSave.body.list = []; // Ensure list is an array if body exists
    }

    // Basic validation before sending
    if (!dataToSave.head?.title || !dataToSave.head?.description || !dataToSave.body?.title) {
      alert("Please fill in the required fields (Head Title, Head Description, Body Title).");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/about`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave), // Send the structured data
      });
      if (!response.ok) throw new Error(`Save failed: ${response.status} ${await response.text()}`);
      const savedData = await response.json();
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
  const canShowAboutContent = !loadingAbout && (isEditing || aboutData);

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full min-h-screen">
      {/* Carousel (Unaffected by About content) */}
      <div className="w-full max-w-4xl mb-6">
        {loadingImages && <LoadingSpinner message="Loading images..." />}
        {!loadingImages && carouselSlides.length > 0 && <MainCarousel slides={carouselSlides} />}
        {!loadingImages && carouselSlides.length === 0 && (
          <div className="text-center text-gray-500 py-10">No carousel images.</div>
        )}
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="w-full max-w-4xl mb-6 flex justify-center gap-4">
          {isEditing && (
            <button className="btn-secondary" onClick={handleEditToggle} disabled={isSaving}>
              Cancel
            </button>
          )}
          <button
            className={`btn ${isEditing ? "btn-primary" : "btn-secondary"}`}
            onClick={isEditing ? handleSave : handleEditToggle}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Page"}
          </button>
        </div>
      )}

      {/* Loading/Error States for About Content */}
      {loadingAbout && <LoadingSpinner message="Loading content..." />}
      {!loadingAbout && error && (
        <div className="text-red-600 text-center mt-6">Error: {error}</div>
      )}

      {/* Main Content Area */}
      {!loadingAbout && !error && (
        <div className="w-full max-w-4xl">
          {canShowAboutContent ? (
            // Display Form or Rendered Content based on isEditing
            isEditing ? (
              // --- EDITING FORM ---
              <div className="space-y-8">
                {/* Head Section Form */}
                <section className="p-4 border rounded shadow-sm bg-white">
                  <h2 className="text-xl font-semibold mb-3 border-b pb-2">Header Section</h2>
                  <div className="space-y-3">
                    <InputField
                      label="Title"
                      path="head.title"
                      value={displayData?.head?.title || ""}
                      onChange={handleInputChange}
                    />
                    <TextareaField
                      label="Description"
                      path="head.description"
                      value={displayData?.head?.description || ""}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </section>

                {/* Body Section Form */}
                <section className="p-4 border rounded shadow-sm bg-white">
                  <h2 className="text-xl font-semibold mb-3 border-b pb-2">Body Section</h2>
                  <div className="mb-4">
                    <InputField
                      label="Title"
                      path="body.title"
                      value={displayData?.body?.title || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <h3 className="text-lg font-medium mb-3">Research Tracks</h3>
                  <div className="space-y-6">
                    {/* Map over the list items for the form */}
                    {displayData?.body?.list?.map((item, index) => (
                      <div
                        key={`track-edit-${index}`}
                        className="p-3 border rounded bg-gray-50 relative"
                      >
                        {/* Remove button for tracks (only if more than one) */}
                        {displayData.body.list.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTrack(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
                            title="Remove Track"
                          >
                            × REMOVE
                          </button>
                        )}
                        <InputField
                          label={`Track ${index + 1}: Title`}
                          path={`body.list[${index}].title`}
                          value={item.title || ""}
                          onChange={handleInputChange}
                        />
                        <TextareaField
                          label={`Track ${index + 1}: Text (Paragraphs separated by blank lines)`}
                          path={`body.list[${index}].text`}
                          value={item.text || ""}
                          onChange={handleInputChange}
                          rows={6}
                        />
                        <TextareaField
                          label={`Track ${index + 1}: Image URLs (comma-separated)`}
                          path={`body.list[${index}].img`}
                          value={item.img || ""}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="e.g., /url1.jpg, /url2.png"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Add Track Button */}
                  <div className="mt-4">
                    <button type="button" onClick={addTrack} className="btn-secondary btn-sm">
                      + Add Another Track
                    </button>
                  </div>
                </section>
                {/* Bottom Save/Cancel for convenience */}
                <div className="mt-8 flex justify-center gap-4">
                  <button className="btn-secondary" onClick={handleEditToggle} disabled={isSaving}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              // --- DISPLAY MODE ---
              <div className="space-y-8">
                {/* Head Section Display */}
                <section>
                  <h1 className="text-3xl sm:text-4xl font-bold text-text_black_primary mb-3">
                    {displayData?.head?.title}
                  </h1>
                  <p className="text-base sm:text-lg text-text_black_secondary leading-relaxed">
                    {displayData?.head?.description}
                  </p>
                </section>

                {/* Body Section Display */}
                <section className="border-t pt-8">
                  <h2 className="text-2xl sm:text-3xl font-light text-text_black_primary mb-6">
                    {displayData?.body?.title}
                  </h2>
                  <div className="space-y-10">
                    {displayData?.body?.list?.map((item, index) => (
                      <div
                        key={`track-display-${index}`}
                        className="flex flex-col md:flex-row gap-6 md:gap-8 items-start"
                      >
                        {/* Text Content */}
                        <div className="flex-1 space-y-4">
                          <h3 className="text-xl font-semibold text-primary_main">{item.title}</h3>
                          {/* Render paragraphs from text array */}
                          {item.text?.map((paragraph, pIndex) => (
                            <p key={pIndex} className="text-text_black_secondary leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        {/* Image Gallery for the track */}
                        {item.img && item.img.length > 0 && (
                          <div className="w-full md:w-1/3 grid grid-cols-2 gap-2 mt-2 md:mt-0">
                            {item.img.map((url, iIndex) => (
                              <img
                                key={iIndex}
                                src={url}
                                alt={`${item.title} image ${iIndex + 1}`}
                                className="w-full h-auto object-cover rounded shadow-sm aspect-square"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {(!displayData?.body?.list || displayData.body.list.length === 0) && (
                      <p className="text-gray-500 italic">No tracks defined.</p>
                    )}
                  </div>
                </section>
              </div>
            )
          ) : (
            // Message when content doesn't exist and not editing
            <div className="text-center text-gray-500 mt-10">
              About page content has not been created yet.
              {isAdmin ? " Click 'Edit Page' above to add content." : ""}
            </div>
          )}
        </div>
      )}
    </div> // End main page container
  );
};

// --- Reusable Form Field Components ---
const InputField = ({ label, path, value, onChange, placeholder = "" }) => (
  <div>
    <label htmlFor={path} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={path}
      name={path}
      value={value}
      onChange={(e) => onChange(path, e.target.value)}
      className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
};

const TextareaField = ({ label, path, value, onChange, rows = 3, placeholder = "" }) => (
  <div>
    <label htmlFor={path} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={path}
      name={path}
      value={value}
      onChange={(e) => onChange(path, e.target.value)}
      rows={rows}
      className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
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

// --- Main Component PropTypes (Optional but Recommended) ---
// Since structure is complex, defining detailed PropTypes can be verbose.
// Basic check for isAdmin might suffice if context provides it reliably.

export default About;
