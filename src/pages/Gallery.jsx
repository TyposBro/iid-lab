// {PATH_TO_THE_PROJECT}/frontend/src/pages/Gallery.jsx

/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react"; // Added useEffect
import PropTypes from "prop-types";
import { Filter, MainCarousel, LoadingSpinner, AdminMetaControls } from "@/components"; // Added AdminMetaControls
import { Down_left_dark_arrow } from "@/assets/";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
import { useGalleryMeta, useGalleryEvents } from "@/hooks/useGalleryApi";
import { useCreateGalleryEvent, useUpdateGalleryEvent, useDeleteGalleryEvent } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Gallery = () => {
  const queryClient = useQueryClient();
  const { data: events = [], isLoading: loading, error } = useGalleryEvents();
  const [selected, setSelected] = useState("Latest");
  const { isAdmin, adminToken } = useAdmin(); // adminToken is used in AdminGalleryControls

  // --- Meta Data via React Query ---
  const { data: galleryMeta, isLoading: metaLoading, error: metaError } = useGalleryMeta();

  const defaultGalleryMeta = useMemo(
    () => ({
      title: "",
      description: "",
    }),
    []
  );

  const handleMetaUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["gallery", "meta"] });
  };
  // --- End Meta Data ---
  // Events fetching handled by useGalleryEvents

  // Use resolved meta or defaults for display
  const currentTitle = galleryMeta?.title || defaultGalleryMeta.title;
  const currentDescription = galleryMeta?.description || defaultGalleryMeta.description;

  // Gallery event slides logic (can remain as is, or be memoized if complex)
  const slides = events.map((event) => event.images[0]).filter(Boolean);
  const uniqueTypes = ["Latest", ...new Set(events.map((event) => event.type))];

  return (
    <div className="flex flex-col justify-start items-center pt-16 min-h-screen w-full">
      {/* META ADMIN CONTROLS - START */}
      {isAdmin && galleryMeta && (
        <AdminMetaControls
          pageIdentifier="gallery" // Unique identifier for this page's meta
          initialData={galleryMeta}
          fieldsConfig={[
            { name: "title", label: "Gallery Page Title", type: "text" },
            {
              name: "description",
              label: "Gallery Page Description (shown below title)",
              type: "textarea",
            },
          ]}
          onUpdateSuccess={handleMetaUpdated}
          containerClass="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-[25px] py-2 bg-gray-50 rounded-b-lg shadow mb-4"
        />
      )}
      {/* META ADMIN CONTROLS - END */}

      {/* Display loading or error for meta if applicable */}
      {metaLoading && (
        <div className="p-10 text-center w-full">
          <LoadingSpinner variant="block" message="Loading page details..." />
        </div>
      )}
      {metaError && !metaLoading && (
        <div className="p-6 text-center text-red-500 w-full">
          Error loading page details: {metaError}. Displaying default content.
        </div>
      )}

      {/* Render page content once meta (even default) is resolved */}
      {(!metaLoading || galleryMeta) && (
        <>
          <Intro slides={slides} titleText={currentTitle} descriptionText={currentDescription} />

          {/* Gallery content loading and error states */}
          {loading &&
            !metaLoading && ( // Show gallery loading only if meta is done
              <div className="p-10 text-center w-full">
                <LoadingSpinner variant="block" message="Loading Gallery Events..." />
              </div>
            )}
          {error &&
            !metaLoading && ( // Show gallery error only if meta is done
              <div className="p-6 text-center text-red-600 w-full">
                Error loading Gallery Events: {error}
              </div>
            )}

          {/* Render gallery events and admin controls only when events are not loading */}
          {!loading && !error && (
            <>
              {isAdmin && (
                <AdminGalleryControls
                  events={events}
                  refetchGalleryEvents={() =>
                    queryClient.invalidateQueries({ queryKey: ["gallery", "events"] })
                  }
                />
              )}
              <div className="w-full flex flex-col gap-[16px] py-8">
                <div className="px-4">
                  <Filter selected={selected} setSelected={setSelected} list={uniqueTypes} />
                </div>
                <div className="flex flex-col gap-4">
                  {
                    selected === "Latest"
                      ? events.slice(0, 5).map((event) => <Event key={event._id} event={event} />) // Use event._id for key
                      : events
                          .filter((event) => event.type === selected)
                          .map((event) => <Event key={event._id} event={event} />) // Use event._id for key
                  }
                  {/* Handle case where filtered events are empty */}
                  {selected !== "Latest" &&
                    events.filter((event) => event.type === selected).length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No events found for type: {selected}
                      </p>
                    )}
                  {selected === "Latest" && events.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      No gallery events available yet.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Gallery;

// Modified Intro to accept title and description from meta
const Intro = ({ slides, titleText, descriptionText }) => {
  return (
    <div className="flex flex-col gap-[16px] px-6 py-8 w-full">
      <div className="flex justify-between items-end">
        <h2 className="text-5xl text-text_black_primary tracking-normal">{titleText}</h2>
        <Down_left_dark_arrow className="size-12 lg:size-14" style={{ strokeWidth: 2 }} />
      </div>
      {descriptionText && (
        <p className="text-lg text-text_black_secondary mt-2">{descriptionText}</p>
      )}
      {slides.length > 0 && <MainCarousel slides={slides} />}
      {slides.length === 0 &&
        !descriptionText && ( // Show only if no slides and no specific description
          <p className="text-center text-gray-500 py-4">Gallery visuals are being updated.</p>
        )}
    </div>
  );
};

Intro.propTypes = {
  slides: PropTypes.array.isRequired,
  titleText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string, // Optional
};

const Event = ({ event }) => {
  const date = event.date ? new Date(event.date) : null;
  const year = date ? date.getFullYear() : "";

  return (
    <div className="flex flex-col gap-[10px] py-4 px-4 sm:px-6 lg:px-[25px]">
      {" "}
      {/* Added responsive padding */}
      <div className="flex gap-[15px] w-full overflow-x-auto no-scrollbar pb-2">
        {" "}
        {/* Added no-scrollbar and pb-2 */}
        {event?.images?.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-[280px] sm:w-[300px] h-[180px] sm:h-[200px]">
            {" "}
            {/* Responsive sizing */}
            <img
              src={image}
              alt={`${event.title} - Image ${index + 1}`}
              className="rounded-[20px] w-full h-full object-cover" // Use object-cover
            />
          </div>
        ))}
        {(!event?.images || event.images.length === 0) && (
          <div className="rounded-[20px] w-[280px] sm:w-[300px] h-[180px] sm:h-[200px] bg-gray-200 flex items-center justify-center text-gray-500">
            No images for this event
          </div>
        )}
      </div>
      <div className="text-center text-sm sm:text-base text-text_black_secondary">
        {" "}
        {/* Responsive text */}
        <span className="font-semibold text-text_black_primary">{event?.title}</span> ({year}),{" "}
        {event?.location}
      </div>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

// --- Admin UI Component for Gallery ---
// (AdminGalleryControls component remains the same as in your provided code)
// Make sure it's defined below or imported correctly.
const AdminGalleryControls = ({ events, refetchGalleryEvents }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newType, setNewType] = useState("");
  const { adminToken } = useAdmin();

  const [deletingId, setDeletingId] = useState(null);
  const [imagesToKeep, setImagesToKeep] = useState([]);

  const toast = useToast();
  // Mutations with toast integration
  const createMutation = useCreateGalleryEvent(adminToken, {
    onSuccess: () => {
      setIsCreating(false);
      setNewTitle("");
      setNewDate(null);
      setNewLocation("");
      setSelectedFiles([]);
      setNewType("");
      // refetch will happen via invalidate in hook; extra safety
      refetchGalleryEvents();
    },
    toast,
  });
  const updateMutation = useUpdateGalleryEvent(adminToken, { toast });
  const deleteMutation = useDeleteGalleryEvent(adminToken, { toast });

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const handleCreate = () => {
    if (!newDate) return alert("Please select a date.");
    if (selectedFiles.length === 0) return alert("Please upload at least one image.");
    const isoDate = newDate.toISOString();
    createMutation.mutate({
      title: newTitle,
      date: isoDate,
      location: newLocation,
      type: newType,
      files: selectedFiles,
    });
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewDate(event.date ? new Date(event.date) : null);
    setNewLocation(event.location);
    setNewType(event.type);
    setSelectedFiles([]);
    setImagesToKeep(event.images || []); // Initialize imagesToKeep
  };

  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setImagesToKeep(imagesToKeep.filter((url) => url !== imageUrlToRemove));
  };

  const handleUpdate = () => {
    if (!editingEvent || !newDate) return;
    const isoDate = newDate.toISOString();
    updateMutation.mutate(
      {
        id: editingEvent._id,
        files: selectedFiles,
        update: {
          title: newTitle,
          date: isoDate,
          location: newLocation,
          images: imagesToKeep, // existing kept images; new images handled inside mutation
          type: newType,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditingEvent(null);
          setNewTitle("");
          setNewDate(null);
          setNewLocation("");
          setSelectedFiles([]);
          setNewType("");
          setImagesToKeep([]);
          refetchGalleryEvents();
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  // Basic styling for better readability, can be enhanced with Tailwind
  const formSectionClass = "p-4 border rounded mt-6 bg-gray-50 shadow-md";
  const inputClass = "w-full p-2 mb-3 border rounded focus:ring-2 focus:ring-blue-300 outline-none";
  const buttonClass = "text-white p-2 rounded mr-2 transition-colors duration-150";
  const primaryButtonClass = `${buttonClass} bg-blue-600 hover:bg-blue-700`;
  const secondaryButtonClass = `${buttonClass} bg-gray-500 hover:bg-gray-600`;
  const dangerButtonClass = `${buttonClass} bg-red-600 hover:bg-red-700`;
  const warningButtonClass = `${buttonClass} bg-yellow-500 hover:bg-yellow-600`;
  const successButtonClass = `${buttonClass} bg-green-500 hover:bg-green-600`;

  return (
    <div className="w-full p-4 sm:p-6 bg-white shadow rounded-lg">
      <div className="w-full flex flex-wrap justify-between items-center mb-6 pb-4 border-b">
        <h3 className="text-2xl font-semibold text-gray-700">Admin: Manage Gallery</h3>
        {!isCreating && !isEditing && (
          <button
            onClick={() => setIsCreating(true)}
            className={`${successButtonClass} text-sm`}
            disabled={isSubmitting || deletingId !== null}
          >
            + Add New Event
          </button>
        )}
      </div>

      {(isSubmitting || deletingId !== null) && (
        <div className="my-4">
          <LoadingSpinner
            message={
              deletingId !== null
                ? "Deleting Event..."
                : isCreating
                ? "Creating Event..."
                : "Updating Event..."
            }
          />
        </div>
      )}

      {/* List of Events for Editing/Deleting */}
      {!isCreating && !isEditing && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded p-3 bg-gray-50 hover:shadow-sm transition-shadow"
            >
              <p className="text-gray-800 mb-2 sm:mb-0 flex-grow">
                <strong className="font-medium">{event.title}</strong> (
                {new Date(event.date).toLocaleDateString()})
                <span className="text-sm text-gray-600 ml-2">
                  ({event.type || "Uncategorized"})
                </span>
                <br />
                <span className="text-sm text-gray-500">{event.location}</span>
              </p>
              <div className="flex-shrink-0 flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(event)}
                  className={`${warningButtonClass} text-xs px-3 py-1`}
                  disabled={isSubmitting || deletingId !== null}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className={`${dangerButtonClass} text-xs px-3 py-1`}
                  disabled={isSubmitting || deletingId === event._id}
                >
                  {deletingId === event._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isCreating && !isEditing && events.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No gallery events to manage yet. Click &quot;Add New Event&quot; to start.
        </p>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className={formSectionClass}>
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Create New Gallery Event</h4>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={inputClass}
          />
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="create-date">
              Date
            </label>
            <DatePicker
              id="create-date"
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Type (e.g., Conference, Lab Event)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className={inputClass}
          />
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="create-images">
              Images (select multiple)
            </label>
            <input
              type="file"
              id="create-images"
              multiple
              onChange={handleFileChange}
              className={inputClass}
            />
            {selectedFiles.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{selectedFiles.length} file(s) selected.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className={primaryButtonClass} disabled={isSubmitting}>
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className={secondaryButtonClass}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && editingEvent && (
        <div className={formSectionClass}>
          <h4 className="text-xl font-semibold mb-4 text-gray-700">
            Edit Gallery Event: {editingEvent.title}
          </h4>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-date">
              Date
            </label>
            <DatePicker
              id="edit-date"
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
          <input
            type="text"
            placeholder="Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Type (e.g., Conference, Lab Event)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />

          {imagesToKeep.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Current Images (Click X to remove)
              </label>
              <div className="flex flex-wrap gap-2">
                {imagesToKeep.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Current ${index}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(imageUrl)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs focus:outline-none hover:bg-red-600"
                      disabled={isSubmitting}
                    >
                      {" "}
                      ×{" "}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-new-images">
              Add New Images (select multiple)
            </label>
            <input
              type="file"
              id="edit-new-images"
              multiple
              onChange={handleFileChange}
              className={inputClass}
              disabled={isSubmitting}
            />
            {selectedFiles.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{selectedFiles.length} file(s) selected.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdate} className={primaryButtonClass} disabled={isSubmitting}>
              Update
            </button>
            <button
              onClick={() => setIsEditing(false)}
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

AdminGalleryControls.propTypes = {
  events: PropTypes.array.isRequired,
  refetchGalleryEvents: PropTypes.func.isRequired,
};
