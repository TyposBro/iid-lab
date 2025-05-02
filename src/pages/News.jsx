// {PATH_TO_THE_PROJECT}/frontend/src/pages/News.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Filter, MainCarousel, Markdown, LoadingSpinner } from "@/components/"; // Assume Filter & MainCarousel are responsive
import { Down_left_dark_arrow } from "@/assets/";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-override.css"; // Optional: Add a CSS file for custom DatePicker styles if needed

export const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("Latest");
  const [limit, setLimit] = useState(5);
  const { isAdmin } = useAdmin(); // Removed unused adminToken here

  // Fetching Logic (Keep as is)
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true); // Ensure loading is true at the start
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
      // console.log("Fetched events:", sortedData);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch function passed to Admin controls
  const refetchNews = () => {
    fetchNews(); // Simply re-run the fetch
  };

  // Loading and Error States
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-[95px] pb-12">
        <LoadingSpinner message="Loading News..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-[95px] pb-12 px-4 text-center text-red-600">
        Error loading news: {error}
      </div>
    );
  }

  // Prepare data for components
  const slides = events.flatMap((event) => event.images || []).filter(Boolean); // Use flatMap and handle potentially missing images array
  const uniqueTypes = ["Latest", ...new Set(events.map((event) => event.type))];

  // Filter events based on selection
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
    // Responsive main container: padding, top/bottom space, min-height, gap
    <div className="flex flex-col justify-start items-center pt-[95px] pb-12 sm:pb-16 w-full min-h-screen px-4 sm:px-6 lg:px-7 gap-6 sm:gap-8">
      <Intro slides={slides} />

      {/* Only render Admin controls if user is admin */}
      {isAdmin && (
        <AdminNewsControls events={events} setEvents={setEvents} refetchNews={refetchNews} />
      )}

      {/* Filter and Events List */}
      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-4xl">
        {" "}
        {/* Added max-width for readability */}
        {/* Assume Filter component is responsive */}
        <Filter selected={selected} setSelected={changeSelected} list={uniqueTypes} />
        {/* Events List */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.slice(0, limit).map((event) => (
              <Event key={event._id || event.title} event={event} /> // Use _id if available
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              No news items found{selected !== "Latest" ? ` for type "${selected}"` : ""}.
            </p>
          )}
        </div>
      </div>

      {/* Load More Button */}
      {limit < filteredEvents.length && (
        <button
          className="flex justify-center items-center w-full max-w-xs h-12 text-base sm:text-lg font-bold text-primary_main bg-primary_light rounded-lg hover:bg-blue-200 transition-colors duration-200"
          onClick={loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};

// Intro Component with Responsive Title/Icon/Padding
const Intro = ({ slides }) => {
  return (
    // Responsive padding and gap
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-8 w-full max-w-4xl">
      {" "}
      {/* Added max-width */}
      {/* Responsive heading and icon */}
      <h2 className="flex justify-between items-end text-3xl sm:text-4xl lg:text-5xl text-text_black_primary leading-tight lg:leading-[48px] tracking-normal">
        <span>News</span>
        <Down_left_dark_arrow className="size-10 sm:size-12 lg:size-[51px] shrink-0" />
      </h2>
      {/* Conditionally render carousel only if there are slides */}
      {slides.length > 0 && <MainCarousel slides={slides} />}
    </div>
  );
};

Intro.propTypes = {
  slides: PropTypes.array.isRequired,
};

// Event Component with Responsive Text/Images/Margin
const Event = ({ event }) => {
  // Format date for display (optional, depends on desired format)
  const displayDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        // Example formatting
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  return (
    // Responsive gap and padding
    <div className="flex flex-col gap-3 sm:gap-4 py-2 w-full">
      {/* Date and Type row - Responsive text */}
      <div className="flex justify-between text-text_black_secondary text-xs sm:text-sm">
        <span>{displayDate}</span>
        <span className="font-bold">{event.type}</span>
      </div>

      {/* Image horizontal scroll - Responsive image width */}
      {event?.images?.length > 0 && (
        <div className="w-full overflow-x-auto flex space-x-2 sm:space-x-3 no-scrollbar">
          {event.images.map((image, index) => (
            <img
              key={image || index} // Use image URL as key, fallback to index
              src={image}
              // Responsive width, ensure shrink-0
              className="shrink-0 w-[60%] sm:w-56 h-auto rounded-[15px] sm:rounded-[20px] object-cover bg-gray-200" // Added aspect ratio / bg color
              alt={`${event.title} - image ${index + 1}`}
              loading="lazy" // Add lazy loading
            />
          ))}
        </div>
      )}

      {/* Title - Responsive text */}
      <div className="text-lg sm:text-xl font-bold">{event.title}</div>

      {/* Content - Assume Markdown component handles responsive text */}
      <Markdown markdown={event.content} />

      {/* Separator - Responsive margin */}
      <div className="h-[2px] sm:h-[3px] border-y border-primary_main border-solid rounded mx-4 sm:mx-8 my-2" />
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

  // Effects for managing previews and existing images (Keep as is)
  useEffect(() => {
    if (isEditing && editingEvent) {
      setImagesToKeep(editingEvent.images || []);
    } else {
      setImagesToKeep([]);
    }
  }, [isEditing, editingEvent]);

  useEffect(() => {
    const previews = [];
    // Check if selectedFiles is iterable
    if (selectedFiles && typeof selectedFiles[Symbol.iterator] === "function") {
      for (let i = 0; i < selectedFiles.length; i++) {
        previews.push(URL.createObjectURL(selectedFiles[i]));
      }
      setImagePreviews(previews);
    } else {
      // Handle case where selectedFiles is not iterable (e.g., null or not an array)
      setImagePreviews([]);
    }

    // Cleanup function
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // Handlers (Create, Edit, Update, Delete, FileChange - Keep logic as is, ensure BASE_URL and token are used)
  const handleFileChange = (event) => {
    // Ensure files exist and are Array-like before spreading
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setImagesToKeep((prevImages) => prevImages.filter((url) => url !== imageUrlToRemove));
  };

  const handleRemoveNewImagePreview = (indexToRemove) => {
    // Remove the file from selectedFiles
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    // Previews will update automatically via useEffect
  };

  const handleCreate = async () => {
    // Validation (Keep as is)
    if (!newDate || !newTitle || !newContent || !newType || selectedFiles.length === 0) {
      alert("Please fill in all fields and select at least one image.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file)); // Use forEach

    try {
      // Upload images
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

      // Format date and create event data
      const isoDate = newDate.toISOString().split("T")[0];
      const newEventData = {
        title: newTitle,
        content: newContent, // Ensure backend expects 'content'
        date: isoDate,
        images: uploadedImageUrls,
        type: newType,
      };

      // Create news item
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

      // Reset form and refetch
      setIsCreating(false);
      setNewTitle("");
      setNewContent("");
      setNewDate(null);
      setSelectedFiles([]);
      setNewType("");
      setImagePreviews([]); // Previews cleared by selectedFiles change
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
    setIsCreating(false); // Ensure not in creating mode
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewContent(event.content); // Assuming backend uses 'content'
    setNewDate(event.date ? new Date(event.date) : null);
    setNewType(event.type);
    setImagesToKeep(event.images || []);
    setSelectedFiles([]); // Reset new files
    setImagePreviews([]); // Reset new previews
  };

  const handleUpdate = async () => {
    if (!editingEvent || !newDate) return;
    if (!newTitle || !newContent || !newType) {
      alert("Please fill in all fields.");
      return;
    }
    // Check if there are any images left (existing + new)
    if (imagesToKeep.length === 0 && selectedFiles.length === 0) {
      alert("Please keep or add at least one image.");
      return;
    }

    setIsSubmitting(true);
    let newImageUrls = [];

    // Upload new files if any
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

    // Prepare updated data
    const isoDate = newDate.toISOString().split("T")[0];
    const updatedEventData = {
      title: newTitle,
      content: newContent, // Use 'content' if that's what backend expects
      date: isoDate,
      images: [...imagesToKeep, ...newImageUrls], // Combine kept and new images
      type: newType,
    };

    // Send update request
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

      // Reset form and refetch
      setIsEditing(false);
      setEditingEvent(null);
      setNewTitle("");
      setNewContent("");
      setNewDate(null);
      setSelectedFiles([]);
      setNewType("");
      setImagesToKeep([]);
      setImagePreviews([]); // Cleared by selectedFiles change
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
        refetchNews(); // Refetch after successful delete
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
    // Optionally reset form fields
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
    // Reset form fields
    setNewTitle("");
    setNewContent("");
    setNewDate(null);
    setSelectedFiles([]);
    setNewType("");
    setImagePreviews([]);
  };

  return (
    // Add border, padding, max-width for admin section clarity
    <div className="p-4 border rounded-lg shadow-md w-full max-w-4xl bg-gray-50 mb-6">
      {/* Loading overlay for submitting/deleting */}
      {(isSubmitting || deletingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingSpinner
            message={isSubmitting ? (isCreating ? "Creating..." : "Updating...") : "Deleting..."}
          />
        </div>
      )}

      {/* "Add New" Button - Hidden when creating/editing */}
      {!isCreating && !isEditing && (
        <button
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false); /* Reset potentially needed */
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors duration-200 disabled:opacity-50"
          disabled={isSubmitting || deletingId}
        >
          Add New News Item
        </button>
      )}

      {/* List of existing items for editing/deleting - Only show when not creating/editing */}
      {!isCreating && !isEditing && (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event._id}
              className="border rounded p-2 sm:p-3 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <p className="flex-grow">
                <strong className="block sm:inline">{event.title}</strong>
                <span className="text-sm text-gray-600 ml-0 sm:ml-2">
                  ({event.date ? new Date(event.date).toLocaleDateString() : "No Date"}) -{" "}
                  {event.type}
                </span>
              </p>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs sm:text-sm transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting || deletingId}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs sm:text-sm transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting || deletingId === event._id}
                >
                  {deletingId === event._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-gray-500 italic">No news items yet.</p>}
        </div>
      )}

      {/* --- Create Form --- */}
      {isCreating && (
        <div className="p-4 border rounded mt-4 bg-white space-y-3">
          <h3 className="text-xl font-semibold mb-3">Create New News Item</h3>
          {/* Common Form Fields Component could be extracted */}
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Content (Markdown supported)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSubmitting}
          />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="create-date">
              Date
            </label>
            <DatePicker
              id="create-date"
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              wrapperClassName="w-full"
              disabled={isSubmitting}
            />
          </div>
          <input
            type="text"
            placeholder="Type (e.g., Awards, Conference)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSubmitting}
          />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="create-images">
              Images
            </label>
            <input
              type="file"
              id="create-images"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {/* New Image Previews */}
            <div className="flex flex-wrap mt-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`New Preview ${index}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImagePreview(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* --- End Common Fields --- */}
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Create
            </button>
            <button
              onClick={cancelCreating}
              className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- Edit Form --- */}
      {isEditing && editingEvent && (
        <div className="p-4 border rounded mt-4 bg-white space-y-3">
          <h3 className="text-xl font-semibold mb-3">Edit News Item</h3>
          {/* Common Form Fields Component could be extracted */}
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Content (Markdown supported)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSubmitting}
          />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-date">
              Date
            </label>
            <DatePicker
              id="edit-date"
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              wrapperClassName="w-full"
              disabled={isSubmitting}
            />
          </div>
          <input
            type="text"
            placeholder="Type (e.g., Awards, Conference)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSubmitting}
          />

          {/* Existing Images Preview */}
          {imagesToKeep.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Existing Images (Click X to remove)
              </label>
              <div className="flex flex-wrap gap-2">
                {imagesToKeep.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Existing Image ${index}`}
                      className="w-24 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(imageUrl)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none hover:bg-red-600"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-images">
              Add New Images
            </label>
            <input
              type="file"
              id="edit-images"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {/* New Image Previews */}
            <div className="flex flex-wrap mt-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`New Preview ${index}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImagePreview(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* --- End Common Fields --- */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Update
            </button>
            <button
              onClick={cancelEditing}
              className="text-gray-600 hover:text-gray-800 py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
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
  setEvents: PropTypes.func.isRequired, // Although not directly used, kept for potential future use
  refetchNews: PropTypes.func.isRequired,
};

export default News; // Ensure default export if needed
