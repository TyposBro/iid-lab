// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { MainCarousel, LoadingSpinner, Filter } from "@/components"; // Ensure Filter is correctly imported
import { AdminAboutControls } from "@/components/admin/AboutControls"; // Your existing admin for tracks
import { AdminMetaControls } from "@/components/AdminMetaControls"; // For page title/desc
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Down_left_dark_arrow } from "@/assets/";

export const About = () => {
  const [allTracks, setAllTracks] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingAboutTracks, setLoadingAboutTracks] = useState(true); // Renamed for clarity
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [tracksError, setTracksError] = useState(null); // Renamed for clarity
  const { isAdmin, adminToken } = useAdmin();
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All Tracks");

  // --- Meta Data State ---
  const [aboutMeta, setAboutMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [, setMetaError] = useState(null);

  const defaultAboutMeta = useMemo(
    () => ({
      title: "About Our Lab",
      description:
        "Discover our research focus, the dedicated team, and the environment we cultivate for innovation and learning.",
      // You could add more fields here if needed, e.g., a specific subtitle for the "Research Tracks" section
    }),
    []
  );

  // Fetch Meta Data for About Page
  const fetchAboutMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/about`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("About page meta data not found, using defaults.");
          setAboutMeta(defaultAboutMeta);
        } else {
          throw new Error(`HTTP error for meta! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        setAboutMeta(data);
        if (data.title) {
          document.title = data.title; // Set browser tab title
        }
      }
    } catch (err) {
      setMetaError(err.message);
      console.error("Failed to fetch about page meta:", err);
      setAboutMeta(defaultAboutMeta); // Fallback to defaults
    } finally {
      setMetaLoading(false);
    }
  }, [defaultAboutMeta]); // defaultAboutMeta is stable

  // Fetch Research Tracks
  const fetchAllTracks = useCallback(async () => {
    setLoadingAboutTracks(true);
    setTracksError(null);
    try {
      const response = await fetch(`${BASE_URL}/about`); // This endpoint seems to fetch "tracks"
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: `HTTP error for tracks! status: ${response.status}` }));
        throw new Error(errData.message || `HTTP error for tracks! status: ${response.status}`);
      }
      const responseData = await response.json();
      // Assuming backend returns { success: true, data: [...] } for tracks
      setAllTracks(
        responseData.success && Array.isArray(responseData.data) ? responseData.data : []
      );
      setSelectedTrackFilter("All Tracks"); // Reset filter on new data
    } catch (err) {
      console.error("Fetch about tracks error:", err);
      setAllTracks([]);
      setTracksError("Failed to load research tracks. " + err.message);
    } finally {
      setLoadingAboutTracks(false);
    }
  }, []);

  // Fetch Carousel Images
  const fetchCarouselImages = useCallback(async () => {
    setLoadingCarousel(true);
    // Simplified error handling for carousel, it's non-critical
    let finalSlides = [];
    try {
      const results = await Promise.allSettled([
        fetch(`${BASE_URL}/news`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
        fetch(`${BASE_URL}/gallery`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
      ]);

      const [newsResult, galleryResult] = results;

      const newsImages =
        newsResult.status === "fulfilled" && Array.isArray(newsResult.value)
          ? newsResult.value
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date if available
              .flatMap((item) => item.images || [])
              .filter(Boolean)
              .slice(0, 5)
          : [];

      const galleryImages =
        galleryResult.status === "fulfilled" && Array.isArray(galleryResult.value)
          ? galleryResult.value
              .flatMap((item) => item.images || [])
              .filter(Boolean)
              .slice(0, 5)
          : [];

      finalSlides = [...newsImages, ...galleryImages].slice(0, 7); // Ensure total is not too many
    } catch (err) {
      console.error("Carousel image fetch error (outer catch):", err);
    } finally {
      setCarouselSlides(finalSlides);
      setLoadingCarousel(false);
    }
  }, []);

  // Initial data fetches
  useEffect(() => {
    fetchAboutMeta();
    fetchAllTracks();
    fetchCarouselImages();
  }, [fetchAboutMeta, fetchAllTracks, fetchCarouselImages]); // These callbacks are stable

  // Handler for when track data is changed by AdminAboutControls
  const handleTrackDataChange = () => {
    fetchAllTracks(); // Refetch tracks
  };

  // Handler for when meta data is changed by AdminMetaControls
  const handleMetaDataChange = () => {
    fetchAboutMeta(); // Refetch meta
  };

  const filterOptions = [
    "All Tracks",
    ...new Set(allTracks.map((track) => track.title).filter(Boolean)),
  ];
  const tracksToDisplay =
    selectedTrackFilter === "All Tracks"
      ? allTracks
      : allTracks.filter((track) => track.title === selectedTrackFilter);

  const currentTitle = aboutMeta?.title || defaultAboutMeta.title;
  const currentDescription = aboutMeta?.description || defaultAboutMeta.description;

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-[95px] bg-white pb-12">
      {/* Admin controls for Page Title and Description */}
      {isAdmin && aboutMeta && (
        <AdminMetaControls
          pageIdentifier="about"
          initialData={aboutMeta}
          fieldsConfig={[
            { name: "title", label: "About Page Title", type: "text" },
            {
              name: "description",
              label: "About Page Main Description/Subtitle",
              type: "textarea",
            },
          ]}
          onUpdateSuccess={handleMetaDataChange}
          containerClass="w-full max-w-[1340px] mx-auto px-4 md:px-[50px] pt-4 bg-gray-50" // Styled to fit page layout
        />
      )}

      <section className="w-full px-4 md:px-[50px] pt-6">
        {" "}
        {/* Adjusted pt if AdminMetaControls is present */}
        {/* Page Title and Description Section */}
        {!metaLoading && (
          <div className="max-w-[1340px] mx-auto mb-8 md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold text-text_black_primary leading-tight mb-3">
              {currentTitle}
            </h1>
            {currentDescription && (
              <p className="text-base md:text-lg text-text_black_secondary max-w-3xl mx-auto md:mx-0">
                {currentDescription}
              </p>
            )}
          </div>
        )}
        {metaLoading && (
          <div className="max-w-[1340px] mx-auto mb-8 h-24 bg-gray-200 animate-pulse rounded-md"></div>
        )}
        {/* Carousel Section */}
        <div className="w-full max-w-[1340px] mx-auto mb-6 md:mb-12">
          {loadingCarousel && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center">
              <LoadingSpinner message="Loading visuals..." />
            </div>
          )}
          {!loadingCarousel && carouselSlides.length > 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-100 rounded-lg md:rounded-[30px] overflow-hidden shadow-lg">
              <MainCarousel slides={carouselSlides} />
            </div>
          )}
          {!loadingCarousel && carouselSlides.length === 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-100 rounded-lg md:rounded-[30px] flex items-center justify-center text-gray-500 shadow">
              No carousel images available.
            </div>
          )}
        </div>
      </section>

      {/* Admin controls for Research Tracks */}
      {isAdmin && adminToken && (
        <AdminAboutControls // This is your existing component for managing tracks
          fetchedTracks={allTracks}
          onDataChange={handleTrackDataChange}
          adminToken={adminToken}
          // Pass any other necessary props
        />
      )}

      {/* Research Tracks Section */}
      <section className="w-full px-4 md:px-[70px] py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-[80px] font-light font-space-grotesk text-text_black_primary leading-tight">
              Research Tracks
              {/* This title could also be made dynamic via meta if needed */}
            </h1>
            <Down_left_dark_arrow className="w-10 h-10 md:w-14 md:h-14 text-primary_main shrink-0" />
          </div>

          {/* Filters for Tracks */}
          {!loadingAboutTracks && allTracks.length > 0 && filterOptions.length > 1 && (
            <div className="mb-8 md:mb-12">
              <Filter
                selected={selectedTrackFilter}
                setSelected={setSelectedTrackFilter}
                list={filterOptions}
                // Pass styling props if your Filter component supports them
              />
            </div>
          )}

          {/* Displaying Tracks */}
          {loadingAboutTracks && (
            <div className="mt-10 flex justify-center">
              <LoadingSpinner message="Loading research tracks..." />
            </div>
          )}
          {!loadingAboutTracks && tracksError && (
            <div className="text-red-600 text-center mt-10 px-4">{tracksError}</div>
          )}

          {!loadingAboutTracks && !tracksError && (
            <div className="space-y-16 md:space-y-20 lg:space-y-24">
              {tracksToDisplay.length > 0 ? (
                tracksToDisplay.map((track) => (
                  <div
                    key={track._id || track.title} // Use a stable key
                    className="border-b border-gray-200 pb-10 mb-10 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk text-primary_main mb-6 md:mb-8 text-center lg:text-left">
                      {track.title}
                    </h2>
                    <div className="space-y-8 md:space-y-12">
                      {track.content?.map((block, blockIndex) => (
                        <div
                          key={block._id || blockIndex} // Use a stable key
                          className="flex flex-col md:flex-row md:gap-8 lg:gap-12 items-start" // Increased gap
                        >
                          {block.img && (
                            <div
                              className={`w-full md:w-1/2 mt-4 md:mt-0 rounded-lg overflow-hidden shadow-xl ${
                                // Added shadow & overflow
                                blockIndex % 2 !== 0 ? "md:order-2" : "md:order-1" // Corrected order logic
                              }`}
                            >
                              <img
                                src={block.img}
                                alt={block.title || `Image for ${track.title}`}
                                className="w-full h-auto md:h-64 lg:h-80 object-cover bg-gray-200" // Responsive height
                              />
                            </div>
                          )}
                          <div
                            className={`w-full ${block.img ? "md:w-1/2" : "md:w-full"} ${
                              blockIndex % 2 !== 0 ? "md:order-1" : "md:order-2" // Corrected order logic
                            }`}
                          >
                            <h3 className="text-xl md:text-2xl font-semibold text-text_black_primary mb-3">
                              {block.title}
                            </h3>
                            <p className="text-base text-text_black_secondary leading-relaxed whitespace-pre-line">
                              {block.text}{" "}
                              {/* whitespace-pre-line to respect newlines from textarea */}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 italic py-10">
                  {allTracks.length === 0 && !loadingAboutTracks
                    ? "No research tracks have been added yet."
                    : `No tracks found for "${selectedTrackFilter}".`}
                  {isAdmin &&
                    allTracks.length === 0 &&
                    !loadingAboutTracks &&
                    " Use Admin Controls to add new tracks."}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
