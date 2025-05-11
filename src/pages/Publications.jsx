/* eslint-disable react/prop-types */ // Consider adding full PropTypes
import PropTypes from "prop-types";
import { Down_left_dark_arrow } from "@/assets/"; // Renamed Link to LinkIcon
import { truncateText } from "@/utils/text"; // Ensure this utility exists
import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext"; // Adjust path
import { BASE_URL } from "@/config/api"; // Adjust path
import { LoadingSpinner } from "@/components"; // Adjust path

// --- Main Publications Page ---
export const Publications = () => {
  const { isAdmin } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  // Callback to trigger refetch in child lists
  const refetchPublications = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
    console.log("Refetch triggered"); // For debugging
  }, []);

  return (
    // Added min-h-dvh and no-scrollbar classes
    <div className="flex flex-col justify-start items-center pt-16 md:pt-[95px] w-full min-h-dvh overflow-y-scroll no-scrollbar">
      {/* Intro Section */}
      <div className="flex flex-col gap-[10px] px-4 md:px-[25px] py-8 w-full">
        <h2 className="font-bold text-5xl md:text-[48px] text-black leading-tight md:leading-[48px]">
          Publications
        </h2>
        <div className="border-text_black_secondary text-sm md:text-[12px] max-w-prose">
          We&apos;ve published world-class research and won prestigious design awards. Our students
          gain the integrated knowledge and experience needed to lead new product development,
          leading to successful careers after graduation.
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && <AdminControls onPublicationsUpdated={refetchPublications} />}

      {/* Publication Lists */}
      <PublicationList
        title="Journal Publications"
        bg="#ffffff"
        buttonBg="#ffffff"
        buttonBorderColor="#231F20" // Blue
        iconColor="#25AAE1"
        cardBg="#231F20"
        cartTextColor="#ffffff"
        listType="journal" // Use 'journal' to match schema/API
        refreshKey={refreshKey} // Pass down refresh key
      />
      <PublicationList
        title="Conference Publications"
        bg="#25AAE1" // Blue background
        buttonBg="#25AAE1"
        buttonBorderColor="#231F20" // White text/border
        iconColor="#ffffff"
        cardBg="#C1EDFF" // White card background
        cartTextColor="#231F20" // Black text
        listType="conference" // Use 'conference' to match schema/API
        refreshKey={refreshKey} // Pass down refresh key
      />
    </div>
  );
};

export default Publications;

