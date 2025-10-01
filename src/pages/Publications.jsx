/* eslint-disable react/prop-types */ // Consider adding full PropTypes
import PropTypes from "prop-types";
import { Down_left_dark_arrow } from "@/assets/";
import { truncateText } from "@/utils/text";
import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
import { LoadingSpinner, AdminMetaControls } from "@/components"; // Added AdminMetaControls

// --- Main Publications Page ---
export const Publications = () => {
  const { isAdmin } = useAdmin();
  const [refreshKey, setRefreshKey] = useState(0);

  // --- Overall Publications Page Meta ---
  const [publicationsPageMeta, setPublicationsPageMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshPageMetaKey, setRefreshPageMetaKey] = useState(0);

  const defaultPublicationsPageMeta = useMemo(
    () => ({
      title: "",
      description: "",
    }),
    []
  );

  const fetchPublicationsPageMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/meta/publications`); // e.g., /meta/publications-main
      if (!response.ok) {
        if (response.status === 404) {
          setPublicationsPageMeta(defaultPublicationsPageMeta);
          document.title = defaultPublicationsPageMeta.title + " - I&I Design Lab";
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setPublicationsPageMeta(data);
        document.title = (data.title || defaultPublicationsPageMeta.title) + " - I&I Design Lab";
      }
    } catch (err) {
      setMetaError(err.message);
      setPublicationsPageMeta(defaultPublicationsPageMeta);
      document.title = defaultPublicationsPageMeta.title + " - I&I Design Lab";
      console.error("Failed to fetch publications page meta:", err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultPublicationsPageMeta]);

  useEffect(() => {
    fetchPublicationsPageMeta();
  }, [fetchPublicationsPageMeta, refreshPageMetaKey]);
  const handlePublicationsPageMetaUpdated = () => setRefreshPageMetaKey((prev) => prev + 1);

  // Callback to trigger refetch in child lists
  const refetchPublications = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const currentPageTitle = publicationsPageMeta?.title || defaultPublicationsPageMeta.title;
  const currentPageDescription =
    publicationsPageMeta?.description || defaultPublicationsPageMeta.description;

  return (
    <div className="flex flex-col justify-start items-center pt-16 md:pt-[95px] w-full overflow-y-scroll no-scrollbar">
      {/* Overall Publications Page Meta Controls */}
      {isAdmin && publicationsPageMeta && (
        <AdminMetaControls
          pageIdentifier="publications" // For the main publications page meta
          initialData={publicationsPageMeta}
          fieldsConfig={[
            {
              name: "title",
              label: "Publications Page Title (Document Title & Header)",
              type: "text",
            },
            { name: "description", label: "Publications Page Main Introduction", type: "textarea" },
          ]}
          onUpdateSuccess={handlePublicationsPageMetaUpdated}
          containerClass="w-full max-w-screen-xl mx-auto px-4 md:px-[25px] py-2 bg-gray-50 rounded-b-lg shadow mb-6"
        />
      )}
      {metaLoading && (
        <div className="text-center py-6">
          <LoadingSpinner variant="block" message="Loading page details..." />
        </div>
      )}
      {metaError && (
        <div className="text-red-500 text-center p-4">Error loading page details: {metaError}</div>
      )}

      {(!metaLoading || publicationsPageMeta) && (
        <div className="flex flex-col gap-[10px] px-4 md:px-[25px] py-8 w-full max-w-screen-xl mx-auto">
          <h1 className="font-bold text-5xl md:text-[48px] text-black leading-tight md:leading-[48px]">
            {currentPageTitle}
          </h1>
          {currentPageDescription && (
            <div className="border-text_black_secondary text-sm md:text-[12px] max-w-prose">
              {currentPageDescription}
            </div>
          )}
        </div>
      )}

      {isAdmin && <AdminControls onPublicationsUpdated={refetchPublications} />}

      <PublicationList
        titleKey="journal" // Unique key for meta fetching (e.g., 'publications-journal')
        defaultTitle="Journal Publications"
        defaultDescription="Explore our peer-reviewed journal articles."
        bg="#ffffff"
        buttonBg="#ffffff"
        buttonBorderColor="#231F20"
        iconColor="#25AAE1"
        cardBg="#231F20"
        cartTextColor="#ffffff"
        listType="journal"
        refreshKey={refreshKey}
      />
      <PublicationList
        titleKey="conference" // Unique key for meta fetching (e.g., 'publications-conference')
        defaultTitle="Conference Publications"
        defaultDescription="Discover our contributions to academic conferences."
        bg="#25AAE1"
        buttonBg="#25AAE1"
        buttonBorderColor="#231F20"
        iconColor="#ffffff"
        cardBg="#C1EDFF"
        cartTextColor="#231F20"
        listType="conference"
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default Publications;

// --- Publication List Component ---
const PublicationList = ({
  titleKey, // New prop for meta identifier
  defaultTitle, // New prop for default title
  defaultDescription, // New prop for default description
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
  const [loading, setLoading] = useState(true); // For publication items
  const [error, setError] = useState(null); // For publication items
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const { isAdmin } = useAdmin();

  // --- Section Meta State ---
  const [sectionMeta, setSectionMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshSectionMetaKey, setRefreshSectionMetaKey] = useState(0);

  const defaultSectionMeta = useMemo(
    () => ({
      title: defaultTitle,
      description: defaultDescription,
    }),
    [defaultTitle, defaultDescription]
  );

  const fetchSectionMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/meta/publications-${titleKey}`);
      if (!response.ok) {
        if (response.status === 404) {
          setSectionMeta(defaultSectionMeta);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setSectionMeta(data);
      }
    } catch (err) {
      setMetaError(err.message);
      setSectionMeta(defaultSectionMeta);
      console.error(`Failed to fetch meta for publications-${titleKey}:`, err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultSectionMeta, titleKey]);

  useEffect(() => {
    fetchSectionMeta();
  }, [fetchSectionMeta, refreshSectionMetaKey]);
  const handleSectionMetaUpdated = () => setRefreshSectionMetaKey((prev) => prev + 1);

  // Fetch publications
  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/publications?type=${listType}`);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setPublications(data);
      const years = [...new Set(data.map((item) => item.year).filter(Boolean))].sort(
        (a, b) => b - a
      );
      setAvailableYears(years);
    } catch (err) {
      console.error(`Error fetching ${listType}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listType]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications, refreshKey]);

  const displayYearsCount = 4;
  const topYears = availableYears.slice(0, displayYearsCount);
  const archiveYears = availableYears.slice(displayYearsCount);
  const showArchiveButton = archiveYears.length > 0;

  const filteredList = publications.filter((item) => {
    if (selectedYear === null) return true;
    if (selectedYear === "Archive") return archiveYears.includes(item.year);
    return item.year === selectedYear;
  });

  const handleFilterClick = (year) => {
    setSelectedYear((prev) => (prev === year ? null : year));
  };

  const currentSectionTitle = sectionMeta?.title || defaultSectionMeta.title;
  const currentSectionDescription = sectionMeta?.description;

  return (
    <div
      className="w-full flex flex-col gap-6 md:gap-[30px] py-6 md:py-[30px] shrink-0"
      style={{ backgroundColor: bg }}
    >
      <div className="flex flex-col gap-4 md:gap-[25px] px-4 md:px-[25px] max-w-screen-xl mx-auto w-full">
        {isAdmin && sectionMeta && (
          <AdminMetaControls
            pageIdentifier={`publications-${titleKey}`}
            initialData={sectionMeta}
            fieldsConfig={[
              { name: "title", label: `${defaultTitle} Section Title`, type: "text" },
              {
                name: "description",
                label: `${defaultTitle} Section Introduction`,
                type: "textarea",
              },
            ]}
            onUpdateSuccess={handleSectionMetaUpdated}
            containerClass="py-2 bg-gray-100 rounded-lg shadow my-2" // Generic styling
          />
        )}
        {metaLoading && (
          <div className="text-center py-4">
            <LoadingSpinner variant="block" message="Loading section details..." />
          </div>
        )}
        {metaError && (
          <div className={`text-center p-4 ${bg === "#ffffff" ? "text-red-600" : "text-red-300"}`}>
            Error: {metaError}
          </div>
        )}

        {(!metaLoading || sectionMeta) && (
          <>
            <div className="flex justify-between items-end">
              <h2
                className={`font-semibold text-4xl md:text-5xl ${
                  bg === "#ffffff" ? "text-black" : "text-white"
                }`}
              >
                {currentSectionTitle}
              </h2>
              <Down_left_dark_arrow
                className="size-12 md:size-16"
                style={{ color: iconColor, path: { strokeWidth: 1 } }}
              />
            </div>
            {currentSectionDescription && (
              <p
                className={`text-sm max-w-3xl ${
                  bg === "#ffffff" ? "text-text_black_secondary" : "text-gray-200"
                }`}
              >
                {currentSectionDescription}
              </p>
            )}
          </>
        )}

        {availableYears.length > 0 && (
          <div className="flex flex-wrap gap-2 md:gap-[12px] text-sm md:text-[16px] font-medium">
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

      <div className="flex flex-col gap-4 px-4 md:px-[25px] w-full max-w-screen-xl mx-auto">
        {loading && (
          <div
            className={`text-center p-4 ${bg === "#ffffff" ? "text-gray-700" : "text-gray-200"}`}
          >
            <LoadingSpinner variant="block" message={`Loading ${defaultTitle}...`} />
          </div>
        )}
        {error && (
          <div className={`text-center p-4 ${bg === "#ffffff" ? "text-red-600" : "text-red-300"}`}>
            Error loading {defaultTitle}: {error}
          </div>
        )}
        {!loading && !error && filteredList.length === 0 && (
          <div
            className={`text-center p-4 ${bg === "#ffffff" ? "text-gray-500" : "text-gray-300"}`}
          >
            No{" "}
            {selectedYear
              ? `publications found for ${selectedYear}`
              : `${defaultTitle.toLowerCase()} found`}
            .
          </div>
        )}
        {!loading &&
          !error &&
          filteredList.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between p-4 rounded-2xl h-full shrink-0 shadow-md"
              style={{ backgroundColor: cardBg }}
            >
              <a
                href={item.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline sm:text-[16px] break-words font-medium hover:opacity-80"
                style={{ color: cartTextColor }}
              >
                {truncateText(item.title, 130)}
              </a>
              <div className="flex justify-between items-end mt-4">
                <div
                  className="flex flex-col text-xs sm:text-sm truncate w-3/5"
                  style={{ color: listType === "journal" ? "#08DBE9" : "#10719A" }}
                >
                  {" "}
                  {/* Dynamic author color */}
                  {item.authors.slice(0, 3).map((author, index) => (
                    <span key={index} className="truncate" title={author}>
                      {author}
                    </span>
                  ))}
                  {item.authors.length > 3 && <span className="truncate italic">et al.</span>}
                </div>
                <div
                  className="flex flex-col items-end gap-1 text-right"
                  style={{ color: cartTextColor }}
                >
                  {item.year && <div className="text-lg sm:text-xl opacity-80">{item.year}</div>}
                  {item.venue && (
                    <div
                      className="font-bold text-xs sm:text-sm max-w-[100px] sm:max-w-[150px] truncate"
                      title={item.venue}
                    >
                      {item.venue}
                    </div>
                  )}
                  {item.location && (
                    <div
                      className="text-xs sm:text-sm opacity-70 max-w-[100px] sm:max-w-[150px] truncate"
                      title={item.location}
                    >
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

PublicationList.propTypes = {
  titleKey: PropTypes.string.isRequired,
  defaultTitle: PropTypes.string.isRequired,
  defaultDescription: PropTypes.string,
  bg: PropTypes.string,
  buttonBg: PropTypes.string,
  buttonBorderColor: PropTypes.string,
  iconColor: PropTypes.string,
  cardBg: PropTypes.string,
  cartTextColor: PropTypes.string,
  listType: PropTypes.oneOf(["journal", "conference"]).isRequired,
  refreshKey: PropTypes.number.isRequired,
};

// --- Admin Controls Component ---
const AdminControls = ({ onPublicationsUpdated }) => {
  const { adminToken } = useAdmin();
  const [publications, setPublications] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [venue, setVenue] = useState("");
  const [year, setYear] = useState("");
  const [doi, setDoi] = useState("");
  const [link, setLink] = useState("");
  const [abstract, setAbstract] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("journal");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const fetchAllAdminPublications = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/publications`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setPublications(
        data.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
        )
      );
    } catch (error) {
      console.error("Error fetching publications for admin:", error);
      setListError(error.message);
    } finally {
      setIsLoadingList(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchAllAdminPublications();
  }, [fetchAllAdminPublications, onPublicationsUpdated]);

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

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCurrentImageUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setCurrentImageUrl(editingPublication?.image || null);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse
          .json()
          .catch(() => ({ message: `Image upload failed: ${uploadResponse.status}` }));
        throw new Error(errorData.message);
      }
      const uploadResult = await uploadResponse.json();
      const uploadedUrls = uploadResult.urls || [];
      return uploadedUrls[0] || null;
    } catch (error) {
      console.error("Image upload error:", error);
      setSubmitError(`Image Upload Failed: ${error.message}`);
      return null;
    }
  };

  const parseAuthors = (authorString) =>
    authorString
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

  const handleSubmit = async (event) => {
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
    let finalImageUrl = isEditing ? editingPublication?.image || null : null;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl === null && selectedFile) {
        setIsSubmitting(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (isEditing && currentImageUrl === null && editingPublication?.image) {
      finalImageUrl = undefined; // Signal removal
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
      image: finalImageUrl,
    };
    Object.keys(pubData).forEach((key) => pubData[key] === undefined && delete pubData[key]);

    const url = isEditing
      ? `${BASE_URL}/publications/${editingPublication._id}`
      : `${BASE_URL}/publications`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(pubData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Failed to ${isEditing ? "update" : "create"}. Status: ${response.status}`,
        }));
        throw new Error(errorData.message);
      }
      resetForm();
      onPublicationsUpdated();
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} publication:`, error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pub) => {
    resetForm();
    setIsEditing(true);
    setIsCreating(false);
    setEditingPublication(pub);
    setTitle(pub.title);
    setAuthors(pub.authors.join(", "));
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publication and its image?")) {
      setDeletingId(id);
      setSubmitError(null);
      try {
        const response = await fetch(`${BASE_URL}/api/publications/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: `Failed to delete. Status: ${response.status}` }));
          throw new Error(errorData.message);
        }
        onPublicationsUpdated();
        if (editingPublication?._id === id) resetForm();
      } catch (error) {
        console.error("Error deleting publication:", error);
        setSubmitError(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100";
  const buttonClass =
    "font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50";
  const primaryButtonClass = `bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`;
  const secondaryButtonClass = `bg-gray-200 hover:bg-gray-300 text-gray-700 ${buttonClass}`;
  const dangerButtonClass = `bg-red-600 hover:bg-red-700 text-white ${buttonClass} text-xs px-3 py-1.5`;
  const warningButtonClass = `bg-yellow-500 hover:bg-yellow-600 text-white ${buttonClass} text-xs px-3 py-1.5`;
  const successButtonClass = `bg-green-600 hover:bg-green-700 text-white ${buttonClass}`;

  const publicationFormFields = (
    <>
      {submitError && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
          {submitError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="pub-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="pub-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="pub-type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="pub-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${inputClass} bg-white`}
            required
            disabled={isSubmitting}
          >
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
          </select>
        </div>
        <div>
          <label htmlFor="pub-year" className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <input
            type="number"
            id="pub-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
            className={inputClass}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="pub-authors" className="block text-sm font-medium text-gray-700 mb-1">
          Authors (comma-separated) *
        </label>
        <input
          type="text"
          id="pub-authors"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          className={inputClass}
          required
          disabled={isSubmitting}
          placeholder="Doe, J., Smith, A."
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pub-venue" className="block text-sm font-medium text-gray-700 mb-1">
          {type === "journal" ? "Journal Name" : "Conference/Venue Name"}
        </label>
        <input
          type="text"
          id="pub-venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className={inputClass}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="pub-doi" className="block text-sm font-medium text-gray-700 mb-1">
            DOI
          </label>
          <input
            type="text"
            id="pub-doi"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
            placeholder="10.1234/abcd.efgh"
          />
        </div>
        <div>
          <label htmlFor="pub-link" className="block text-sm font-medium text-gray-700 mb-1">
            Link (URL)
          </label>
          <input
            type="url"
            id="pub-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="pub-abstract" className="block text-sm font-medium text-gray-700 mb-1">
          Abstract
        </label>
        <textarea
          id="pub-abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          rows="4"
          className={inputClass}
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pub-location" className="block text-sm font-medium text-gray-700 mb-1">
          Location (City, Country)
        </label>
        <input
          type="text"
          id="pub-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={inputClass}
          disabled={isSubmitting}
          placeholder="Seoul, South Korea"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pub-image" className="block text-sm font-medium text-gray-700 mb-1">
          {isEditing && editingPublication?.image ? "Replace Image (Optional)" : "Image (Optional)"}
        </label>
        {currentImageUrl && (
          <div className="my-2 relative w-40 h-auto aspect-[4/3]">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded border border-gray-300"
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
                ×
              </button>
            )}
          </div>
        )}
        <input
          type="file"
          id="pub-image"
          accept="image/*"
          onChange={handleFileChange}
          className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          disabled={isSubmitting}
        />
      </div>
    </>
  );

  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="p-4 sm:p-6 border border-gray-200 rounded-lg my-8 bg-gray-50 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Admin: Manage Publications
          </h3>
          {!isCreating && !isEditing && (
            <button
              onClick={() => {
                resetForm();
                setIsCreating(true);
              }}
              className={successButtonClass}
              disabled={isSubmitting || !!deletingId || isLoadingList}
            >
              + Add New Publication
            </button>
          )}
        </div>
        {(isSubmitting || !!deletingId || isLoadingList) && (
          <div className="my-4">
            <LoadingSpinner
              message={
                isLoadingList
                  ? "Loading list..."
                  : isSubmitting
                  ? isCreating
                    ? "Creating..."
                    : "Updating..."
                  : deletingId
                  ? "Deleting..."
                  : "Processing..."
              }
            />
          </div>
        )}
        {!isCreating && !isEditing && (
          <div className="w-full space-y-3 max-h-96 overflow-y-auto pr-2">
            {listError && (
              <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
                Error loading list: {listError}
              </div>
            )}
            {!isLoadingList &&
              publications.map((pub) => (
                <div
                  key={pub._id}
                  className="border border-gray-200 rounded-md p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    {pub.image && (
                      <img
                        src={pub.image}
                        alt={truncateText(pub.title, 20)}
                        className="w-12 h-12 object-cover rounded flex-shrink-0 border"
                      />
                    )}
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold text-gray-800 truncate" title={pub.title}>
                        {truncateText(pub.title, 60)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pub.authors.slice(0, 1).join(", ")}
                        {pub.authors.length > 1 ? " et al." : ""} ({pub.year},{" "}
                        <span className="capitalize">{pub.type}</span>)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-end md:self-center mt-2 md:mt-0">
                    <button
                      onClick={() => handleEdit(pub)}
                      className={warningButtonClass}
                      disabled={isSubmitting || !!deletingId || isLoadingList}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pub._id)}
                      className={`${dangerButtonClass} ${
                        deletingId === pub._id ? "opacity-50 cursor-wait" : ""
                      }`}
                      disabled={isSubmitting || !!deletingId || isLoadingList}
                    >
                      {deletingId === pub._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            {!isLoadingList && !listError && publications.length === 0 && (
              <p className="text-gray-500 italic text-center py-4">
                No publications found. Click &quot;Add New Publication&quot; to create one.
              </p>
            )}
          </div>
        )}
        {(isCreating || isEditing) && (
          <div className="p-4 border border-gray-200 rounded-md mt-4 bg-white shadow-md w-full">
            <h4 className="text-lg font-medium mb-4 text-gray-700">
              {isCreating
                ? "Create New Publication"
                : `Edit Publication: ${truncateText(editingPublication?.title || "", 40)}`}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              {publicationFormFields}
              <div className="flex gap-4 pt-2">
                <button type="submit" className={primaryButtonClass} disabled={isSubmitting}>
                  {isSubmitting
                    ? isCreating
                      ? "Creating..."
                      : "Updating..."
                    : isCreating
                    ? "Create Publication"
                    : "Update Publication"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={secondaryButtonClass}
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
