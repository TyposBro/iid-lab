// {PATH_TO_THE_PROJECT}/frontend/src/pages/Gallery.jsx

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Filter, MainCarousel, LoadingSpinner } from "@/components";
import { Down_left_dark_arrow } from "@/assets";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api"; // Import BASE_URL
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS

export const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("Latest");
  const { isAdmin, adminToken } = useAdmin();

  useEffect(() => {
    const fetchGalleryEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/gallery`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        console.log("Fetched Events:", data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGalleryEvents();
  }, []);

  const refetchGalleryEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/gallery`);
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

  if (loading) return <div>Loading Gallery...</div>;
  if (error) return <div>Error loading Gallery: {error}</div>;

  const slides = events.map((event) => event.images[0]).filter(Boolean);
  const uniqueTypes = ["Latest", ...new Set(events.map((event) => event.type))];
  console.log("Unique Types:", uniqueTypes);

  return (
    <div className="flex flex-col justify-start items-center pt-16 w-full">
      <Intro slides={slides} />

      {isAdmin && (
        <AdminGalleryControls
          events={events}
          setEvents={setEvents}
          refetchGalleryEvents={refetchGalleryEvents}
        />
      )}
      <div className="flex flex-col gap-[16px] py-8">
        <div className="px-4">
          <Filter selected={selected} setSelected={setSelected} list={uniqueTypes} />
        </div>
        <div className="flex flex-col gap-4">
          {selected === "Latest"
            ? events.slice(0, 5).map((event, index) => <Event key={index} event={event} />)
            : events
                .filter((event) => event.type === selected)
                .map((event, index) => <Event key={index} event={event} />)}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

const Intro = ({ slides }) => {
  return (
    <div className="flex flex-col gap-[16px] px-6 py-8 w-full">
      <h2 className="flex justify-between items-end text-5xl text-text_black_primary leading-[48px] tracking-normal">
        <span>Gallery</span>
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
  const date = event.date ? new Date(event.date) : null;
  const year = date ? date.getFullYear() : "";

  return (
    <div className="flex flex-col gap-[10px] py-4">
      <div className="flex gap-[15px] px-[15px] w-full overflow-x-auto">
        {event?.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={event.title}
            className="rounded-[20px] w-[300px] h-[200px]"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "300px 200px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>
      <div className="text-center">
        {event?.title} ({year}), {event?.location}
      </div>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

// --- Admin UI Component for Gallery ---
const AdminGalleryControls = ({ events, setEvents, refetchGalleryEvents }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(null); // Store date object
  const [newLocation, setNewLocation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // To store selected image files
  const [newType, setNewType] = useState("");
  const { adminToken } = useAdmin();

  // New state to track loading for create, update, and delete
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imagesToKeep, setImagesToKeep] = useState([]);

  useEffect(() => {
    if (isEditing && editingEvent) {
      setImagesToKeep(editingEvent.images || []);
    } else {
      setImagesToKeep([]);
    }
  }, [isEditing, editingEvent]);

  const handleFileChange = (event) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
  };

  const handleCreate = async () => {
    if (!newDate) {
      alert("Please select a date.");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setIsSubmitting(true); // Start loading
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
        const isoDate = newDate.toISOString();
        const newEvent = {
          title: newTitle,
          date: isoDate,
          location: newLocation,
          images: uploadedImageUrls, // Use the URLs from the upload
          type: newType,
        };

        const createResponse = await fetch(`${BASE_URL}/gallery`, {
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
          setNewDate(null);
          setNewLocation("");
          setSelectedFiles([]);
          setNewType("");
          refetchGalleryEvents();
        } else {
          console.error("Failed to create gallery event");
        }
      } else {
        console.error("Failed to upload images");
        const errorData = await uploadResponse.json();
        alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error creating gallery event:", error);
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewDate(event.date ? new Date(event.date) : null);
    setNewLocation(event.location);
    setNewType(event.type);
    setSelectedFiles([]); // Reset selected files for new uploads in edit
  };

  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setImagesToKeep(imagesToKeep.filter((url) => url !== imageUrlToRemove));
  };

  const handleUpdate = async () => {
    if (!editingEvent || !newDate) return;

    setIsSubmitting(true); // Start loading
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

    const isoDate = newDate.toISOString();
    const updatedEvent = {
      title: newTitle,
      date: isoDate,
      location: newLocation,
      images: [...imagesToKeep, ...newImageUrls], // Combine kept and newly uploaded images
      type: newType,
    };

    try {
      const response = await fetch(`${BASE_URL}/gallery/${editingEvent._id}`, {
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
        setNewDate(null);
        setNewLocation("");
        setSelectedFiles([]);
        setNewType("");
        setImagesToKeep([]); // Reset images to keep
        refetchGalleryEvents();
      } else {
        console.error("Failed to update gallery event");
      }
    } catch (error) {
      console.error("Error updating gallery event:", error);
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setDeletingId(id); // Set the ID of the item being deleted
      try {
        const response = await fetch(`${BASE_URL}/gallery/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          refetchGalleryEvents();
        } else {
          console.error("Failed to delete gallery event");
        }
      } catch (error) {
        console.error("Error deleting gallery event:", error);
      } finally {
        setDeletingId(null); // Reset deleting ID
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
                ? "Creating Event..."
                : "Updating Event..."
              : "Deleting Event..."
          }
        />
      )}

      {!isCreating && !isEditing && (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-500 text-white p-2 rounded mb-4"
          disabled={isSubmitting || deletingId}
        >
          Add New Event
        </button>
      )}
      {events.map((event) => (
        <div key={event._id} className="border rounded p-2 mb-2 relative">
          <p>
            <strong>{event.title}</strong> ({new Date(event.date).getFullYear()})
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
          <h3>Create New Gallery Event</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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
          <input
            type="text"
            placeholder="Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
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
          </div>
          <input
            type="text"
            placeholder="Type (Conferences, Lab Events, etc.)"
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
          <h3>Edit Gallery Event</h3>
          {isSubmitting && <LoadingSpinner message="Updating Event..." />}
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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
            placeholder="Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Type (Conferences, Lab Events, etc.)"
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

AdminGalleryControls.propTypes = {
  events: PropTypes.array.isRequired,
  setEvents: PropTypes.func.isRequired,
  refetchGalleryEvents: PropTypes.func.isRequired,
};
