/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Down_straight_neutral_arrow } from "@/assets";
import { GoTo } from "@/components/";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api"; // Import BASE_URL
import { LoadingSpinner } from "@/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Helper function to extract a suggested filename from the URL
const getSuggestedFilenameFromUrl = (url) => {
  if (!url) return "cv.pdf"; // Default fallback

  try {
    // Decode URL in case of percent-encoded characters in the filename part
    const decodedUrl = decodeURIComponent(url);
    const fullPath = new URL(decodedUrl).pathname;
    const filenameWithPotentialPrefix = fullPath.substring(fullPath.lastIndexOf("/") + 1);

    // Assuming filename format from backend: RANDOMHEX-original_filename.ext
    // RANDOMHEX is 32 characters (16 bytes to hex string)
    const parts = filenameWithPotentialPrefix.split("-");
    if (parts.length > 1 && parts[0].length === 32 && /^[0-9a-fA-F]+$/.test(parts[0])) {
      // It matches the "randomhex-" pattern, return the rest
      return parts.slice(1).join("-");
    }
    // If no randomhex prefix or different format, return the full filename from URL
    return filenameWithPotentialPrefix;
  } catch (e) {
    // Fallback for invalid URLs or other parsing errors
    console.warn("Error parsing URL for filename:", e);
    const simpleFilename = url.substring(url.lastIndexOf("/") + 1);
    return simpleFilename.split("?")[0] || "cv.pdf"; // Remove query params if any
  }
};

