/* eslint-disable no-unused-vars */
// {PATH_TO_THE_PROJECT}/frontend/src/components/admin/AdminAboutControls.jsx
// (Create this new file and directory if it doesn't exist)

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { LoadingSpinner } from "@/components"; // Assuming LoadingSpinner is in components/index.js
import { BASE_URL } from "@/config/api"; // Make sure this path is correct

// Helper to create default data structure matching the NEW schema
const createDefaultAboutData = () => ({
  head: { title: "Integration & Innovation Design", description: "" },
  body: { title: "Research Tracks", list: [] }, // Start with empty list
});

// --- Reusable Form Field Components (copied from About.jsx, or import if global) ---
const InputField = ({ label, path, value, onChange, placeholder = "", type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={path} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={path}
      name={path}
      value={value || ""}
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
      value={value || ""}
      onChange={(e) => onChange(path, e.target.value)}
      rows={rows}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary_main focus:border-primary_main outline-none sm:text-sm text-base"
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
// --- End Reusable Form Field Components ---

export const AdminAboutControls = ({ initialData, onSaveSuccess, adminToken }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cleanup object URLs on unmount or when editing is stopped
  useEffect(() => {
    return () => {
      if (editedData && editedData.body && editedData.body.list) {
        editedData.body.list.forEach((track) => {
          if (track.newImagePreviews) {
            track.newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
          }
        });
      }
    };
  }, [editedData]); // Re-run if editedData structure changes, to catch previews if form is rebuilt

  const cleanupPreviewsBeforeReset = (data) => {
    if (data && data.body && data.body.list) {
      data.body.list.forEach((track) => {
        if (track.newImagePreviews) {
          track.newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        }
      });
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      const dataToEdit = initialData
        ? JSON.parse(JSON.stringify(initialData))
        : createDefaultAboutData();

      if (!dataToEdit.body) dataToEdit.body = { title: "Research Tracks", list: [] };
      if (!dataToEdit.body.list) dataToEdit.body.list = [];

      // Ensure at least one track if list is empty for usability, or handle empty state in UI
      // if (dataToEdit.body.list.length === 0) {
      //   dataToEdit.body.list.push({ title: "", text: [], img: [] });
      // }

      dataToEdit.body.list.forEach((item) => {
        item.text = Array.isArray(item.text) ? item.text.join("\n\n") : item.text || "";
        // Initialize for image uploads
        item.existingImagesToKeep = Array.isArray(item.img) ? [...item.img] : [];
        item.newSelectedFiles = [];
        item.newImagePreviews = [];
        delete item.img; // We'll reconstruct 'img' on save
      });
      setEditedData(dataToEdit);
    } else {
      cleanupPreviewsBeforeReset(editedData);
      setEditedData(null); // Clear edits on cancel
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  const handleInputChange = (path, value) => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
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
            if (!current[arrayKey][index]) current[arrayKey][index] = {}; // Initialize if not exists
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
      }
      return newData;
    });
  };

  const addTrack = () => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (!newData.body) newData.body = { title: "Research Tracks", list: [] };
      if (!newData.body.list) newData.body.list = [];
      newData.body.list.push({
        title: "",
        text: "", // textarea expects string
        existingImagesToKeep: [],
        newSelectedFiles: [],
        newImagePreviews: [],
      });
      return newData;
    });
  };

  const removeTrack = (indexToRemove) => {
    if (!window.confirm("Are you sure you want to remove this track?")) return;
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (newData.body?.list?.[indexToRemove]) {
        // Cleanup previews for the track being removed
        const trackToRemove = newData.body.list[indexToRemove];
        if (trackToRemove.newImagePreviews) {
          trackToRemove.newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        }
        newData.body.list.splice(indexToRemove, 1);
      }
      return newData;
    });
  };

  // --- Image Handling for Tracks ---
  const handleTrackFileChange = (trackIndex, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const currentPreviews = [];
    files.forEach((file) => currentPreviews.push(URL.createObjectURL(file)));

    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Be careful with File objects in JSON.stringify
      const track = newData.body.list[trackIndex];

      // For File objects, we need to handle them outside of simple JSON stringify/parse
      const existingFiles = prevData.body.list[trackIndex].newSelectedFiles || [];
      track.newSelectedFiles = [...existingFiles, ...files]; // This won't be in newData yet due to stringify
      track.newImagePreviews = [...(track.newImagePreviews || []), ...currentPreviews];

      // Manually update the File objects part
      const updatedList = prevData.body.list.map((t, idx) => {
        if (idx === trackIndex) {
          return {
            ...track, // from newData (JSON compatible parts)
            newSelectedFiles: [...(prevData.body.list[idx].newSelectedFiles || []), ...files], // actual File objects
          };
        }
        return t;
      });
      newData.body.list = updatedList;
      return newData;
    });
  };

  const handleRemoveExistingTrackImage = (trackIndex, imageUrlToRemove) => {
    setEditedData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const track = newData.body.list[trackIndex];
      track.existingImagesToKeep = track.existingImagesToKeep.filter(
        (url) => url !== imageUrlToRemove
      );
      // Preserve File objects
      newData.body.list = prevData.body.list.map((t, idx) => {
        if (idx === trackIndex) {
          return {
            ...track,
            newSelectedFiles: t.newSelectedFiles,
            newImagePreviews: t.newImagePreviews,
          };
        }
        return t;
      });
      return newData;
    });
  };

  const handleRemoveNewTrackImagePreview = (trackIndex, previewIndexToRemove) => {
    setEditedData((prevData) => {
      const urlToRevoke = prevData.body.list[trackIndex].newImagePreviews[previewIndexToRemove];
      URL.revokeObjectURL(urlToRevoke);

      const newFiles = [...prevData.body.list[trackIndex].newSelectedFiles];
      newFiles.splice(previewIndexToRemove, 1);

      const newPreviews = [...prevData.body.list[trackIndex].newImagePreviews];
      newPreviews.splice(previewIndexToRemove, 1);

      const updatedList = prevData.body.list.map((track, idx) => {
        if (idx === trackIndex) {
          return {
            ...track, // Copied from prevData
            newSelectedFiles: newFiles,
            newImagePreviews: newPreviews,
          };
        }
        return track;
      });
      return { ...prevData, body: { ...prevData.body, list: updatedList } };
    });
  };

  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    setError(null);

    const dataToSave = {
      head: {
        title: editedData.head?.title || "",
        description: editedData.head?.description || "",
      },
      body: {
        title: editedData.body?.title || "Research Tracks",
        list: [],
      },
    };

    // Process tracks: upload new images and combine with existing ones
    if (editedData.body?.list) {
      for (const formTrackItem of editedData.body.list) {
        let uploadedNewImageUrls = [];
        if (formTrackItem.newSelectedFiles && formTrackItem.newSelectedFiles.length > 0) {
          const formData = new FormData();
          formTrackItem.newSelectedFiles.forEach((file) => formData.append("images", file));
          try {
            const uploadResponse = await fetch(`${BASE_URL}/upload`, {
              method: "POST",
              headers: { Authorization: `Bearer ${adminToken}` },
              body: formData,
            });
            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json();
              throw new Error(
                `Track image upload failed: ${errorData?.message || uploadResponse.statusText}`
              );
            }
            uploadedNewImageUrls = await uploadResponse.json();
          } catch (err) {
            console.error("Track image upload error:", err);
            setError(`Failed to upload some track images: ${err.message}`);
            setIsSaving(false);
            return; // Stop save process if an upload fails
          }
        }

        const finalImageUrls = [
          ...(formTrackItem.existingImagesToKeep || []),
          ...uploadedNewImageUrls,
        ];

        dataToSave.body.list.push({
          title: formTrackItem.title || "",
          text:
            typeof formTrackItem.text === "string"
              ? formTrackItem.text
                  .split(/\n\s*\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          img: finalImageUrls,
        });
      }
    }

    // Filter out completely empty tracks (optional, based on your preference)
    dataToSave.body.list = dataToSave.body.list.filter(
      (item) => item.title || item.text.length > 0 || item.img.length > 0
    );

    if (!dataToSave.head?.title || !dataToSave.head?.description || !dataToSave.body?.title) {
      alert("Please fill required fields (Head Title/Description, Body Section Title).");
      setIsSaving(false);
      return;
    }

    console.log("--- Frontend (AdminControls): Data being sent to PUT /api/about ---");
    console.log(JSON.stringify(dataToSave, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/about`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      if (!response.ok) throw new Error(`Save failed: ${response.status} ${await response.text()}`);
      const savedData = await response.json();

      console.log("--- Frontend (AdminControls): Response received from PUT /api/about ---");
      console.log(JSON.stringify(savedData, null, 2));

      cleanupPreviewsBeforeReset(editedData); // Clean up previews of successfully saved data
      onSaveSuccess(savedData); // Callback to parent to update its state
      setIsEditing(false);
      setEditedData(null);
      // Alert is handled by parent via onSaveSuccess
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full max-w-4xl px-4 md:px-0 mb-6 flex justify-center gap-4">
        <button
          className="px-4 py-2 rounded shadow-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          onClick={handleEditToggle}
          disabled={isSaving}
        >
          Edit Page
        </button>
      </div>
    );
  }

  // --- EDITING FORM UI ---
  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-8 mb-12">
      {error && (
        <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingSpinner message="Saving About Page..." />
        </div>
      )}

      {/* Head Section Form */}
      <section className="p-4 border rounded-lg shadow bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Header Section</h2>
        <InputField
          label="Title"
          path="head.title"
          value={editedData?.head?.title}
          onChange={handleInputChange}
        />
        <TextareaField
          label="Description"
          path="head.description"
          value={editedData?.head?.description}
          onChange={handleInputChange}
          rows={5}
        />
      </section>

      {/* Body Section Form (Research Tracks) */}
      <section className="p-4 border rounded-lg shadow bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
          Body Section (Research Tracks)
        </h2>
        <InputField
          label="Section Title"
          path="body.title"
          value={editedData?.body?.title}
          onChange={handleInputChange}
        />
        <hr className="my-6" />
        <h3 className="text-lg font-medium mb-3 text-gray-600">Tracks List</h3>
        <div className="space-y-6">
          {editedData?.body?.list?.map((item, index) => (
            <div
              key={`track-edit-${index}`} // Consider a more stable key if tracks can be reordered
              className="p-4 border rounded bg-white shadow-sm relative"
            >
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
                value={item.text} // This is a string here
                onChange={handleInputChange}
                rows={6}
              />
              {/* Image Upload Section for Track */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Track {index + 1}: Images
                </label>
                {/* Existing Images */}
                {item.existingImagesToKeep && item.existingImagesToKeep.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Current images (click X to remove):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.existingImagesToKeep.map((imageUrl, imgIdx) => (
                        <div key={`existing-${index}-${imgIdx}`} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Existing ${imgIdx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingTrackImage(index, imageUrl)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            {" "}
                            ×{" "}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* New Image Previews */}
                {item.newImagePreviews && item.newImagePreviews.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">
                      New images to upload (click X to remove):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.newImagePreviews.map((previewUrl, prevIdx) => (
                        <div key={`preview-${index}-${prevIdx}`} className="relative">
                          <img
                            src={previewUrl}
                            alt={`New preview ${prevIdx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewTrackImagePreview(index, prevIdx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            {" "}
                            ×{" "}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* File Input */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleTrackFileChange(index, e)}
                  className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ))}
          {(!editedData?.body?.list || editedData.body.list.length === 0) && (
            <p className="text-gray-400 italic text-sm">
              No tracks added yet. Click &apos;Add Track&apos; below.
            </p>
          )}
        </div>
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
  );
};

AdminAboutControls.propTypes = {
  initialData: PropTypes.object, // Can be null if no data exists yet
  onSaveSuccess: PropTypes.func.isRequired,
  adminToken: PropTypes.string.isRequired,
  // BASE_URL is imported directly
};

export default AdminAboutControls;
