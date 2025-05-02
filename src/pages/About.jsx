// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css"; // Ensure this import is relevant if used elsewhere
import { Down_left_dark_arrow } from "@/assets/";
import { MainCarousel, LoadingSpinner } from "@/components";
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";

// Helper to create a default structure if no data exists, matching the schema
const createDefaultAboutData = () => ({
  intro: { heading: "", description: "" }, // Schema: intro.heading, intro.description
  tracks: { title: "Research Tracks", buttons: [] }, // Schema: tracks.title, tracks.buttons (array)
  details: [{ title: "", description: "", image: "" }], // Schema: details is array of objects
});

// --- Main About Component ---
export const About = () => {
  // State for data from different sources
  const [aboutData, setAboutData] = useState(null); // Holds fetched /about content
  const [carouselSlides, setCarouselSlides] = useState([]); // Holds combined image URLs

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
    // Don't reset global error here unless it's critical
    try {
      const response = await fetch(`${BASE_URL}/about`);
      if (response.status === 404) {
        setAboutData(null); // Content doesn't exist yet
        return; // Successfully handled 404
      }
      if (!response.ok) {
        // Throw error only if it's not a 404
        throw new Error(`About fetch failed: ${response.status} ${await response.text()}`);
      }
      const data = await response.json();
      setAboutData(data); // Store fetched data
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      // Set error state only if it wasn't a 404 (handled above)
      setError("Failed to load about page content. Please try again later.");
    } finally {
      setLoadingAbout(false);
    }
  }, []); // Empty dependency array means this function reference is stable

  // Fetch images for the carousel from /news and /gallery
  const fetchCarouselImages = useCallback(async () => {
    setLoadingImages(true);
    // Don't reset global error here
    try {
      // Fetch concurrently, resolve to empty array on failure to avoid breaking carousel
      const results = await Promise.allSettled([
        fetch(`${BASE_URL}/news`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
        fetch(`${BASE_URL}/gallery`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
      ]);

      const [newsResult, galleryResult] = results;

      let fetchedNews = [];
      let fetchedGallery = [];

      // Process successful fetches
      if (newsResult.status === "fulfilled") {
        // Sort news by date if needed (descending)
        fetchedNews = newsResult.value.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        console.error("Failed to fetch news data for carousel:", newsResult.reason);
      }
      if (galleryResult.status === "fulfilled") {
        fetchedGallery = galleryResult.value; // Assuming gallery is pre-sorted or order doesn't matter
      } else {
        console.error("Failed to fetch gallery data for carousel:", galleryResult.reason);
      }

      // Extract images, limit, and combine
      const newsImages = fetchedNews
        .flatMap((item) => item.images || [])
        .filter(Boolean)
        .slice(0, 5);
      const galleryImages = fetchedGallery
        .flatMap((item) => item.images || [])
        .filter(Boolean)
        .slice(0, 5);
      setCarouselSlides([...newsImages, ...galleryImages]); // Update carousel state
    } catch (err) {
      console.error("Unexpected error fetching carousel images:", err);
      // Optionally set a specific error for images
      // setError("Failed to load images for carousel.");
    } finally {
      setLoadingImages(false);
    }
  }, []); // Empty dependency array, stable reference

  // Fetch data on component mount
  useEffect(() => {
    fetchAboutContent();
    fetchCarouselImages();
  }, [fetchAboutContent, fetchCarouselImages]); // Dependencies ensure fetch runs once

  // --- Admin Action Handlers ---

  // Toggle edit mode on/off
  const handleEditToggle = () => {
    if (!isEditing) {
      // Entering edit mode: Prepare data for the form
      // Use existing data or create default if none exists
      const dataToEdit = aboutData
        ? JSON.parse(JSON.stringify(aboutData))
        : createDefaultAboutData();

      // Ensure details array exists and has at least one item for the form
      if (!dataToEdit.details || dataToEdit.details.length === 0) {
        dataToEdit.details = [{ title: "", description: "", image: "" }];
      }
      // Convert tracks.buttons array to comma-separated string for textarea
      if (dataToEdit.tracks && Array.isArray(dataToEdit.tracks.buttons)) {
        dataToEdit.tracks.buttons = dataToEdit.tracks.buttons.join(", ");
      } else if (dataToEdit.tracks) {
        dataToEdit.tracks.buttons = ""; // Ensure it's a string if undefined/null
      }

      setEditedData(dataToEdit); // Set the form's state
    } else {
      // Cancelling edit mode: Clear temporary edits
      setEditedData(null);
    }
    setIsEditing(!isEditing); // Toggle the mode flag
    setError(null); // Clear any previous errors when toggling mode
  };

  // Generic handler to update nested state in editedData
  const handleInputChange = (path, value) => {
    setEditedData((prevData) => {
      // Using JSON parse/stringify for a deep copy is simple but can have limitations (e.g., Date objects, functions)
      const newData = JSON.parse(JSON.stringify(prevData));
      const keys = path.split(".");
      let current = newData;

      try {
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          // Basic handling for array index like 'details[0]'
          const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
          if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            if (!current[arrayKey]) current[arrayKey] = []; // Ensure array exists
            if (!current[arrayKey][index]) current[arrayKey][index] = {}; // Ensure object at index exists
            current = current[arrayKey][index];
          } else {
            if (typeof current[key] === "undefined" || current[key] === null) {
              current[key] = {}; // Ensure nested object exists
            }
            current = current[key];
          }
        }

        // Assign the value to the final key
        const finalKey = keys[keys.length - 1];
        const finalArrayMatch = finalKey.match(/^(\w+)\[(\d+)\]$/);
        if (finalArrayMatch) {
          const arrayKey = finalArrayMatch[1];
          const index = parseInt(finalArrayMatch[2], 10);
          if (!current[arrayKey]) current[arrayKey] = [];
          current[arrayKey][index] = value; // Might overwrite if it was an object
        } else {
          current[finalKey] = value;
        }
      } catch (e) {
        console.error("Error updating state path:", path, e);
        // Return previous data to avoid breaking state on error
        return prevData;
      }

      return newData;
    });
  };

  // Specific handlers for sub-components, calling the generic one
  const handleDetailsChange = (field, value) => handleInputChange(`details.0.${field}`, value);
  const handleTracksChange = (field, value) => handleInputChange(`tracks.${field}`, value);
  const handleIntroChange = (field, value) => handleInputChange(`intro.${field}`, value);

  // Handle saving the edited data (create or update)
  const handleSave = async () => {
    if (!editedData) return; // Should not happen if button is enabled
    setIsSaving(true);
    setError(null); // Clear previous save errors

    // Prepare data payload for API: deep copy and format adjustments
    const dataToSave = JSON.parse(JSON.stringify(editedData));

    // Convert tracks.buttons comma-separated string back to array
    if (dataToSave.tracks && typeof dataToSave.tracks.buttons === "string") {
      dataToSave.tracks.buttons = dataToSave.tracks.buttons
        .split(",")
        .map((s) => s.trim()) // Trim whitespace
        .filter(Boolean); // Remove empty strings resulting from extra commas
    } else if (dataToSave.tracks) {
      dataToSave.tracks.buttons = []; // Ensure it's an array if it wasn't a string
    }

    // Ensure 'intro.slides' is not sent if it exists (managed separately)
    if (dataToSave.intro) {
      delete dataToSave.intro.slides;
    }

    try {
      const response = await fetch(`${BASE_URL}/about`, {
        method: "PUT", // API uses PUT with upsert:true for create/update
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        // Throw detailed error
        throw new Error(`Failed to save: ${response.status} ${await response.text()}`);
      }

      const savedData = await response.json(); // Get the saved/updated data
      setAboutData(savedData); // Update the canonical state
      setIsEditing(false); // Exit edit mode
      setEditedData(null); // Clear temporary edit state
      alert("About page content saved successfully!");
    } catch (err) {
      console.error("Error saving about data:", err);
      setError(`Save failed: ${err.message}`);
      alert(`Save failed: ${err.message}`); // Show error to user
    } finally {
      setIsSaving(false); // Reset saving indicator
    }
  };

  // --- Render Logic ---

  // Determine which data source to use for display (live data or editing data)
  const displayData = isEditing ? editedData : aboutData;
  // Determine if the about content section can be shown
  const canShowAboutContent = !loadingAbout && (isEditing || aboutData);

  return (
    // Main container for the page
    <div className="flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full min-h-screen">
      {/* === Carousel Section === */}
      {/* Always occupies space, shows loading, images, or placeholder */}
      <div className="w-full max-w-4xl mb-6">
        {loadingImages && (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 animate-pulse">
            <LoadingSpinner message="Loading images..." />
          </div>
        )}
        {!loadingImages && carouselSlides.length > 0 && <MainCarousel slides={carouselSlides} />}
        {/* Placeholder if no images loaded and not loading */}
        {!loadingImages && carouselSlides.length === 0 && (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
            No images available for carousel.
          </div>
        )}
      </div>

      {/* === Admin Control Header (Edit/Cancel buttons) === */}
      {/* Positioned below carousel, above content */}
      {isAdmin && !isEditing && (
        <div className="w-full max-w-4xl mb-6 flex justify-center gap-4">
          {/* Main Edit/Save button */}
          <button
            className={`${
              isEditing
                ? "bg-green-600 hover:bg-green-700" // Save button style
                : "bg-blue-600 hover:bg-blue-700" // Edit button style
            } text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 disabled:opacity-50`}
            onClick={isEditing ? handleSave : handleEditToggle} // Action: Save or Enter Edit
            disabled={isSaving} // Disable while saving
          >
            Edit Page
          </button>
        </div>
      )}

      {/* === About Page Content Section === */}

      {/* Loading state for the About content */}
      {loadingAbout && (
        <div className="flex justify-center items-center flex-grow mt-8">
          <LoadingSpinner message="Loading content..." />
        </div>
      )}

      {/* Error state display */}
      {!loadingAbout && error && (
        <div className="flex justify-center items-center flex-grow px-4 mt-8 text-center text-red-600">
          Error: {error}
        </div>
      )}

      {/* Display content or edit form if not loading and no error */}
      {!loadingAbout && !error && canShowAboutContent && (
        <div className="w-full max-w-4xl">
          {" "}
          {/* Container for form/display sections */}
          {/* Intro Section */}
          <Intro
            introData={displayData?.intro} // Pass intro part of data
            isEditing={isEditing}
            onIntroChange={handleIntroChange} // Pass handler
          />
          {/* Tracks Section */}
          <Tracks
            tracksData={displayData?.tracks} // Pass tracks part of data
            isEditing={isEditing}
            onTracksChange={handleTracksChange} // Pass handler
          />
          {/* Details Section (handling first item) */}
          <Details
            detailsItem={displayData?.details?.[0]} // Pass first details item
            isEditing={isEditing}
            onDetailsChange={handleDetailsChange} // Pass handler
          />
          {/* Bottom Save/Cancel buttons (visible only during editing) */}
          {isAdmin && isEditing && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 disabled:opacity-50"
                onClick={handleEditToggle} // Action: Cancel Edit
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors duration-200 disabled:opacity-50"
                onClick={handleSave} // Action: Save
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div> // End content container
      )}

      {/* Message shown if content doesn't exist and not in edit mode */}
      {!loadingAbout && !error && !isEditing && !aboutData && (
        <div className="flex justify-center items-center flex-grow px-4 mt-8 text-center text-gray-500">
          About page content has not been created yet.
          {/* Prompt admin to start editing */}
          {isAdmin ? " Click 'Edit Page' above to add content." : ""}
        </div>
      )}
    </div> // End main page container
  );
};

// --- Intro Sub-Component ---
// Displays/Edits intro.heading and intro.description
const Intro = ({ introData, isEditing, onIntroChange }) => {
  // Safely destructure with default values
  const { heading = "", description = "" } = introData || {};

  return (
    // w-full ensures it takes the width of the parent container (max-w-4xl)
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-8 w-full border-t border-gray-200 mt-6">
      {/* Heading Field/Display */}
      {isEditing ? (
        <div>
          <label htmlFor="introHeading" className="block text-sm font-medium text-gray-700 mb-1">
            Intro Heading
          </label>
          <input
            id="introHeading"
            type="text"
            value={heading}
            onChange={(e) => onIntroChange("heading", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Enter intro heading"
          />
        </div>
      ) : (
        // Only render if heading has content
        heading && (
          <h2 className="text-xl sm:text-2xl font-semibold text-text_black_primary">{heading}</h2>
        )
      )}
      {/* Description Field/Display */}
      {isEditing ? (
        <div>
          <label
            htmlFor="introDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Intro Description
          </label>
          <textarea
            id="introDescription"
            value={description}
            onChange={(e) => onIntroChange("description", e.target.value)}
            className="border border-gray-300 p-2 w-full rounded text-base shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            rows="5"
            placeholder="Enter introduction description"
          />
        </div>
      ) : (
        // Display description or placeholder if empty
        <h3 className="text-base sm:text-lg text-text_black_secondary leading-relaxed">
          {description ||
            (isAdmin && !isEditing ? (
              <span className="italic text-gray-400">No description provided.</span>
            ) : (
              ""
            ))}
        </h3>
      )}
    </div>
  );
};
// PropTypes for Intro component
Intro.propTypes = {
  introData: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string,
  }), // introData can be null or undefined initially
  isEditing: PropTypes.bool.isRequired,
  onIntroChange: PropTypes.func.isRequired,
};

// --- Tracks Sub-Component ---
// Displays/Edits tracks.title and tracks.buttons
const Tracks = ({ tracksData, isEditing, onTracksChange }) => {
  // Safely destructure with defaults
  const { title = "Research Tracks", buttons = "" } = tracksData || {};
  // Prepare button array for display mode
  const displayButtons =
    typeof buttons === "string"
      ? buttons
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-8 w-full border-t border-gray-200">
      {/* Section Title Field/Display */}
      <div className="flex items-end justify-between">
        {isEditing ? (
          <div className="flex-grow mr-4">
            <label htmlFor="tracksTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Tracks Section Title
            </label>
            <input
              id="tracksTitle"
              type="text"
              value={title}
              onChange={(e) => onTracksChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter tracks title"
            />
          </div>
        ) : (
          // Render title if it exists
          <h2 className="text-2xl sm:text-3xl font-light text-text_black_primary">{title}</h2>
        )}
        {/* Icon */}
        <Down_left_dark_arrow className="size-10 sm:size-12 lg:size-[51px] shrink-0" />
      </div>

      {/* Track Buttons Field/Display */}
      {isEditing ? (
        <div>
          <label htmlFor="tracksButtons" className="block text-sm font-medium text-gray-700 mb-1">
            Track Buttons (comma-separated)
          </label>
          <textarea
            id="tracksButtons"
            value={buttons} // Edit the comma-separated string
            onChange={(e) => onTracksChange("buttons", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-base shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            rows="3"
            placeholder="Enter track names, separated by commas"
          />
        </div>
      ) : (
        // Display parsed buttons or placeholder
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
          {displayButtons.length > 0
            ? displayButtons.map((track) => (
                <button
                  key={track}
                  className="border border-primary_main text-primary_main px-4 py-1 sm:px-5 sm:py-1.5 rounded-full hover:bg-primary_main hover:text-white transition-colors duration-200 cursor-default" // Non-interactive in display mode
                  disabled // Explicitly disable interaction
                >
                  {track}
                </button>
              ))
            : // Show placeholder only if not editing
              !isEditing && <p className="text-gray-500 italic w-full">No tracks defined.</p>}
        </div>
      )}
    </div>
  );
};
// PropTypes for Tracks component
Tracks.propTypes = {
  tracksData: PropTypes.shape({
    title: PropTypes.string,
    // Buttons can be string during edit, array otherwise (though API expects array)
    buttons: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }), // tracksData can be null/undefined
  isEditing: PropTypes.bool.isRequired,
  onTracksChange: PropTypes.func.isRequired,
};

// --- Details Sub-Component ---
// Displays/Edits fields for the first item in the details array
const Details = ({ detailsItem, isEditing, onDetailsChange }) => {
  // Safely destructure first item with defaults
  const { title = "", description = "", image = "" } = detailsItem || {};

  return (
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-8 w-full border-t border-gray-200">
      {/* Background Image Display (only when not editing) */}
      {!isEditing && image && (
        <div
          className="w-full h-48 sm:h-64 bg-cover bg-center rounded-lg mb-4 shadow"
          style={{ backgroundImage: `url(${image})` }}
          aria-label={`Background for ${title || "Details Section"}`}
        ></div>
      )}

      {/* Title Field/Display */}
      {isEditing ? (
        <div>
          <label htmlFor="detailsTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Details Section Title
          </label>
          <input
            id="detailsTitle"
            type="text"
            value={title}
            onChange={(e) => onDetailsChange("title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Enter details section title"
          />
        </div>
      ) : (
        // Render title if it exists
        <h1 className="text-2xl sm:text-3xl font-bold text-text_black_primary">
          {title ||
            (isAdmin && !isEditing ? (
              <span className="italic text-gray-400">No Title Provided</span>
            ) : (
              ""
            ))}
        </h1>
      )}

      {/* Description Field/Display */}
      {isEditing ? (
        <div>
          <label
            htmlFor="detailsDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Details Section Description
          </label>
          <textarea
            id="detailsDescription"
            value={description}
            onChange={(e) => onDetailsChange("description", e.target.value)}
            className="border border-gray-300 p-2 w-full rounded text-base shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            rows="8"
            placeholder="Enter details description"
          />
        </div>
      ) : (
        // Display description or placeholder
        <h3 className="text-base sm:text-lg text-text_black_secondary leading-relaxed">
          {description ||
            (isAdmin && !isEditing ? (
              <span className="italic text-gray-400">No description provided.</span>
            ) : (
              ""
            ))}
        </h3>
      )}

      {/* Image URL Field (only in edit mode) */}
      {isEditing && (
        <div>
          <label htmlFor="detailsImage" className="block text-sm font-medium text-gray-700 mb-1">
            Details Section Background Image URL
          </label>
          <input
            id="detailsImage"
            type="text"
            value={image}
            onChange={(e) => onDetailsChange("image", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Enter image URL (e.g., https://...)"
          />
        </div>
      )}
    </div>
  );
};
// PropTypes for Details component
Details.propTypes = {
  detailsItem: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }), // detailsItem can be null or undefined
  isEditing: PropTypes.bool.isRequired,
  onDetailsChange: PropTypes.func.isRequired,
};

export default About; // Export the main component
