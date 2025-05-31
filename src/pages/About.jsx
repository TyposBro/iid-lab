// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { MainCarousel, LoadingSpinner, Filter } from "@/components";
import { AdminAboutControls } from "@/components/admin/AboutControls";
import { AdminMetaControls } from "@/components/AdminMetaControls";
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Down_left_dark_arrow } from "@/assets/";

export const About = () => {
  const [allTracks, setAllTracks] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingAboutTracks, setLoadingAboutTracks] = useState(true);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [tracksError, setTracksError] = useState(null);
  const { isAdmin, adminToken } = useAdmin();
  const [selectedTrackFilter, setSelectedTrackFilter] = useState(null); // Initialize to null

  // --- Meta Data State ---
  const [aboutMeta, setAboutMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [, setMetaError] = useState(null); // metaError state exists but not used to display to user in this setup

  const defaultAboutMeta = useMemo(
    () => ({
      title: "",
      description: "",
      researchTracksTitle: "", // Added for dynamic section title
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
          document.title = defaultAboutMeta.title;
        } else {
          throw new Error(`HTTP error for meta! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        const mergedMeta = { ...defaultAboutMeta, ...data }; // Ensure all default keys are present
        setAboutMeta(mergedMeta);
        if (mergedMeta.title) {
          document.title = mergedMeta.title;
        }
      }
    } catch (err) {
      setMetaError(err.message);
      console.error("Failed to fetch about page meta:", err);
      setAboutMeta(defaultAboutMeta);
      document.title = defaultAboutMeta.title;
    } finally {
      setMetaLoading(false);
    }
  }, [defaultAboutMeta]);

  // Fetch Research Tracks
  const fetchAllTracks = useCallback(async () => {
    setLoadingAboutTracks(true);
    setTracksError(null);
    try {
      const response = await fetch(`${BASE_URL}/about`);
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: `HTTP error for tracks! status: ${response.status}` }));
        throw new Error(errData.message || `HTTP error for tracks! status: ${response.status}`);
      }
      const responseData = await response.json();
      const tracks =
        responseData.success && Array.isArray(responseData.data) ? responseData.data : [];
      setAllTracks(tracks);
      // Preselect the first track if tracks exist and no filter is yet selected OR if the current selection is no longer valid
      if (
        tracks.length > 0 &&
        (!selectedTrackFilter || !tracks.find((t) => t.title === selectedTrackFilter))
      ) {
        setSelectedTrackFilter(tracks[0].title);
      } else if (tracks.length === 0) {
        setSelectedTrackFilter(null); // No tracks, no selection
      }
    } catch (err) {
      console.error("Fetch about tracks error:", err);
      setAllTracks([]);
      setTracksError("Failed to load research tracks. " + err.message);
      setSelectedTrackFilter(null); // Reset on error
    } finally {
      setLoadingAboutTracks(false);
    }
  }, [selectedTrackFilter]); // Add selectedTrackFilter to dependencies to handle re-selection logic if needed, though fetch is main driver

  // Fetch Carousel Images
  const fetchCarouselImages = useCallback(async () => {
    setLoadingCarousel(true);
    let finalSlides = [];
    try {
      const results = await Promise.allSettled([
        fetch(`${BASE_URL}/news`).then((res) =>
          res.ok ? res.json() : Promise.resolve({ data: [] })
        ), // Ensure data structure
        fetch(`${BASE_URL}/gallery`).then((res) =>
          res.ok ? res.json() : Promise.resolve({ data: [] })
        ), // Ensure data structure
      ]);

      const [newsResult, galleryResult] = results;

      // Assuming news items are directly the array or inside a 'data' property
      const newsData =
        newsResult.status === "fulfilled" ? newsResult.value.data || newsResult.value : [];
      const newsImages = Array.isArray(newsData)
        ? newsData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .flatMap((item) => item.images || [])
            .filter(Boolean)
            .slice(0, 5)
        : [];

      // Assuming gallery items are directly the array or inside a 'data' property
      const galleryData =
        galleryResult.status === "fulfilled" ? galleryResult.value.data || galleryResult.value : [];
      const galleryImages = Array.isArray(galleryData)
        ? galleryData
            .flatMap((item) => item.images || [])
            .filter(Boolean)
            .slice(0, 5)
        : [];

      finalSlides = [...newsImages, ...galleryImages].slice(0, 7);
    } catch (err) {
      console.error("Carousel image fetch error (outer catch):", err);
    } finally {
      setCarouselSlides(finalSlides);
      setLoadingCarousel(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutMeta();
    fetchAllTracks(); // fetchAllTracks will handle initial selection
    fetchCarouselImages();
  }, [fetchAboutMeta, fetchAllTracks, fetchCarouselImages]);

  const handleTrackDataChange = () => {
    fetchAllTracks();
  };

  const handleMetaDataChange = () => {
    fetchAboutMeta();
  };

  // Filter options derived from fetched tracks for the Filter component
  const filterOptions = useMemo(
    () => allTracks.map((track) => track.title).filter(Boolean),
    [allTracks]
  );

  // Preselect first track if options are available and nothing is selected
  useEffect(() => {
    if (!loadingAboutTracks && filterOptions.length > 0 && selectedTrackFilter === null) {
      setSelectedTrackFilter(filterOptions[0]);
    }
  }, [loadingAboutTracks, filterOptions, selectedTrackFilter]);

  const tracksToDisplay = selectedTrackFilter
    ? allTracks.filter((track) => track.title === selectedTrackFilter)
    : []; // If no filter selected (e.g., no tracks), display nothing or a message

  const currentTitle = aboutMeta?.title || defaultAboutMeta.title;
  const currentDescription = aboutMeta?.description || defaultAboutMeta.description;
  const researchTracksTitle =
    aboutMeta?.researchTracksTitle || defaultAboutMeta.researchTracksTitle;

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-[95px] bg-white pb-12">
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
            { name: "researchTracksTitle", label: "Research Tracks Section Title", type: "text" },
          ]}
          onUpdateSuccess={handleMetaDataChange}
          containerClass="w-full max-w-[1340px] mx-auto px-4 md:px-[50px] pt-4 bg-gray-50"
        />
      )}

      <section className="w-full px-4 md:px-[50px] pt-6">
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

      {isAdmin && adminToken && (
        <AdminAboutControls
          fetchedTracks={allTracks}
          onDataChange={handleTrackDataChange}
          adminToken={adminToken}
        />
      )}

      <section className="w-full px-4 md:px-[70px] py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-[80px] font-light font-space-grotesk text-text_black_primary leading-tight">
              {researchTracksTitle}
            </h1>
            <Down_left_dark_arrow className="w-10 h-10 md:w-14 md:h-14 text-primary_main shrink-0" />
          </div>

          {!loadingAboutTracks && allTracks.length > 0 && filterOptions.length > 0 && (
            <div className="mb-8 md:mb-12">
              <Filter
                selected={selectedTrackFilter}
                setSelected={setSelectedTrackFilter}
                list={filterOptions}
                // Assuming Filter component handles pre-selection if `selected` is valid in `list`
              />
            </div>
          )}

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
                    key={track._id || track.title}
                    className="border-b border-gray-200 pb-10 mb-10 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk text-primary_main mb-6 md:mb-8 text-center lg:text-left">
                      {track.title}
                    </h2>
                    <div className="space-y-8 md:space-y-12">
                      {track.content?.map((block, blockIndex) => (
                        <div
                          key={block._id || blockIndex}
                          className="flex flex-col md:flex-row md:gap-8 lg:gap-12 items-start"
                        >
                          {block.img && (
                            <div
                              className={`w-full md:w-1/2 mt-4 md:mt-0 rounded-lg overflow-hidden shadow-xl ${
                                blockIndex % 2 !== 0 ? "md:order-2" : "md:order-1"
                              }`}
                            >
                              <img
                                src={block.img}
                                alt={block.title || `Image for ${track.title}`}
                                className="w-full h-auto md:h-64 lg:h-80 object-cover bg-gray-200"
                              />
                            </div>
                          )}
                          <div
                            className={`w-full ${block.img ? "md:w-1/2" : "md:w-full"} ${
                              blockIndex % 2 !== 0 ? "md:order-1" : "md:order-2"
                            }`}
                          >
                            <h3 className="text-xl md:text-2xl font-semibold text-text_black_primary mb-3">
                              {block.title}
                            </h3>
                            <p className="text-base text-text_black_secondary leading-relaxed whitespace-pre-line">
                              {block.text}
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
                    : selectedTrackFilter
                    ? `No content found for "${selectedTrackFilter}".`
                    : "Select a track to view its content."}
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
