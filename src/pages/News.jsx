/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Filter, MainCarousel, Markdown, LoadingSpinner } from "@/components/";
import { Down_left_dark_arrow } from "@/assets/";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api"; // Import BASE_URL
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const News = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("Latest");
  const [limit, setLimit] = useState(5);
  const { isAdmin, adminToken } = useAdmin();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/news`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        console.log("Fetched events:", data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const refetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/news`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading News..." />;
  if (error) return <div>Error loading news: {error}</div>;

  const slides = events.map((event) => event.images[0]).filter(Boolean);

  const loadMore = () => {
    setLimit((prev) => {
      if (prev + 5 > events.length) return events.length;
      return prev + 5;
    });
  };

  const changeSelected = (value) => {
    setSelected(value);
    setLimit(5);
  };

  const uniqueTypes = ["Latest", ...new Set(events.map((event) => event.type))];
  console.log("Unique types:", uniqueTypes);
  const filteredEvents =
    selected === "Latest" ? events : events.filter((event) => event.type === selected);

  return (
    <div className="flex flex-col justify-start items-center pt-16 pb-12 w-full h-dvh overflow-y-scroll no-scrollbar px-7 gap-4">
      <Intro slides={slides} />
      {isAdmin && (
        <AdminNewsControls events={events} setEvents={setEvents} refetchNews={refetchNews} />
      )}
      <div className="flex flex-col gap-[16px]">
        <Filter selected={selected} setSelected={changeSelected} list={uniqueTypes} />
        <div className="flex flex-col gap-4">
          {filteredEvents.slice(0, limit).map((event, index) => (
            <Event key={index} event={event} />
          ))}
        </div>
      </div>
      {limit < filteredEvents.length && (
        <button
          className="flex justify-center items-center w-full h-12 text-lg font-bold text-primary_main bg-primary_light rounded-lg"
          onClick={loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default News;

const Intro = ({ slides }) => {
  return (
    <div className="flex flex-col gap-[16px] py-8 w-full">
      <h2 className="flex justify-between items-end text-5xl text-text_black_primary leading-[48px] tracking-normal">
        <span>News</span>
        <Down_left_dark_arrow className="size-[51px]" />
      </h2>
      {slides.length > 0 && <MainCarousel slides={slides} />}
    </div>
  );
};

Intro.propTypes = {
  slides: PropTypes.array.isRequired,
};

const Event = ({ event }) => {
  return (
    <div className="flex flex-col gap-4 py-2 w-full">
      <div className="flex justify-between text-text_black_secondary text-[12px]">
        <span>{event.date}</span>
        <span className="font-bold">{event.type}</span>
      </div>
      <div className="w-full overflow-x-auto flex space-x-1 flex-shrink-0">
        {event?.images?.length > 0 &&
          event.images.map((image) => (
            <img
              key={image}
              src={image}
              className="shrink-0 w-3/5 rounded-[20px]"
              alt={event.title}
            />
          ))}
      </div>
      <div className="text-[20px] font-bold">{event.title}</div>
      <Markdown markdown={event.content} />
      <div className="h-[4px] border-y-2 border-primary_main border-solid rounded mx-8" />
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

// --- Admin UI Component for News ---
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
    for (let i = 0; i < selectedFiles.length; i++) {
      previews.push(URL.createObjectURL(selectedFiles[i]));
    }
    setImagePreviews(previews);

    return () => {
      // Clean up object URLs
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleCreate = async () => {
    if (!newDate) {
      alert("Please select a date.");
      return;
    }

    if (!newTitle || !newContent || !newType) {
      alert("Please fill in all fields.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadedImageUrls = await uploadResponse.json();
        const isoDate = newDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
        const newEvent = {
          title: newTitle,
          content: newContent,
          date: isoDate,
          images: uploadedImageUrls,
          type: newType,
        };

        console.log("New event data:", newEvent);
        const createResponse = await fetch(`${BASE_URL}/news`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(newEvent),
        });

        if (createResponse.ok) {
          setIsCreating(false);
          setNewTitle("");
          setNewContent("");
          setNewDate(null);
          setSelectedFiles([]);
          setNewType("");
          setImagePreviews([]);
          refetchNews();
        } else {
          console.error("Failed to create news item");
        }
      } else {
        console.error("Failed to upload images");
        const errorData = await uploadResponse.json();
        alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error creating news item:", error.message);
      alert("An error occurred while creating the news item. \n" + error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewContent(event.content);
    setNewDate(event.date ? new Date(event.date) : null);
    setNewType(event.type);
    setImagesToKeep(event.images || []);
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setImagesToKeep(imagesToKeep.filter((url) => url !== imageUrlToRemove));
  };

  const handleUpdate = async () => {
    if (!editingEvent || !newDate) return;

    setIsSubmitting(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    let newImageUrls = [];
    if (selectedFiles.length > 0) {
      try {
        const uploadResponse = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          newImageUrls = await uploadResponse.json();
        } else {
          console.error("Failed to upload new images");
          const errorData = await uploadResponse.json();
          alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading new images:", error);
        setIsSubmitting(false);
        return;
      }
    }

    const isoDate = newDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
    const updatedEvent = {
      title: newTitle,
      text: newContent,
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
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
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
      } else {
        console.error("Failed to update news item");
      }
    } catch (error) {
      console.error("Error updating news item:", error);
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
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          refetchNews();
        } else {
          console.error("Failed to delete news item");
        }
      } catch (error) {
        console.error("Error deleting news item:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-4">
      {(isSubmitting || deletingId) && (
        <LoadingSpinner
          message={
            isSubmitting
              ? isCreating
                ? "Creating News Item..."
                : "Updating News Item..."
              : "Deleting News Item..."
          }
        />
      )}

      {!isCreating && !isEditing && (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-500 text-white p-2 rounded mb-4"
          disabled={isSubmitting || deletingId}
        >
          Add New News Item
        </button>
      )}
      {events.map((event) => (
        <div key={event._id} className="border rounded p-2 mb-2 relative">
          <p>
            <strong>{event.title}</strong> ({event.date}) - {event.type}
          </p>
          <button
            onClick={() => handleEdit(event)}
            className="bg-yellow-500 text-white p-1 rounded mr-2 text-xs"
            disabled={isSubmitting || deletingId}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            className="bg-red-500 text-white p-1 rounded text-xs"
            disabled={isSubmitting || deletingId === event._id}
          >
            {deletingId === event._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
      {isCreating && (
        <div className="p-4 border rounded mt-4">
          <h3>Create New News Item</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="date">
              Date
            </label>
            <DatePicker
              id="date"
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="images">
              Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div className="flex mt-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Type (Others, Awards, Conference Presentations, etc.)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="ml-2 text-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      )}

      {isEditing && editingEvent && (
        <div className="p-4 border rounded">
          <h3>Edit News Item</h3>
          {isSubmitting && <LoadingSpinner message="Updating News Item..." />}
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="date">
              Date
            </label>
            <DatePicker
              id="date"
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            />
          </div>
          <input
            type="text"
            placeholder="Type (Others, Awards, Conference Presentations, etc.)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />

          {/* Preview Existing Images */}
          {editingEvent.images && editingEvent.images.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Existing Images</label>
              <div className="flex gap-2">
                {imagesToKeep.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Existing Image ${index}`}
                      className="w-32 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(imageUrl)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="newImages">
              Add New Images
            </label>
            <input
              type="file"
              id="newImages"
              multiple
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            />
            <div className="flex mt-2 gap-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`New Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            Update
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 text-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
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