const Prof = () => {
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAdmin();
  const [isDownloadingCv, setIsDownloadingCv] = useState(false);

  useEffect(() => {
    const fetchProfessor = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/prof`);
        if (!response.ok) {
          if (response.status === 404) {
            setProf(null);
          } else {
            throw new Error(`Failed to fetch professor: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setProf(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessor();
  }, []);

  const handleCvDownloadClick = async () => {
    console.log("[handleCvDownloadClick] Triggered.");
    console.log("[handleCvDownloadClick] Current prof object:", prof);
    console.log("[handleCvDownloadClick] CV Link from prof:", prof ? prof.cvLink : "N/A");
    console.log("[handleCvDownloadClick] isDownloadingCv state:", isDownloadingCv);

    if (!prof || !prof.cvLink || typeof prof.cvLink !== "string" || prof.cvLink.trim() === "") {
      console.warn("[handleCvDownloadClick] Exiting: Invalid prof object or CV link.", {
        hasProf: !!prof,
        cvLink: prof ? prof.cvLink : "N/A",
        isCvLinkStringAndNotEmpty:
          prof && typeof prof.cvLink === "string" && prof.cvLink.trim() !== "",
      });
      alert("CV link is not available or invalid.");
      return;
    }
    if (isDownloadingCv) {
      console.warn("[handleCvDownloadClick] Exiting: Download already in progress.");
      return;
    }

    setIsDownloadingCv(true);
    console.log(`[handleCvDownloadClick] Attempting to download from: ${prof.cvLink}`);

    try {
      // Verify URL structure before fetching
      try {
        new URL(prof.cvLink); // This will throw if the URL is malformed
      } catch (urlError) {
        console.error("[handleCvDownloadClick] Invalid URL format:", prof.cvLink, urlError);
        throw new Error(`The CV link is not a valid URL: ${prof.cvLink.substring(0, 100)}...`);
      }

      console.log("[handleCvDownloadClick] Fetching CV...");
      const response = await fetch(prof.cvLink);
      console.log(
        "[handleCvDownloadClick] Fetch response received. Status:",
        response.status,
        response.statusText
      );
      console.log(
        "[handleCvDownloadClick] Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorBody = "Could not retrieve error body.";
        try {
          errorBody = await response.text();
        } catch (e) {
          console.warn("[handleCvDownloadClick] Failed to read error body from response.");
        }
        console.error(
          `[handleCvDownloadClick] Fetch failed. Status: ${response.status}. Body: ${errorBody}`
        );
        throw new Error(
          `Server responded with ${response.status} ${response.statusText}. Check if the link is public and correct.`
        );
      }

      const blob = await response.blob();
      console.log("[handleCvDownloadClick] Blob created:", blob);

      const suggestedFilename = getSuggestedFilenameFromUrl(prof.cvLink);

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${prof.name}_CV.pdf`;
      console.log("[handleCvDownloadClick] Object URL for blob:", link.href);

      document.body.appendChild(link);
      console.log("[handleCvDownloadClick] Temporary link appended to body. Simulating click...");
      link.click();
      console.log("[handleCvDownloadClick] Temporary link clicked.");
      document.body.removeChild(link);
      console.log("[handleCvDownloadClick] Temporary link removed from body.");

      URL.revokeObjectURL(link.href);
      console.log("[handleCvDownloadClick] Object URL revoked.");
    } catch (error) {
      console.error("[handleCvDownloadClick] Error during download process:", error);
      alert(`Could not download CV: ${error.message}`);
    } finally {
      setIsDownloadingCv(false);
      console.log(
        "[handleCvDownloadClick] Download process finished. isDownloadingCv set to false."
      );
    }
  };

  if (loading) return <LoadingSpinner message="Loading Professor..." />;
  if (error) return <div>Error loading professor: {error}</div>;

  return (
    <div className="flex flex-col justify-start items-center py-[95px] px-[25px] w-full gap-6">
      {prof ? (
        <>
          <Intro prof={prof} />
          <Background list={prof.background || []} />
          <Links list={prof.background || []} />
          <div className="w-full flex flex-col gap-[10px] font-semibold text-[18px]">
            {prof.cvLink && (
              <button
                target="_blank"
                rel="noopener noreferrer"
                disabled={isDownloadingCv}
                onClick={handleCvDownloadClick} // Set the suggested filename
                className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
              >
                Download CV
                {/* Optionally: Download CV ({getSuggestedFilenameFromUrl(prof.cvLink)}) */}
              </button>
            )}
            {prof.email && (
              <a
                className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
                href={`mailto:${prof.email}`}
              >
                Contact
              </a>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">No Professor Profile Available</h2>
          <p className="text-gray-600">
            {isAdmin ? "You can create a new profile below." : "Please check back later."}
          </p>
        </div>
      )}

      {isAdmin && <AdminProfessorControls prof={prof} setProf={setProf} />}
    </div>
  );
};

export default Prof;

const AdminProfessorControls = ({ prof, setProf }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCvFile, setSelectedCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const { adminToken } = useAdmin();

  useEffect(() => {
    const initialFormData = prof || {
      name: "",
      role: "",
      img: "",
      desc: "",
      stats: [],
      interests: "",
      background: [],
      cvLink: "",
      email: "",
      phone: "",
    };
    setFormData(initialFormData);

    setImagePreview(initialFormData.img || null);

    // Reset file selections and errors when prof data changes or form is initialized/closed
    setSelectedImageFile(null);
    setSelectedCvFile(null);
    if (!isEditing) {
      // Clear errors only if not in edit mode (e.g. after successful save or cancel)
      setFormError(null);
    }
  }, [prof, isEditing]); // Add isEditing to dependencies to reset form state on cancel

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setFormError(null);

    if (!file) {
      setSelectedImageFile(null);
      setImagePreview(formData?.img || null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setFormError("Please select a valid image file (JPEG, PNG, GIF).");
      setSelectedImageFile(null);
      setImagePreview(formData?.img || null);
      e.target.value = null; // Reset file input
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size should be less than 5MB.");
      setSelectedImageFile(null);
      setImagePreview(formData?.img || null);
      e.target.value = null; // Reset file input
      return;
    }

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    setFormError(null);

    if (!file) {
      setSelectedCvFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setFormError("Please select a valid PDF file for the CV.");
      setSelectedCvFile(null);
      e.target.value = null; // Reset file input
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError("CV PDF size should be less than 10MB.");
      setSelectedCvFile(null);
      e.target.value = null; // Reset file input
      return;
    }
    setSelectedCvFile(file);
  };

  const resetImageSelection = () => {
    setSelectedImageFile(null);
    setImagePreview(formData?.img || null);
    const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
    if (imageInput) imageInput.value = null;
    setFormError(null);
  };

  const resetCvSelection = () => {
    setSelectedCvFile(null);
    const cvInput = document.querySelector('input[type="file"][accept=".pdf"]');
    if (cvInput) cvInput.value = null;
    setFormError(null);
  };

  const handleRemoveCv = () => {
    setSelectedCvFile(null); // Clear any newly selected CV file
    setFormData((prev) => ({ ...prev, cvLink: "" })); // Set cvLink to empty to signify removal
    const cvInput = document.querySelector('input[type="file"][accept=".pdf"]');
    if (cvInput) cvInput.value = null; // Reset the file input field
    setFormError(null);
  };

  const uploadFile = async (file, fieldNameInFormData) => {
    const fileData = new FormData();
    fileData.append(fieldNameInFormData, file);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: fileData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      // Adjusted to handle if backend returns an array with one URL, or an object with imageUrl/url
      const uploadedUrl = Array.isArray(data) ? data[0] : data.imageUrl || data.url;

      if (!uploadedUrl) {
        throw new Error("Invalid response format from upload API or no URL returned.");
      }
      return uploadedUrl;
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    let newImageUrl = formData.img;
    let newCvUrl = formData.cvLink; // Start with current CV link

    try {
      if (selectedImageFile) {
        newImageUrl = await uploadFile(selectedImageFile, "images");
      }

      if (selectedCvFile) {
        // If a new CV file is selected, upload it
        newCvUrl = await uploadFile(selectedCvFile, "images");
      } else if (formData.cvLink === "" && prof?.cvLink) {
        // If cvLink was cleared (handleRemoveCv) and there was an old one
        newCvUrl = ""; // Explicitly set to empty string to remove it
      }
      // If no new CV is selected and cvLink wasn't cleared, newCvUrl remains formData.cvLink (original or already empty)

      const professorDataToSubmit = {
        ...formData,
        img: newImageUrl,
        cvLink: newCvUrl,
        stats: formData.stats
          ? formData.stats.map((stat) => ({ ...stat, value: parseFloat(stat.value) || 0 }))
          : [],
      };

      const endpoint = prof?._id ? `${BASE_URL}/prof/${prof._id}` : `${BASE_URL}/prof`;
      const method = prof?._id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(professorDataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to ${prof?._id ? "update" : "create"} professor profile`
        );
      }

      const result = await response.json();
      setProf(result); // Update parent state
      setIsEditing(false); // This will trigger useEffect to reset file states and clear errors
      // setSelectedImageFile and setSelectedCvFile will be reset by useEffect
    } catch (error) {
      console.error("Submission error:", error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!prof?._id) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this professor profile? This action cannot be undone."
      )
    )
      return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch(`${BASE_URL}/prof/${prof._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete failed with status: ${response.status}`);
      }

      setProf(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Delete error:", error);
      setFormError(`Failed to delete profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // formData, imagePreview, file selections, and errors will be reset by the useEffect due to isEditing changing
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...(prev.stats || []), { key: "", value: "" }],
    }));
  };

  const addBackground = () => {
    setFormData((prev) => ({
      ...prev,
      background: [...(prev.background || []), { type: "", items: [{ period: "", desc: "" }] }],
    }));
  };

  const addBackgroundItem = (bgIndex) => {
    setFormData((prev) => {
      const updatedBackground = prev.background ? [...prev.background] : [];
      if (updatedBackground[bgIndex]) {
        updatedBackground[bgIndex].items = [
          ...(updatedBackground[bgIndex].items || []),
          { period: "", desc: "" },
        ];
      }
      return { ...prev, background: updatedBackground };
    });
  };

  if (!isEditing) {
    return (
      <div className="w-full p-4 mt-6 border-t">
        <button
          onClick={() => {
            setIsEditing(true); /* useEffect will handle form reset */
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          {prof?._id ? "Edit Profile" : "Create Profile"}
        </button>
        {prof?._id && (
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow ml-2"
            disabled={isSubmitting}
          >
            Delete Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full p-4 border-t-2 mt-4">
      <h2 className="text-2xl font-semibold mb-4">
        {prof?._id ? "Edit Profile" : "Create New Profile"}
      </h2>
      {isSubmitting && <LoadingSpinner message="Saving..." />}
      {formError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{formError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload with Preview */}
        <div className="border p-4 rounded-md shadow-sm">
          <label className="block mb-2 font-bold text-gray-700">Profile Image</label>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover border rounded-md"
                />
                <button
                  type="button"
                  onClick={resetImageSelection}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  aria-label="Remove selected image"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                onChange={handleImageFileChange}
                accept="image/*" // Key for querySelector
                className="w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-primary_main/10 file:text-primary_main
                           hover:file:bg-primary_main/20"
              />
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: JPEG, PNG, GIF. Max size: 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info Fields */}
        <input
          type="text"
          placeholder="Name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-primary_main focus:border-primary_main"
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={formData.role || ""}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-primary_main focus:border-primary_main"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.desc || ""}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-primary_main focus:border-primary_main"
          rows="4"
        />
        <input
          type="text"
          placeholder="Interests (comma-separated)"
          value={formData.interests || ""}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-primary_main focus:border-primary_main"
        />

        {/* Stats Section */}
        <div className="border p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-bold mb-2 text-gray-700">Stats</h3>
          {(formData.stats || []).map((stat, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-3 p-2 border-b">
              <input
                type="text"
                placeholder="Key (e.g., Publications)"
                value={stat.key}
                onChange={(e) => {
                  const newStats = [...(formData.stats || [])];
                  newStats[index].key = e.target.value;
                  setFormData({ ...formData, stats: newStats });
                }}
                className="flex-1 p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Value (e.g., 50)"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...(formData.stats || [])];
                  newStats[index].value = e.target.value;
                  setFormData({ ...formData, stats: newStats });
                }}
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  const newStats = [...(formData.stats || [])];
                  newStats.splice(index, 1);
                  setFormData({ ...formData, stats: newStats });
                }}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 text-sm"
              >
                Remove Stat
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStat}
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 text-sm"
          >
            Add Stat
          </button>
        </div>

        {/* Background Section */}
        <div className="border p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-bold mb-2 text-gray-700">Background</h3>
          {(formData.background || []).map((bg, bgIndex) => (
            <div key={bgIndex} className="mb-4 p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-3 border-b pb-2">
                <input
                  type="text"
                  placeholder="Type (e.g., Education, Academia)"
                  value={bg.type}
                  onChange={(e) => {
                    const newBg = [...(formData.background || [])];
                    newBg[bgIndex].type = e.target.value;
                    setFormData({ ...formData, background: newBg });
                  }}
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newBg = [...(formData.background || [])];
                    newBg.splice(bgIndex, 1);
                    setFormData({ ...formData, background: newBg });
                  }}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 text-sm"
                >
                  Remove Section
                </button>
              </div>
              {(bg.items || []).map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Period (e.g., 2010-2014)"
                    value={item.period}
                    onChange={(e) => {
                      const newBg = [...(formData.background || [])];
                      newBg[bgIndex].items[itemIndex].period = e.target.value;
                      setFormData({ ...formData, background: newBg });
                    }}
                    className="sm:w-1/3 p-2 border rounded-md"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.desc}
                    onChange={(e) => {
                      const newBg = [...(formData.background || [])];
                      newBg[bgIndex].items[itemIndex].desc = e.target.value;
                      setFormData({ ...formData, background: newBg });
                    }}
                    className="flex-1 p-2 border rounded-md"
                    rows="2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newBg = [...(formData.background || [])];
                      newBg[bgIndex].items.splice(itemIndex, 1);
                      setFormData({ ...formData, background: newBg });
                    }}
                    className="bg-red-400 text-white p-2 rounded-md hover:bg-red-500 text-sm self-start sm:self-center"
                  >
                    Remove Item
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBackgroundItem(bgIndex)}
                className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 text-sm mt-2"
              >
                Add Background Item
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBackground}
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 text-sm"
          >
            Add Background Section
          </button>
        </div>

        {/* CV Upload Section */}
        <div className="border p-4 rounded-md shadow-sm">
          <label className="block mb-2 font-bold text-gray-700">CV (PDF Document)</label>
          {formData.cvLink && !selectedCvFile && (
            <div className="mb-2 p-2 border border-gray-300 rounded bg-gray-50 flex justify-between items-center">
              <a
                href={formData.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                View Current CV ({getSuggestedFilenameFromUrl(formData.cvLink)})
              </a>
              <button
                type="button"
                onClick={handleRemoveCv}
                className="ml-4 text-sm text-red-600 hover:text-red-800 flex-shrink-0"
                aria-label="Remove current CV"
              >
                Remove
              </button>
            </div>
          )}
          {selectedCvFile && (
            <div className="mb-2 p-2 border border-blue-300 rounded bg-blue-50 flex justify-between items-center">
              <span className="text-gray-700 break-all">Selected: {selectedCvFile.name}</span>
              <button
                type="button"
                onClick={resetCvSelection}
                className="ml-4 text-sm text-orange-600 hover:text-orange-800 flex-shrink-0"
                aria-label="Clear selected CV file"
              >
                Clear
              </button>
            </div>
          )}
          {!formData.cvLink &&
            !selectedCvFile && ( // Show if no current CV and no file selected
              <p className="text-sm text-gray-500 mb-2">No CV uploaded.</p>
            )}
          <input
            type="file"
            onChange={handleCvFileChange}
            accept=".pdf" // Key for querySelector
            className="w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-primary_main/10 file:text-primary_main
                           hover:file:bg-primary_main/20"
          />
          <p className="mt-1 text-xs text-gray-500">Accepted format: PDF. Maximum size: 10MB.</p>
        </div>

        {/* Contact Info */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-primary_main focus:border-primary_main"
          required
        />
        <input
          type="tel"
          placeholder="Phone (e.g., +1-555-123-4567)"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-primary_main focus:border-primary_main"
        />

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 shadow disabled:opacity-50"
            disabled={isSubmitting}
          >
            {prof?._id ? "Save Changes" : "Create Profile"}
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 shadow"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

AdminProfessorControls.propTypes = {
  prof: PropTypes.object,
  setProf: PropTypes.func.isRequired,
};

const Intro = ({ prof }) => {
  if (!prof) return null;
  return (
    <div className="flex flex-col gap-[30px] w-full">
      {prof.img && (
        <div
          className="mx-auto w-full min-h-[360px] bg-gray-200 rounded-lg"
          style={{
            backgroundImage: `url(${prof.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={`${prof.name}'s profile image`}
        />
      )}
      <div className="flex flex-col gap-[10px] w-full">
        <div>
          <h2 className="font-semibold text-[16px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
            {prof.name}
          </h1>
        </div>
        {prof.desc && <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>}
        {prof.stats && prof.stats.length > 0 && (
          <div className="flex flex-col items-center gap-4 w-full py-6 ">
            <div className="flex justify-center gap-4 w-full">
              {prof.stats.slice(0, 2).map(
                (elem) =>
                  elem.key &&
                  elem.value && (
                    <div key={elem.key} className="max-w-[120px] text-center">
                      <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                      <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
                    </div>
                  )
              )}
            </div>
            {prof.stats.length > 2 && (
              <div className="flex justify-center gap-4 w-full mt-4">
                {prof.stats.slice(2, 5).map(
                  (elem) =>
                    elem.key &&
                    elem.value && (
                      <div key={elem.key} className="max-w-[120px] text-center">
                        <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                        <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
                      </div>
                    )
                )}
              </div>
            )}
            {prof.stats.length > 5 && (
              <div className="flex flex-wrap justify-center gap-4 w-full mt-4">
                {prof.stats.slice(5).map(
                  (elem) =>
                    elem.key &&
                    elem.value && (
                      <div key={elem.key} className="max-w-[120px] text-center">
                        <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                        <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        )}
        {prof.interests && (
          <div className="text-[12px]">
            <div className="font-bold">Research Interests</div>
            <div className="font-light leading-[14px] text-text_black_secondary">
              {prof.interests}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Intro.propTypes = {
  prof: PropTypes.object,
};

const Background = ({ list }) => {
  if (!list || list.length === 0) return null;
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-semibold text-[16px] text-primary_main">Background</h2>
      <div className="flex flex-col gap-[10px]">
        {list.map(
          (elem, index) =>
            elem.type &&
            elem.items && (
              <AccordionCard key={`${elem.type}-${index}`} title={elem.type} items={elem.items} />
            )
        )}
      </div>
    </div>
  );
};

Background.propTypes = {
  list: PropTypes.array,
};

const AccordionCard = ({ title, items }) => {
  const [expanded, setExpanded] = useState(false);
  const uniqueId = title.replace(/\s+/g, "-") + Math.random().toString(36).substr(2, 9);

  return (
    <div key={title} className="w-full relative">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={`flex justify-between items-center w-full relative border-b-text_black_primary py-2 text-left ${
          expanded ? "" : "border-b-[1px]"
        }`}
        aria-expanded={expanded}
        aria-controls={`accordion-content-${uniqueId}`}
      >
        <h2 className="font-semibold text-[36px] sm:text-[48px] leading-[40px] sm:leading-[48px] break-words mr-2">
          {title}
        </h2>
        <Down_straight_neutral_arrow
          className={`size-[30px] transform origin-center transition duration-300 ease-out text-white bg-primary_main rounded-full p-[5px] flex-shrink-0 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`accordion-content-${uniqueId}`}
        className={`grid transition-all duration-500 ease-in-out ${
          expanded ? "grid-rows-[1fr] py-[15px] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-hidden">
          {(items || []).map((item, index) => (
            <div
              key={`${item.period}-${index}`}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4"
            >
              {item.period && (
                <div className="font-semibold text-[11px] flex-shrink-0 sm:w-1/3">
                  {item.period}
                </div>
              )}
              {item.desc && <div className="font-light text-[11px] flex-1">{item.desc}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AccordionCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

const Links = ({ list }) => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-semibold text-[16px] text-primary_main">
        Professional Activities and Services
      </h2>
      <div className="flex flex-col gap-[10px]">
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Journal Papers</h2>
          <a href="/publications?type=journal" className="no-underline">
            <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
          </a>
        </div>
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Conference Papers</h2>
          <a href="/publications?type=conference" className="no-underline">
            <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
          </a>
        </div>
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Design Awards</h2>
          <a href="/publications?type=awards" className="no-underline">
            <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
          </a>
        </div>
      </div>
    </div>
  );
};

Links.propTypes = {
  list: PropTypes.array.isRequired,
};
