/* eslint-disable react/prop-types */
// {PATH_TO_THE_PROJECT}/frontend/src/components/admin/AboutControls.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LoadingSpinner } from "@/components";
import { BASE_URL } from "@/config/api";

// --- Reusable Form Field Components (Keep as is) ---
const InputField = ({
  label,
  path,
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
}) => (
  <div className="mb-4">
    <label htmlFor={path || label} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={path || label}
      name={path || label}
      value={value || ""}
      onChange={(e) => onChange(path, e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary_main focus:border-primary_main outline-none sm:text-sm disabled:bg-gray-100"
      placeholder={placeholder || label}
      disabled={disabled}
    />
  </div>
);

const TextareaField = ({
  label,
  path,
  value,
  onChange,
  rows = 3,
  placeholder = "",
  disabled = false,
}) => (
  <div className="mb-4">
    <label htmlFor={path || label} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={path || label}
      name={path || label}
      value={value || ""}
      onChange={(e) => onChange(path, e.target.value)}
      rows={rows}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary_main focus:border-primary_main outline-none sm:text-sm text-base disabled:bg-gray-100"
      placeholder={placeholder || label}
      disabled={disabled}
    />
  </div>
);
TextareaField.propTypes = {
  /* ... */
};
// --- End Reusable Form Field Components ---

// Helper to create a new empty track for the form
const createNewTrackFormState = () => ({
  formKey: `new_track_${Date.now()}`, // For React key
  title: "",
  content: [
    // Start with one empty content block
    {
      formKey: `new_cb_${Date.now()}`,
      title: "",
      text: "",
      img: null, // Will hold URL after upload or existing URL
      imageFile: null, // For new file upload
      imagePreview: null, // For new file preview
    },
  ],
  isNew: true, // Flag to distinguish from existing tracks
});

// Helper to prepare an existing track for editing
const prepareTrackForEdit = (track) => ({
  ...track, // Includes _id, title, content, createdAt, updatedAt
  formKey: track._id,
  content: track.content.map((cb, index) => ({
    ...cb, // Includes _id, title, text, img
    formKey: cb._id || `cb_edit_${track._id}_${index}`,
    imageFile: null,
    imagePreview: null,
    // 'img' field from backend is the existing image URL
  })),
  isNew: false,
});

export const AdminAboutControls = ({ fetchedTracks, onDataChange, adminToken }) => {
  // 'tracks' holds the list of tracks, some might be in edit mode
  const [tracks, setTracks] = useState([]);
  const [editingTrackId, setEditingTrackId] = useState(null); // ID of track currently being edited, or 'new'
  const [editedTrackData, setEditedTrackData] = useState(null); // Form data for the track being edited

  const [isLoading, setIsLoading] = useState(false); // For save, delete operations
  const [error, setError] = useState(null);

  useEffect(() => {
    setTracks(fetchedTracks.map(prepareTrackForEdit)); // Prepare all fetched tracks initially
  }, [fetchedTracks]);

  // Cleanup previews when editedTrackData changes or editing stops
  useEffect(() => {
    return () => {
      if (editedTrackData?.content) {
        editedTrackData.content.forEach((cb) => {
          if (cb.imagePreview) URL.revokeObjectURL(cb.imagePreview);
        });
      }
    };
  }, [editedTrackData]);

  const handleStartEdit = (trackId) => {
    const trackToEdit = tracks.find((t) => t._id === trackId);
    if (trackToEdit) {
      setEditingTrackId(trackId);
      setEditedTrackData(JSON.parse(JSON.stringify(prepareTrackForEdit(trackToEdit)))); // Deep clone for editing
    }
  };

  const handleStartCreateNew = () => {
    setEditingTrackId("new"); // Special ID for creation form
    setEditedTrackData(createNewTrackFormState());
  };

  const handleCancelEdit = () => {
    if (editedTrackData?.content) {
      // Cleanup before nullifying
      editedTrackData.content.forEach((cb) => {
        if (cb.imagePreview) URL.revokeObjectURL(cb.imagePreview);
      });
    }
    setEditingTrackId(null);
    setEditedTrackData(null);
    setError(null);
  };

  const handleTrackInputChange = (field, value) => {
    setEditedTrackData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentBlockChange = (cbIndex, field, value) => {
    setEditedTrackData((prev) => ({
      ...prev,
      content: prev.content.map((cb, index) =>
        index === cbIndex ? { ...cb, [field]: value } : cb
      ),
    }));
  };

  const handleContentBlockFileChange = (cbIndex, file) => {
    setEditedTrackData((prev) => {
      const newContent = [...prev.content];
      if (newContent[cbIndex]) {
        // Revoke old preview if exists
        if (newContent[cbIndex].imagePreview) {
          URL.revokeObjectURL(newContent[cbIndex].imagePreview);
        }
        newContent[cbIndex] = {
          ...newContent[cbIndex],
          imageFile: file,
          imagePreview: file ? URL.createObjectURL(file) : null,
        };
      }
      return { ...prev, content: newContent };
    });
  };

  const removeContentBlockImage = (cbIndex) => {
    setEditedTrackData((prev) => {
      const newContent = [...prev.content];
      if (newContent[cbIndex]) {
        if (newContent[cbIndex].imagePreview) URL.revokeObjectURL(newContent[cbIndex].imagePreview);
        newContent[cbIndex] = {
          ...newContent[cbIndex],
          img: null,
          imageFile: null,
          imagePreview: null,
        };
      }
      return { ...prev, content: newContent };
    });
  };

  const addContentBlockToForm = () => {
    setEditedTrackData((prev) => ({
      ...prev,
      content: [
        ...(prev.content || []),
        {
          formKey: `new_cb_${Date.now()}`,
          title: "",
          text: "",
          img: null,
          imageFile: null,
          imagePreview: null,
        },
      ],
    }));
  };

  const removeContentBlockFromForm = (cbIndex) => {
    if (!window.confirm("Remove this content block from the form?")) return;
    setEditedTrackData((prev) => {
      const blockToRemove = prev.content[cbIndex];
      if (blockToRemove.imagePreview) URL.revokeObjectURL(blockToRemove.imagePreview);
      return {
        ...prev,
        content: prev.content.filter((_, index) => index !== cbIndex),
      };
    });
  };

  const handleSaveTrack = async () => {
    if (!editedTrackData) return;
    setIsLoading(true);
    setError(null);

    // Validate main track title
    if (!editedTrackData.title.trim()) {
      alert("Track title is required.");
      setIsLoading(false);
      return;
    }
    // Validate content blocks (at least one, and each must have title, text, image)
    if (!editedTrackData.content || editedTrackData.content.length === 0) {
      alert("At least one content block is required for the track.");
      setIsLoading(false);
      return;
    }

    const processedContentBlocks = [];
    for (const cb of editedTrackData.content) {
      let imageUrl = cb.img; // Existing image URL
      if (cb.imageFile) {
        // New image to upload
        const formData = new FormData();
        formData.append("file", cb.imageFile);
        try {
          const res = await fetch(`${BASE_URL}/api/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: formData,
          });
          if (!res.ok) throw new Error(`Image upload failed for block "${cb.title}"`);
          const uploadResult = await res.json();
          imageUrl = uploadResult.urls?.[0];
        } catch (uploadError) {
          setError(`Upload error: ${uploadError.message}`);
          setIsLoading(false);
          return;
        }
      }
      if (!cb.title.trim() || !cb.text.trim() || !imageUrl) {
        alert(
          `Content block "${
            cb.title || "Untitled Block"
          }" is incomplete. Title, text, and image are required.`
        );
        setIsLoading(false);
        return;
      }
      processedContentBlocks.push({ title: cb.title, text: cb.text, img: imageUrl });
    }

    const payload = {
      title: editedTrackData.title,
      content: processedContentBlocks,
    };

    const isNewTrack = editedTrackData.isNew || !editedTrackData._id;
    const url = isNewTrack ? `${BASE_URL}/about` : `${BASE_URL}/about/${editedTrackData._id}`;
    const method = isNewTrack ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.message || `Failed to ${isNewTrack ? "create" : "update"} track`
        );
      }
      alert(`Track ${isNewTrack ? "created" : "updated"} successfully!`);
      onDataChange(); // Trigger refetch in parent
      handleCancelEdit(); // Close form
    } catch (saveError) {
      setError(`Save error: ${saveError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    if (
      !window.confirm("Are you sure you want to delete this entire track? This cannot be undone.")
    )
      return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/about/${trackId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to delete track");
      }
      alert("Track deleted successfully!");
      onDataChange(); // Trigger refetch
    } catch (deleteError) {
      setError(`Delete error: ${deleteError.message}`);
      alert(`Delete failed: ${deleteError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // UI Rendering
  if (editingTrackId) {
    // FORM VIEW (Create or Edit)
    return (
      <div className="w-full max-w-3xl mx-auto p-6 my-8 border rounded-lg shadow-xl bg-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {editedTrackData?.isNew ? "Create New Research Track" : "Edit Research Track"}
        </h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <LoadingSpinner message={editedTrackData?.isNew ? "Creating..." : "Updating..."} />
          </div>
        )}

        {editedTrackData && (
          <>
            <InputField
              label="Main Track Title"
              path="title"
              value={editedTrackData.title}
              onChange={(_, val) => handleTrackInputChange("title", val)}
            />

            <div className="my-6 pt-4 border-t">
              <h3 className="text-xl font-medium text-gray-700 mb-3">Content Blocks</h3>
              {editedTrackData.content?.map((cb, cbIndex) => (
                <div
                  key={cb.formKey}
                  className="p-4 border rounded bg-white mb-4 shadow space-y-3 relative"
                >
                  <button
                    onClick={() => removeContentBlockFromForm(cbIndex)}
                    title="Remove this block from form"
                    className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700 p-1"
                  >
                    × Remove Block
                  </button>
                  <h4 className="text-md font-semibold text-gray-600">Block {cbIndex + 1}</h4>
                  <InputField
                    label="Block Title"
                    path={`content[${cbIndex}].title`}
                    value={cb.title}
                    onChange={(_, val) => handleContentBlockChange(cbIndex, "title", val)}
                  />
                  <TextareaField
                    label="Block Text"
                    path={`content[${cbIndex}].text`}
                    value={cb.text}
                    onChange={(_, val) => handleContentBlockChange(cbIndex, "text", val)}
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block Image
                    </label>
                    {(cb.imagePreview || cb.img) && ( // cb.img is existing URL
                      <div className="mb-2 relative w-28 h-28 group">
                        <img
                          src={cb.imagePreview || cb.img}
                          alt="Content block"
                          className="w-full h-full object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeContentBlockImage(cbIndex)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id={`cbFile_${cbIndex}`}
                      onChange={(e) => handleContentBlockFileChange(cbIndex, e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addContentBlockToForm}
                className="mt-3 px-4 py-1.5 text-sm border rounded hover:bg-gray-200"
              >
                + Add Content Block
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCancelEdit}
                type="button"
                className="px-6 py-2 rounded shadow-md bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrack}
                type="button"
                disabled={isLoading}
                className="px-6 py-2 rounded shadow-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Track"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage About Page Tracks</h2>
        <button
          onClick={handleStartCreateNew}
          className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          + Add New Track
        </button>
      </div>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      {isLoading && (
        <div className="text-center py-4">
          <LoadingSpinner message="Processing..." />
        </div>
      )}

      {tracks.length === 0 && !isLoading && (
        <p className="text-gray-500 italic">
          No tracks found. Click &quot;Add New Track&quot; to create one.
        </p>
      )}
      <div className="space-y-4">
        {tracks.map((track) => (
          <div
            key={track._id}
            className="p-4 border rounded-lg shadow bg-white flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold text-primary_main">{track.title}</h3>
              <p className="text-xs text-gray-500">Blocks: {track.content?.length || 0}</p>
              <p className="text-xs text-gray-500">
                Last updated: {new Date(track.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 items-center flex-shrink-0 mt-1">
              <button
                onClick={() => handleStartEdit(track._id)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTrack(track._id)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AdminAboutControls.propTypes = {
  fetchedTracks: PropTypes.array.isRequired,
  onDataChange: PropTypes.func.isRequired, // Callback to trigger refetch in parent
  adminToken: PropTypes.string.isRequired,
};

export default AdminAboutControls;
