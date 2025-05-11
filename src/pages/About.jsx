// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback } from "react";
import { MainCarousel, LoadingSpinner, Filter } from "@/components"; // Added Filter import
import { AdminAboutControls } from "@/admin/components/AboutAdminControls";
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Down_left_dark_arrow } from "@/assets/";

export const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin, adminToken } = useAdmin();
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All Tracks");

  const fetchAboutContent = useCallback(async () => {
    setLoadingAbout(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/about`);
      if (response.status === 404) {
        setAboutData(null);
        return;
      }
      if (!response.ok) throw new Error(`About fetch failed: ${response.status}`);
      const data = await response.json();
      setAboutData(data);
      setSelectedTrackFilter("All Tracks");
    } catch (err) {
      console.error("Fetch about error:", err);
      setError("Failed to load about page content. " + err.message);
    } finally {
      setLoadingAbout(false);
    }
  }, []);

  const fetchCarouselImages = useCallback(async () => {
    setLoadingImages(true);
    try {
      const results = await Promise.allSettled([
        fetch(`${BASE_URL}/news`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
        fetch(`${BASE_URL}/gallery`).then((res) => (res.ok ? res.json() : Promise.resolve([]))),
      ]);
      const [newsResult, galleryResult] = results;
      let fetchedNews = newsResult.status === "fulfilled" ? newsResult.value : [];
      let fetchedGallery = galleryResult.status === "fulfilled" ? galleryResult.value : [];
      if (newsResult.status !== "fulfilled") console.error("News fetch failed:", newsResult.reason);
      if (galleryResult.status !== "fulfilled")
        console.error("Gallery fetch failed:", galleryResult.reason);
      fetchedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
      const newsImages = fetchedNews
        .flatMap((item) => item.images || [])
        .filter(Boolean)
        .slice(0, 5);
      const galleryImages = fetchedGallery
        .flatMap((item) => item.images || [])
        .filter(Boolean)
        .slice(0, 5);
      setCarouselSlides([...newsImages, ...galleryImages]);
    } catch (err) {
      console.error("Carousel image fetch error:", err);
    } finally {
      setLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutContent();
    fetchCarouselImages();
  }, [fetchAboutContent, fetchCarouselImages]);

  const handleSaveSuccess = (savedData) => {
    setAboutData(savedData);
    setError(null);
    setSelectedTrackFilter("All Tracks");
    alert("About page saved successfully!");
  };

  const displayData = aboutData;
  const canShowAboutContent = !loadingAbout && displayData;

  let trackFilterOptions = ["All Tracks"];
  let tracksToDisplay = [];

  if (displayData?.body?.list && displayData.body.list.length > 0) {
    const uniqueTrackTitles = [
      ...new Set(displayData.body.list.map((track) => track.title).filter(Boolean)),
    ];
    if (uniqueTrackTitles.length > 0) {
      trackFilterOptions = ["All Tracks", ...uniqueTrackTitles];
    }

    if (selectedTrackFilter === "All Tracks") {
      tracksToDisplay = displayData.body.list;
    } else {
      tracksToDisplay = displayData.body.list.filter(
        (track) => track.title === selectedTrackFilter
      );
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-[95px] bg-white">
      {/* Top Carousel Section (Keep as is) */}
      <section className="w-full px-4 md:px-[50px] pt-6 md:pt-0">
        <div className="w-full max-w-[1340px] mx-auto mb-6 md:mb-8">
          {loadingImages && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {!loadingImages && carouselSlides.length > 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-100 rounded-lg md:rounded-[30px] overflow-hidden">
              <MainCarousel slides={carouselSlides} />
            </div>
          )}
          {!loadingImages && carouselSlides.length === 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center text-gray-500">
              No carousel images.
            </div>
          )}
        </div>
      </section>

      {/* Admin Controls (Keep as is) */}
      {isAdmin && adminToken && (
        <AdminAboutControls
          initialData={aboutData}
          onSaveSuccess={handleSaveSuccess}
          adminToken={adminToken}
        />
      )}

      {/* Loading/Error for About Content (Keep as is) */}
      {loadingAbout && (
        <div className="mt-10">
          <LoadingSpinner message="Loading content..." />
        </div>
      )}
      {!loadingAbout && error && !aboutData && (
        <div className="text-red-600 text-center mt-10 px-4">{error}</div>
      )}

      {/* Page Content: Head and Body Sections (DISPLAY MODE ONLY) */}
      {!loadingAbout && (
        <div className="w-full">
          {canShowAboutContent ? (
            <div className="w-full">
              {" "}
              {/* Display Mode Wrapper */}
              {/* Head Section Display (Keep as is) */}
              <section className="px-4 md:px-[70px] pb-8 md:pb-10">
                <div className="max-w-[1280px] mx-auto space-y-2 md:space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk text-text_black_primary tracking-tight">
                    {displayData?.head?.title || ""}
                  </h1>
                  <p className="text-base md:text-lg text-text_black_secondary leading-relaxed md:leading-snug">
                    {displayData?.head?.description || ""}
                  </p>
                </div>
              </section>
              {/* Body Section Display */}
              <section className="w-full px-4 md:px-[70px] py-8 md:py-12 border-t border-gray-200">
                <div className="max-w-[1280px] mx-auto">
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="text-4xl md:text-5xl lg:text-[80px] font-light font-space-grotesk text-text_black_primary leading-tight">
                      {displayData?.body?.title || "Research Tracks"}
                    </h2>
                    <Down_left_dark_arrow className="w-10 h-10 md:w-14 md:h-14 text-primary_main shrink-0" />
                  </div>

                  {/* Filter Component for Tracks (Keep as is) */}
                  {displayData?.body?.list &&
                    displayData.body.list.length > 0 &&
                    trackFilterOptions.length > 1 && (
                      <div className="mb-8 md:mb-12">
                        <Filter
                          selected={selectedTrackFilter}
                          setSelected={setSelectedTrackFilter}
                          list={trackFilterOptions}
                        />
                      </div>
                    )}

                  {/* --- Research Tracks List - JSX Order for Desktop Zigzag Corrected --- */}
                  <div className="space-y-12 md:space-y-16 lg:space-y-20">
                    {tracksToDisplay.length > 0 ? (
                      tracksToDisplay.map((item, trackItemIndex) => {
                        const primaryImage = item.img?.[0];
                        const imagesToInterleave = item.img?.slice(1) || [];
                        const allParagraphs = item.text || [];
                        const contentElements = [];

                        allParagraphs.forEach((paragraph, pIdx) => {
                          contentElements.push(
                            <p
                              key={`track-${trackItemIndex}-p-${pIdx}`}
                              className="text-base md:text-lg text-text_black_secondary leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          );
                          if (pIdx < imagesToInterleave.length) {
                            contentElements.push(
                              <div
                                key={`track-${trackItemIndex}-interleaved-img-${pIdx}`}
                                className="my-4 md:my-6"
                              >
                                <img
                                  src={imagesToInterleave[pIdx]}
                                  alt={`${item.title || "Track"} content image ${pIdx + 1}`}
                                  className="w-full max-w-md mx-auto h-auto object-contain rounded-lg shadow-md bg-gray-100"
                                  loading="lazy"
                                />
                              </div>
                            );
                          }
                        });
                        if (
                          imagesToInterleave.length > allParagraphs.length - 1 &&
                          allParagraphs.length > 0
                        ) {
                          for (
                            let i = allParagraphs.length - 1;
                            i < imagesToInterleave.length;
                            i++
                          ) {
                            if (i >= 0 && imagesToInterleave[i]) {
                              contentElements.push(
                                <div
                                  key={`track-${trackItemIndex}-interleaved-img-extra-${i}`}
                                  className="my-4 md:my-6"
                                >
                                  <img
                                    src={imagesToInterleave[i]}
                                    alt={`${item.title || "Track"} content image ${i + 1}`}
                                    className="w-full max-w-md mx-auto h-auto object-contain rounded-lg shadow-md bg-gray-100"
                                    loading="lazy"
                                  />
                                </div>
                              );
                            }
                          }
                        }

                        // This is the main layout container for a single track item
                        // For mobile: flex-col (Text block appears above Image block by default if Text is first in JSX)
                        // For desktop (lg): flex-row. If trackItemIndex is ODD, then flex-row-reverse is applied.
                        return (
                          <div
                            key={`research-track-${trackItemIndex}-${item.title}`}
                            className={`flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-start ${
                              trackItemIndex % 2 !== 0 ? "lg:flex-row-reverse" : "" // This will swap the order of the two direct children below
                            }`}
                          >
                            {/* Child 1: Text Content Block */}
                            <div
                              className={`w-full ${
                                primaryImage ? "lg:w-2/3" : "lg:w-full"
                              } space-y-3 md:space-y-4`}
                            >
                              <h3 className="text-2xl md:text-3xl font-bold font-space-grotesk text-primary_main">
                                {item.title}
                              </h3>
                              {contentElements.length > 0
                                ? contentElements.map((element) => element)
                                : allParagraphs.length === 0 && (
                                    <p className="text-gray-400 italic">
                                      No description available for this track.
                                    </p>
                                  )}
                            </div>

                            {/* Child 2: Primary Image Block (for zigzag) */}
                            {/* This block will only render if primaryImage exists */}
                            {primaryImage && (
                              <div className="w-full lg:w-1/3 flex-shrink-0">
                                <img
                                  src={primaryImage}
                                  alt={`${item.title || "Track"} main illustration`}
                                  className="w-full h-auto object-cover rounded-lg md:rounded-xl shadow-lg aspect-square bg-gray-200"
                                  loading="lazy"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-gray-500 italic py-10">
                        {selectedTrackFilter === "All Tracks"
                          ? "No research tracks have been added yet."
                          : `No research tracks found for "${selectedTrackFilter}".`}
                      </p>
                    )}
                  </div>
                  {/* --- END Research Tracks List --- */}
                </div>
              </section>
            </div>
          ) : (
            !error && (
              <div className="text-center text-gray-500 mt-10 px-4">
                About page content has not been created yet.
                {isAdmin ? " (Admin: Use 'Edit Page' to add content)" : ""}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default About;
