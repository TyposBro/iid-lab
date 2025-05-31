/* eslint-disable no-unused-vars */
// {PATH_TO_THE_PROJECT}/frontend/src/pages/News.jsx

import { useState, useEffect, useCallback, useMemo } from "react"; // Added useCallback, useMemo
import PropTypes from "prop-types";
import { Filter, MainCarousel, Markdown, LoadingSpinner, AdminMetaControls } from "@/components/"; // Added AdminMetaControls
import { Down_left_dark_arrow } from "@/assets/";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-override.css"; // Optional: Add a CSS file for custom DatePicker styles if needed

export const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // For news items
  const [error, setError] = useState(null); // For news items
  const [selected, setSelected] = useState("Latest");
  const [limit, setLimit] = useState(5);
  const { isAdmin } = useAdmin();

  // --- Meta Data State and Fetching ---
  const [newsMeta, setNewsMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultNewsMeta = useMemo(
    () => ({
      title: "",
      description: "",
    }),
    []
  );

  const fetchNewsMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/news`); // Ensure this endpoint exists
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("News meta data not found, using defaults.");
          setNewsMeta(defaultNewsMeta);
          document.title = defaultNewsMeta.title + " - I&I Design Lab";
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setNewsMeta(data);
        document.title = (data.title || defaultNewsMeta.title) + " - I&I Design Lab";
      }
    } catch (err) {
      setMetaError(err.message);
      console.error("Failed to fetch news meta:", err);
      setNewsMeta(defaultNewsMeta);
      document.title = defaultNewsMeta.title + " - I&I Design Lab";
    } finally {
      setMetaLoading(false);
    }
  }, [defaultNewsMeta]);

  useEffect(() => {
    fetchNewsMeta();
  }, [fetchNewsMeta, refreshMetaKey]);

  const handleMetaUpdated = () => {
    setRefreshMetaKey((prev) => prev + 1);
  };
  // --- End Meta Data ---

  // Fetching News Items Logic
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true); // Ensure loading is true at the start for news items
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/news`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Sort news by date descending by default
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sortedData);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false); // End loading for news items
    }
  };

  const refetchNews = () => {
    fetchNews(); // Simply re-run the fetch for news items
  };

  // Use resolved meta or defaults for display
  const currentMetaTitle = newsMeta?.title || defaultNewsMeta.title;
  const currentMetaDescription = newsMeta?.description || defaultNewsMeta.description;

  // Prepare data for components
  const slides = events.flatMap((event) => event.images || []).filter(Boolean);
  const uniqueTypes = ["Latest", ...new Set(events.map((event) => event.type))];

  const filteredEvents =
    selected === "Latest"
      ? events // Already sorted by date
      : events.filter((event) => event.type === selected); // Keeps original sort order (date)

  // Handlers
  const loadMore = () => {
    setLimit((prev) => Math.min(prev + 5, filteredEvents.length)); // Ensure limit doesn't exceed length
  };

  const changeSelected = (value) => {
    setSelected(value);
    setLimit(5); // Reset limit when filter changes
  };

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] pb-12 sm:pb-16 w-full min-h-screen px-4 sm:px-6 lg:px-7 gap-6 sm:gap-8">
      {/* META ADMIN CONTROLS - START */}
      {isAdmin && newsMeta && (
        <AdminMetaControls
          pageIdentifier="news" // Unique identifier for this page's meta
          initialData={newsMeta}
          fieldsConfig={[
            { name: "title", label: "News Page Title", type: "text" },
            {
              name: "description",
              label: "News Page Description (shown below title)",
              type: "textarea",
            },
          ]}
          onUpdateSuccess={handleMetaUpdated}
          containerClass="w-full max-w-4xl mx-auto py-2 bg-gray-50 rounded-b-lg shadow mb-4"
        />
      )}
      {/* META ADMIN CONTROLS - END */}

      {/* Display loading or error for meta if applicable */}
      {metaLoading && (
        <div className="flex justify-center items-center min-h-[200px] w-full">
          <LoadingSpinner message="Loading page details..." />
        </div>
      )}
      {metaError && !metaLoading && (
        <div className="p-6 text-center text-red-500 w-full">
          Error loading page details: {metaError}. Displaying default content.
        </div>
      )}

      {/* Render page content once meta (even default) is resolved */}
      {(!metaLoading || newsMeta) && (
        <>
          <Intro
            slides={slides}
            titleText={currentMetaTitle}
            descriptionText={currentMetaDescription}
          />

          {/* Loading and Error States for News Items */}
          {loading &&
            !metaLoading && ( // Show news loading only if meta is done
              <div className="flex justify-center items-center min-h-screen pt-[95px] pb-12">
                <LoadingSpinner message="Loading News..." />
              </div>
            )}
          {error &&
            !metaLoading && ( // Show news error only if meta is done
              <div className="flex justify-center items-center min-h-screen pt-[95px] pb-12 px-4 text-center text-red-600">
                Error loading news: {error}
              </div>
            )}

          {/* Render news items and admin controls only when news items are not loading and no error */}
          {!loading && !error && (
            <>
              {isAdmin && (
                <AdminNewsControls
                  events={events}
                  setEvents={setEvents}
                  refetchNews={refetchNews}
                />
              )}

              <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-4xl">
                <h2 className="flex justify-between items-end text-5xl text-text_black_primary font-medium">
                  <span>Latest News</span>
                  <Down_left_dark_arrow className="size-10 sm:size-12 lg:size-[51px] shrink-0" />
                </h2>
                <Filter selected={selected} setSelected={changeSelected} list={uniqueTypes} />
                <div className="flex flex-col gap-6 sm:gap-8">
                  {filteredEvents.length > 0 ? (
                    filteredEvents
                      .slice(0, limit)
                      .map((event) => <Event key={event._id || event.title} event={event} />)
                  ) : (
                    <p className="text-center text-gray-500 py-6">
                      No news items found{selected !== "Latest" ? ` for type "${selected}"` : ""}.
                    </p>
                  )}
                </div>
              </div>

              {limit < filteredEvents.length && (
                <button
                  className="flex justify-center items-center w-full max-w-xs h-12 text-base sm:text-lg font-bold text-primary_main bg-primary_light rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  onClick={loadMore}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

// Modified Intro Component
const Intro = ({ slides, titleText, descriptionText }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-8 w-full max-w-4xl">
      <div className="flex justify-between items-end">
        <h1 className="text-5xl text-text_black_primary font-semibold">{titleText}</h1>{" "}
        {/* Use h1 for main page title */}
        <Down_left_dark_arrow className="size-10 sm:size-12 lg:size-[51px] shrink-0" />
      </div>
      {descriptionText && (
        <p className="text-lg text-text_black_secondary mt-1">{descriptionText}</p>
      )}
      {slides.length > 0 && <MainCarousel slides={slides} />}
    </div>
  );
};

Intro.propTypes = {
  slides: PropTypes.array.isRequired,
  titleText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string,
};

const Event = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const TRUNCATE_LENGTH = 200; // Increased character limit for news

  const displayDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const needsTruncation = event.content && event.content.length > TRUNCATE_LENGTH;
  let displayedContent = event.content;

  if (needsTruncation && !isExpanded) {
    let lastSpace = event.content.lastIndexOf(" ", TRUNCATE_LENGTH);
    displayedContent =
      event.content.substring(0, lastSpace > 0 ? lastSpace : TRUNCATE_LENGTH) + "...";
  }

  return (
    <div className="w-full relative border rounded-2xl shadow-sm overflow-hidden bg-white">
      {" "}
      {/* Added bg-white and shadow */}
      {event?.images?.length > 0 && (
        // Image carousel/slider at the top of the card
        <div className="w-full h-60 overflow-x-auto flex snap-x snap-mandatory no-scrollbar">
          {event.images.map((image, index) => (
            <div key={image || index} className="snap-center flex-shrink-0 w-full h-full">
              <img
                src={image}
                className="w-full h-full object-cover bg-gray-200"
                alt={`${event.title} - image ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
      {/* Content Area */}
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        {" "}
        {/* Consistent padding */}
        <div className="flex justify-between text-text_black_secondary text-sm">
          <span>{displayDate}</span>
          <span className="font-bold uppercase text-xs tracking-wider px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {" "}
            {/* Styled type */}
            {event.type}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-text_black_primary">{event.title}</h3>{" "}
        {/* Use h3 for event title */}
        <div className="prose prose-sm sm:prose-base max-w-none">
          {" "}
          {/* Tailwind typography for markdown */}
          <Markdown markdown={displayedContent} />
        </div>
        {needsTruncation && (
          <button
            onClick={toggleExpand}
            className="self-start text-primary_main hover:text-primary_dark font-semibold mt-2 text-sm" // Simplified button
          >
            {isExpanded ? "Show Less" : "Learn More"}
          </button>
        )}
      </div>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

// --- Admin UI Component for News (with basic responsive tweaks) ---
const AdminNewsControls = ({ events, setEvents, refetchNews }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newType, setNewType] = useState("");
  const { adminToken } = useAdmin();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imagesToKeep, setImagesToKeep] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isEditing && editingEvent) {
      setImagesToKeep(editingEvent.images || []);
    } else {
      setImagesToKeep([]);
    }
  }, [isEditing, editingEvent]);

  useEffect(() => {
    const previews = [];
    if (selectedFiles && typeof selectedFiles[Symbol.iterator] === "function") {
      for (let i = 0; i < selectedFiles.length; i++) {
        previews.push(URL.createObjectURL(selectedFiles[i]));
      }
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setImagesToKeep((prevImages) => prevImages.filter((url) => url !== imageUrlToRemove));
  };

  const handleRemoveNewImagePreview = (indexToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleCreate = async () => {
    if (!newDate || !newTitle || !newContent || !newType || selectedFiles.length === 0) {
      alert("Please fill in all fields and select at least one image.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Image upload failed: ${errorData?.message || uploadResponse.statusText}`);
      }
      const uploadedImageUrls = await uploadResponse.json();
      const isoDate = newDate.toISOString().split("T")[0];
      const newEventData = {
        title: newTitle,
        content: newContent,
        date: isoDate,
        images: uploadedImageUrls,
        type: newType,
      };
      const createResponse = await fetch(`${BASE_URL}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newEventData),
      });
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(
          `Failed to create news item: ${errorData?.message || createResponse.statusText}`
        );
      }
      setIsCreating(false);
      setNewTitle("");
      setNewContent("");
      setNewDate(null);
      setSelectedFiles([]);
      setNewType("");
      setImagePreviews([]);
      refetchNews();
    } catch (error) {
      console.error("Error creating news item:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewContent(event.content);
    setNewDate(event.date ? new Date(event.date) : null);
    setNewType(event.type);
    setImagesToKeep(event.images || []);
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleUpdate = async () => {
    if (!editingEvent || !newDate) return;
    if (!newTitle || !newContent || !newType) {
      alert("Please fill in all fields.");
      return;
    }
    if (imagesToKeep.length === 0 && selectedFiles.length === 0) {
      alert("Please keep or add at least one image.");
      return;
    }
    setIsSubmitting(true);
    let newImageUrls = [];
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));
      try {
        const uploadResponse = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${adminToken}` },
          body: formData,
        });
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(
            `Image upload failed: ${errorData?.message || uploadResponse.statusText}`
          );
        }
        newImageUrls = await uploadResponse.json();
      } catch (error) {
        console.error("Error uploading new images:", error);
        alert(`Failed to upload new images: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
    }
    const isoDate = newDate.toISOString().split("T")[0];
    const updatedEventData = {
      title: newTitle,
      content: newContent,
      date: isoDate,
      images: [...imagesToKeep, ...newImageUrls],
      type: newType,
    };
    try {
      const response = await fetch(`${BASE_URL}/news/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatedEventData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update news item: ${errorData?.message || response.statusText}`);
      }
      setIsEditing(false);
      setEditingEvent(null);
      setNewTitle("");
      setNewContent("");
      setNewDate(null);
      setSelectedFiles([]);
      setNewType("");
      setImagesToKeep([]);
      setImagePreviews([]);
      refetchNews();
    } catch (error) {
      console.error("Error updating news item:", error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      setDeletingId(id);
      try {
        const response = await fetch(`${BASE_URL}/news/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to delete news item: ${errorData?.message || response.statusText}`
          );
        }
        refetchNews();
      } catch (error) {
        console.error("Error deleting news item:", error);
        alert(`Failed to delete: ${error.message}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingEvent(null);
    setNewTitle("");
    setNewContent("");
    setNewDate(null);
    setSelectedFiles([]);
    setNewType("");
    setImagesToKeep([]);
    setImagePreviews([]);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewTitle("");
    setNewContent("");
    setNewDate(null);
    setSelectedFiles([]);
    setNewType("");
    setImagePreviews([]);
  };

  // Styling for form elements
  const inputClass =
    "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100";
  const buttonClass =
    "font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50";
  const primaryButtonClass = `bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`;
  const secondaryButtonClass = `bg-gray-200 hover:bg-gray-300 text-gray-700 ${buttonClass}`;
  const dangerButtonClass = `bg-red-600 hover:bg-red-700 text-white ${buttonClass} text-xs`;
  const warningButtonClass = `bg-yellow-500 hover:bg-yellow-600 text-white ${buttonClass} text-xs`;
  const successButtonClass = `bg-green-600 hover:bg-green-700 text-white ${buttonClass}`;

  return (
    <div className="p-4 sm:p-6 border rounded-lg shadow-lg w-full bg-gray-50 mb-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">Admin: Manage News</h3>
        {!isCreating && !isEditing && (
          <button
            onClick={() => {
              setIsCreating(true);
              setIsEditing(false);
            }}
            className={successButtonClass}
            disabled={isSubmitting || deletingId !== null}
          >
            + Add News
          </button>
        )}
      </div>

      {(isSubmitting || deletingId !== null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingSpinner
            message={isSubmitting ? (isCreating ? "Creating..." : "Updating...") : "Deleting..."}
          />
        </div>
      )}

      {!isCreating && !isEditing && (
        <div className="w-full space-y-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="border border-gray-200 rounded-md p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 flex-grow min-w-0">
                {" "}
                {/* Added min-w-0 for better flex behavior */}
                {event.images && event.images.length > 0 && (
                  <img
                    src={event.images[0]}
                    alt=""
                    className="w-16 h-16 object-cover rounded flex-shrink-0 border border-gray-100"
                  />
                )}
                <div className="flex-grow overflow-hidden">
                  {" "}
                  {/* Added overflow-hidden */}
                  <p className="font-semibold text-gray-800 truncate" title={event.title}>
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({event.date ? new Date(event.date).toLocaleDateString() : "No Date"}) -{" "}
                    {event.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-end md:self-center mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(event)}
                  className={warningButtonClass}
                  disabled={isSubmitting || deletingId !== null}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className={`${dangerButtonClass} ${
                    deletingId === event._id ? "opacity-50 cursor-wait" : ""
                  }`}
                  disabled={isSubmitting || deletingId === event._id}
                >
                  {deletingId === event._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-gray-500 italic text-center py-4">
              No news items yet. Click &quot;Add News&quot; to create one.
            </p>
          )}
        </div>
      )}

      {(isCreating || isEditing) && (
        <div className="p-4 border border-gray-200 rounded-md mt-4 bg-white shadow-sm space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {isCreating ? "Create New News Item" : "Edit News Item"}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Content (Markdown supported)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className={`${inputClass} h-40`}
            disabled={isSubmitting}
          />
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor={isCreating ? "create-date" : "edit-date"}
            >
              Date
            </label>
            <DatePicker
              id={isCreating ? "create-date" : "edit-date"}
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className={inputClass}
              wrapperClassName="w-full"
              disabled={isSubmitting}
            />
          </div>
          <input
            type="text"
            placeholder="Type (e.g., Awards, Conference)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />

          {isEditing && imagesToKeep.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Current Images (Click X to remove)
              </label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                {imagesToKeep.map((imageUrl, idx) => (
                  <div key={`existing-${idx}`} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Existing ${idx}`}
                      className="w-24 h-20 object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(imageUrl)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none hover:bg-red-600"
                      title="Remove image"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor={isCreating ? "create-images" : "edit-images"}
            >
              {isEditing ? "Add New Images" : "Images (select multiple)"}
            </label>
            <input
              type="file"
              id={isCreating ? "create-images" : "edit-images"}
              multiple
              onChange={handleFileChange}
              className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
              disabled={isSubmitting}
            />
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap mt-2 gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                {imagePreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative">
                    <img
                      src={preview}
                      alt={`New Preview ${idx}`}
                      className="w-24 h-20 object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImagePreview(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none hover:bg-red-600"
                      title="Remove image"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={isCreating ? handleCreate : handleUpdate}
              className={primaryButtonClass}
              disabled={isSubmitting}
            >
              {isCreating ? "Create" : "Update"}
            </button>
            <button
              onClick={isCreating ? cancelCreating : cancelEditing}
              className={secondaryButtonClass}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AdminNewsControls.propTypes = {
  events: PropTypes.array.isRequired,
  setEvents: PropTypes.func.isRequired,
  refetchNews: PropTypes.func.isRequired,
};

export default News;