// --- Publication List Component ---
const PublicationList = ({
  title,
  bg,
  buttonBg,
  buttonBorderColor,
  iconColor,
  cardBg,
  cartTextColor,
  listType,
  refreshKey,
}) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null); // null means 'All' initially
  const [availableYears, setAvailableYears] = useState([]); // Store unique years from fetched data

  // Fetch publications based on type
  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log(`Workspaceing ${listType}...`); // Debug log
    try {
      // Updated fetch URL
      const response = await fetch(`${BASE_URL}/publications/type/${listType}`);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setPublications(data);

      // Extract unique years, sort descending, limit to first 4 for buttons
      const years = [...new Set(data.map((item) => item.year).filter(Boolean))].sort(
        (a, b) => b - a
      );
      setAvailableYears(years); // Store all available years
    } catch (err) {
      console.error(`Error fetching ${listType}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listType]); // Dependency: only refetch if listType changes

  // Effect to fetch data on initial render and when refreshKey changes
  useEffect(() => {
    fetchPublications();
  }, [fetchPublications, refreshKey]); // Add refreshKey dependency

  // Filter buttons logic: Show top N years + Archive + All
  const displayYearsCount = 4;
  const topYears = availableYears.slice(0, displayYearsCount);
  const archiveYears = availableYears.slice(displayYearsCount);
  const showArchiveButton = archiveYears.length > 0;

  // Filtering logic based on selectedYear
  const filteredList = publications.filter((item) => {
    if (selectedYear === null) return true; // Show all
    if (selectedYear === "Archive") return archiveYears.includes(item.year);
    return item.year === selectedYear; // Filter by specific year
  });

  // Decide how many items to show (e.g., show all if a filter is selected, otherwise maybe limit)
  // For simplicity now, show all filtered items. Could add slicing like `filteredList.slice(0, 5)` if needed for 'All'.

  // Handle button click
  const handleFilterClick = (year) => {
    setSelectedYear((prev) => (prev === year ? null : year)); // Toggle selection, null for All
  };

  return (
    <div
      className="w-full flex flex-col gap-6 md:gap-[30px] py-6 md:py-[30px]"
      style={{ backgroundColor: bg }}
    >
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px]">
        <div className="flex justify-between items-end">
          <h2 className="font-semibold text-5xl text-black ">{title}</h2>
          <Down_left_dark_arrow
            className="size-16"
            style={{ color: iconColor, path: { strokeWidth: 1 } }}
          />
        </div>
        {/* Filter Buttons */}
        {availableYears.length > 0 && (
          <div className="flex flex-wrap gap-2 md:gap-[12px] text-sm md:text-[16px] font-medium">
            {/* All Button */}
            <button
              className="rounded-full px-4 py-1 md:px-[24px] md:py-[8px] border-2 transition-colors duration-150"
              onClick={() => handleFilterClick(null)}
              style={{
                borderColor: buttonBorderColor,
                backgroundColor: selectedYear === null ? buttonBorderColor : buttonBg,
                color: selectedYear === null ? buttonBg : buttonBorderColor,
              }}
            >
              All
            </button>
            {/* Top Year Buttons */}
            {topYears.map((year) => (
              <button
                className="rounded-full px-4 py-1 md:px-[24px] md:py-[8px] border-2 transition-colors duration-150"
                style={{
                  borderColor: buttonBorderColor,
                  backgroundColor: selectedYear === year ? buttonBorderColor : buttonBg,
                  color: selectedYear === year ? buttonBg : buttonBorderColor,
                }}
                key={year}
                onClick={() => handleFilterClick(year)}
              >
                {year}
              </button>
            ))}
            {/* Archive Button */}
            {showArchiveButton && (
              <button
                className="rounded-full px-4 py-1 md:px-[24px] md:py-[8px] border-2 transition-colors duration-150"
                onClick={() => handleFilterClick("Archive")}
                style={{
                  borderColor: buttonBorderColor,
                  backgroundColor: selectedYear === "Archive" ? buttonBorderColor : buttonBg,
                  color: selectedYear === "Archive" ? buttonBg : buttonBorderColor,
                }}
              >
                Archive
              </button>
            )}
          </div>
        )}
      </div>

      {/* Publication Items */}
      <div className="flex flex-col gap-4 px-4 h-72 w-full">
        {loading && <div className="text-center p-4">Loading {title}...</div>}
        {error && (
          <div className="text-center p-4 text-red-600">
            Error loading {title}: {error}
          </div>
        )}
        {!loading && !error && filteredList.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No{" "}
            {selectedYear
              ? `publications found for ${selectedYear}`
              : `${title} publications found`}
            .
          </div>
        )}
        {!loading &&
          !error &&
          filteredList.map((item) => (
            <div
              key={item._id}
              // Responsive width, min-height instead of fixed height
              className="flex flex-col justify-between p-4 rounded-2xl h-full shrink-0"
              style={{ backgroundColor: cardBg }}
            >
              {/* Paper Title */}
              <a
                href={item.link}
                target="_blank"
                className="text-sm underline sm:text-[16px] break-words"
                style={{ color: cartTextColor }}
              >
                {truncateText(item.title, 130)} {/* Slightly less truncation */}
              </a>
              {/* Paper Details & Link */}
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col text-sm text-[#10719A] truncate">
                  {item.authors.map((author, index) => (
                    <span key={index}>{author}</span>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-1" style={{ color: cartTextColor }}>
                  {item.year && (
                    <div className=" text-xl" style={{ opacity: "70%" }}>
                      {item.year}
                    </div>
                  )}
                  {item.venue && <div className=" font-bold text-base">{item.venue}</div>}
                  {item.location && (
                    <div className=" text-xl" style={{ opacity: "80%" }}>
                      {item.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Update PropTypes
PublicationList.propTypes = {
  title: PropTypes.string.isRequired,
  bg: PropTypes.string,
  buttonBg: PropTypes.string,
  buttonText: PropTypes.string,
  iconColor: PropTypes.string,
  listType: PropTypes.oneOf(["journal", "conference"]).isRequired, // Updated types
  refreshKey: PropTypes.number.isRequired, // Added refreshKey
};

// --- Admin Controls Component ---
const AdminControls = ({ onPublicationsUpdated }) => {
  const { adminToken } = useAdmin();
  const [publications, setPublications] = useState([]); // List for editing/deleting
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState(""); // Comma-separated input
  const [venue, setVenue] = useState(""); // Journal or Conference Name
  const [year, setYear] = useState("");
  const [doi, setDoi] = useState("");
  const [link, setLink] = useState("");
  const [abstract, setAbstract] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("journal"); // Default type
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  // Operation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Fetch all publications for admin list
  const fetchAllAdminPublications = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      // Use the admin endpoint (GET /publications)
      const response = await fetch(`${BASE_URL}/publications`, {
        headers: {
          Authorization: `Bearer ${adminToken}`, // Auth needed for admin list
        },
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setPublications(data);
    } catch (error) {
      console.error("Error fetching publications for admin:", error);
      setListError(error.message);
    } finally {
      setIsLoadingList(false);
    }
  }, [adminToken]); // Re-fetch if token changes

  useEffect(() => {
    fetchAllAdminPublications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPublicationsUpdated]); // Use the callback prop as dependency

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setAuthors("");
    setVenue("");
    setYear("");
    setDoi("");
    setLink("");
    setAbstract("");
    setLocation("");
    setType("journal");
    setSelectedFile(null);
    setCurrentImageUrl(null);
    setIsCreating(false);
    setIsEditing(false);
    setEditingPublication(null);
    setSubmitError(null);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => setCurrentImageUrl(e.target.result); // Show preview
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setSelectedFile(null);
      setCurrentImageUrl(editingPublication?.image || null); // Restore original if editing
    }
  };

  // Image upload helper
  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("images", file); // Match backend expected field name
    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse
          .json()
          .catch(() => ({ message: `Image upload failed with status: ${uploadResponse.status}` }));
        throw new Error(errorData.message);
      }
      const uploadedUrls = await uploadResponse.json();
      return uploadedUrls[0] || null;
    } catch (error) {
      console.error("Image upload error:", error);
      setSubmitError(`Image Upload Failed: ${error.message}`);
      return null; // Indicate failure
    }
  };

  // Convert comma-separated author string to array
  const parseAuthors = (authorString) => {
    return authorString
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);
  };

  // Handle Create
  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    const authorsArray = parseAuthors(authors);

    if (!title || authorsArray.length === 0 || !year || !type) {
      setSubmitError("Title, Authors, Year, and Type are required.");
      return;
    }
    if (isNaN(parseInt(year, 10))) {
      setSubmitError("Year must be a number.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl = null;
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
      if (imageUrl === null) {
        setIsSubmitting(false);
        return;
      }
    }

    const pubData = {
      title,
      authors: authorsArray,
      venue,
      year: parseInt(year, 10),
      doi,
      link,
      abstract,
      type,
      location,
      image: imageUrl,
    };

    try {
      const response = await fetch(`${BASE_URL}/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(pubData),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `Failed to create. Status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      resetForm();
      onPublicationsUpdated(); // Trigger refetch
    } catch (error) {
      console.error("Error creating publication:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Button Click
  const handleEdit = (pub) => {
    resetForm();
    setIsEditing(true);
    setIsCreating(false);
    setEditingPublication(pub);
    setTitle(pub.title);
    setAuthors(pub.authors.join(", ")); // Join array for input
    setVenue(pub.venue || "");
    setYear(pub.year.toString());
    setDoi(pub.doi || "");
    setLink(pub.link || "");
    setAbstract(pub.abstract || "");
    setLocation(pub.location || "");
    setType(pub.type);
    setCurrentImageUrl(pub.image || null);
    setSelectedFile(null);
  };

  // Handle Update
  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingPublication) return;
    setSubmitError(null);
    const authorsArray = parseAuthors(authors);

    if (!title || authorsArray.length === 0 || !year || !type) {
      setSubmitError("Title, Authors, Year, and Type are required.");
      return;
    }
    if (isNaN(parseInt(year, 10))) {
      setSubmitError("Year must be a number.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl = editingPublication.image; // Start with current URL
    if (selectedFile) {
      // If new file selected, upload it
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl === null) {
        setIsSubmitting(false);
        return;
      } // Upload failed
      imageUrl = uploadedUrl;
    } else if (currentImageUrl === null && editingPublication.image) {
      // If preview was cleared AND there was an existing image, set to undefined to remove
      imageUrl = undefined; // Signal backend to remove if different from old
    }

    const pubData = {
      title,
      authors: authorsArray,
      venue,
      year: parseInt(year, 10),
      doi,
      link,
      abstract,
      type,
      location,
      image: imageUrl, // Send final URL (new, old, or undefined)
    };
    // Remove undefined keys to avoid overwriting with nothing
    Object.keys(pubData).forEach((key) => pubData[key] === undefined && delete pubData[key]);

    try {
      const response = await fetch(`${BASE_URL}/publications/${editingPublication._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(pubData),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `Failed to update. Status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      resetForm();
      onPublicationsUpdated(); // Trigger refetch
    } catch (error) {
      console.error("Error updating publication:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publication and its image?")) {
      setDeletingId(id);
      setSubmitError(null);
      try {
        const response = await fetch(`${BASE_URL}/publications/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: `Failed to delete. Status: ${response.status}` }));
          throw new Error(errorData.message);
        }
        onPublicationsUpdated(); // Trigger refetch
        if (editingPublication?._id === id) resetForm(); // Clear form if editing deleted item
      } catch (error) {
        console.error("Error deleting publication:", error);
        setSubmitError(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Common Form Fields JSX
  const publicationFormFields = (
    <>
      {submitError && (
        <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-300 rounded">
          {submitError}
        </div>
      )}
      {/* Title, Type, Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white"
            required
            disabled={isSubmitting}
          >
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      {/* Authors (Comma-separated) */}
      <div className="mb-4">
        <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
          Authors (comma-separated) *
        </label>
        <input
          type="text"
          id="authors"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          required
          disabled={isSubmitting}
          placeholder="Doe, J., Smith, A."
        />
      </div>
      {/* Venue (Journal/Conference Name) */}
      <div className="mb-4">
        <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
          {type === "journal" ? "Journal Name" : "Conference/Venue Name"}
        </label>
        <input
          type="text"
          id="venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
        />
      </div>
      {/* DOI & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="doi" className="block text-sm font-medium text-gray-700 mb-1">
            DOI (Digital Object Identifier)
          </label>
          <input
            type="text"
            id="doi"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
            disabled={isSubmitting}
            placeholder="10.1234/abcd.efgh"
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Link (URL)
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm"
            disabled={isSubmitting}
            placeholder="https://..."
          />
        </div>
      </div>
      {/* Abstract */}
      <div className="mb-4">
        <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-1">
          Abstract
        </label>
        <textarea
          id="abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
          Location (City, Country)
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          disabled={isSubmitting}
          placeholder="Seoul, South Korea"
        />
      </div>
      {/* Image Upload */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          {isEditing ? "Replace Image" : "Image (Optional)"}
        </label>
        {currentImageUrl && (
          <div className="my-2 relative w-40 h-auto aspect-[4/3]">
            {" "}
            {/* Aspect ratio */}
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded border"
            />
            {isEditing && editingPublication?.image && (
              <button
                type="button"
                onClick={() => {
                  setCurrentImageUrl(null);
                  setSelectedFile(null);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none focus:outline-none hover:bg-red-600"
                title="Remove Image"
                disabled={isSubmitting}
              >
                {" "}
                &times;{" "}
              </button>
            )}
          </div>
        )}
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isSubmitting}
        />
      </div>
    </>
  );

  return (
    <div className="w-full p-4">
      <div className="flex flex-wrap justify-between items-center w-full p-4 border my-8 bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Admin: Manage Publications</h3>

        {(isSubmitting || deletingId || isLoadingList) && (
          <LoadingSpinner
            message={
              isLoadingList
                ? "Loading list..."
                : isSubmitting
                ? isCreating
                  ? "Creating..."
                  : "Updating..."
                : "Deleting..."
            }
          />
        )}

        {/* Add New Button */}
        {!isCreating && !isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-4 transition-colors duration-200 disabled:opacity-50"
            disabled={isSubmitting || !!deletingId || isLoadingList}
          >
            + Add New Publication
          </button>
        )}

        {/* List Publications */}
        {!isCreating && !isEditing && (
          <div className="w-full  space-y-2 max-h-96 overflow-y-auto pr-2">
            {" "}
            {/* Added scroll for long lists */}
            {listError && (
              <div className="p-2 text-red-700 bg-red-100 border border-red-300 rounded">
                Error loading list: {listError}
              </div>
            )}
            {isLoadingList && !publications.length && (
              <div className="w-full">Loading publication list...</div>
            )}
            {publications.map((pub) => (
              <div
                key={pub._id}
                className="border rounded p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-white shadow-sm"
              >
                <div className="flex items-start gap-3 flex-grow">
                  {pub.image && (
                    <img
                      src={pub.image}
                      alt=""
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold">{truncateText(pub.title, 100)}</p>
                    <p className="text-xs text-gray-500">
                      {pub.authors.slice(0, 2).join(", ")}
                      {pub.authors.length > 2 ? " et al." : ""} ({pub.year}, {pub.type})
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 px-2 rounded text transition-colors duration-200 disabled:opacity-50"
                    disabled={isSubmitting || !!deletingId || isLoadingList}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pub._id)}
                    className={`bg-red-500 hover:bg-red-600 text-white p-1 px-2 rounded text transition-colors duration-200 ${
                      deletingId === pub._id ? "opacity-50 cursor-wait" : ""
                    } disabled:opacity-50`}
                    disabled={isSubmitting || !!deletingId || isLoadingList}
                  >
                    {deletingId === pub._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
            {!isLoadingList && !listError && publications.length === 0 && (
              <p className="text-gray-500">No publications found.</p>
            )}
          </div>
        )}

        {/* Create Form */}
        {isCreating && (
          <div className="p-4 border rounded mt-4 bg-white shadow-md">
            <h4 className="text-lg font-medium mb-3">Create New Publication</h4>
            <form onSubmit={handleCreate}>
              {publicationFormFields}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Publication"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-600 hover:text-gray-800 p-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && editingPublication && (
          <div className="p-4 border rounded mt-4 bg-white shadow-md">
            <h4 className="text-lg font-medium mb-3">Edit Publication</h4>
            <form onSubmit={handleUpdate}>
              {publicationFormFields}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Publication"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-600 hover:text-gray-800 p-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

AdminControls.propTypes = {
  onPublicationsUpdated: PropTypes.func.isRequired,
};
