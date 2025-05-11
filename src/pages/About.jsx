// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useEffect, useCallback } from "react";
import { MainCarousel, LoadingSpinner, Filter } from "@/components";
import { AdminAboutControls } from "@/components/admin/AboutControls";
import { BASE_URL } from "@/config/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Down_left_dark_arrow } from "@/assets/";
// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

// ... (other imports and component code)

export const About = () => {
  // ... (all state variables remain the same)
  const [allTracks, setAllTracks] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin, adminToken } = useAdmin();
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All Tracks");

  const fetchAllTracks = useCallback(async () => {
    // ... (fetchAllTracks logic remains the same)
    setLoadingAbout(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/about`);
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setAllTracks(
        responseData.success && Array.isArray(responseData.data) ? responseData.data : []
      );
      setSelectedTrackFilter("All Tracks");
    } catch (err) {
      console.error("Fetch about tracks error:", err);
      setAllTracks([]);
      setError("Failed to load research tracks. " + err.message);
    } finally {
      setLoadingAbout(false);
    }
  }, []);

  const fetchCarouselImages = useCallback(async () => {
    console.log("fetchCarouselImages called"); // 1. Is function called?
    setLoadingCarousel(true);
    try {
      const results = await Promise.allSettled([
        fetch(`${BASE_URL}/news`).then((res) => {
          console.log("News API Response Status:", res.status); // 2. News API status
          return res.ok
            ? res.json()
            : Promise.resolve({ success: false, data: [], errorStatus: res.status });
        }),
        fetch(`${BASE_URL}/gallery`).then((res) => {
          console.log("Gallery API Response Status:", res.status); // 3. Gallery API status
          return res.ok
            ? res.json()
            : Promise.resolve({ success: false, data: [], errorStatus: res.status });
        }),
      ]);

      console.log("Promise.allSettled results:", results); // 4. Raw results from promises

      const [newsResult, galleryResult] = results;

      let fetchedNews = [];
      if (
        newsResult.status === "fulfilled" &&
        newsResult.value &&
        Array.isArray(newsResult.value)
      ) {
        fetchedNews = newsResult.value;
        console.log("Fetched News (raw):", JSON.parse(JSON.stringify(fetchedNews))); // 5. Parsed news data
      } else {
        console.error(
          "News fetch for carousel failed or returned unexpected data:",
          newsResult.status === "fulfilled" ? newsResult.value : newsResult.reason
        );
      }

      let fetchedGallery = [];
      if (
        galleryResult.status === "fulfilled" &&
        galleryResult.value &&
        Array.isArray(galleryResult.value)
      ) {
        fetchedGallery = galleryResult.value;
        console.log("Fetched Gallery (raw):", JSON.parse(JSON.stringify(fetchedGallery))); // 6. Parsed gallery data
      } else {
        console.error(
          "Gallery fetch for carousel failed or returned unexpected data:",
          galleryResult.status === "fulfilled" ? galleryResult.value : galleryResult.reason
        );
      }

      if (fetchedNews.length > 0 && fetchedNews[0].hasOwnProperty("date")) {
        // console.log("Sorting news by date...");
        fetchedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      const newsImages = fetchedNews
        .flatMap((item) => {
          // console.log("News item:", item.title, "item.images:", item.images); // 7. Check individual news item images
          return item.images || [];
        })
        .filter(Boolean) // Removes null/undefined/empty strings from image URLs
        .slice(0, 5);
      console.log("Processed News Images for carousel:", newsImages); // 8. Images extracted from news

      const galleryImages = fetchedGallery
        .flatMap((item) => {
          // console.log("Gallery item:", item.title || 'Untitled', "item.images:", item.images); // 9. Check individual gallery item images
          return item.images || [];
        })
        .filter(Boolean)
        .slice(0, 5);
      console.log("Processed Gallery Images for carousel:", galleryImages); // 10. Images extracted from gallery

      const finalSlides = [...newsImages, ...galleryImages];
      console.log("Final Carousel Slides to be set:", finalSlides); // 11. The final array for the carousel

      setCarouselSlides(finalSlides);
    } catch (err) {
      console.error("Carousel image fetch error (outer catch):", err);
      setCarouselSlides([]);
    } finally {
      setLoadingCarousel(false);
      console.log("fetchCarouselImages finished"); // 12. Function finished
    }
  }, []);

  // ... (useEffect, handleDataChange, filterOptions, tracksToDisplay, and return statement remain the same)
  useEffect(() => {
    fetchAllTracks();
    fetchCarouselImages();
  }, [fetchAllTracks, fetchCarouselImages]);

  const handleDataChange = () => {
    fetchAllTracks();
  };

  const filterOptions = [
    "All Tracks",
    ...new Set(allTracks.map((track) => track.title).filter(Boolean)),
  ];
  const tracksToDisplay =
    selectedTrackFilter === "All Tracks"
      ? allTracks
      : allTracks.filter((track) => track.title === selectedTrackFilter);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-[95px] bg-white pb-12">
      <section className="w-full px-4 md:px-[50px] pt-6 md:pt-0">
        <div className="w-full max-w-[1340px] mx-auto mb-6 md:mb-8">
          {loadingCarousel && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {!loadingCarousel && carouselSlides.length > 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-100 rounded-lg md:rounded-[30px] overflow-hidden">
              <MainCarousel slides={carouselSlides} />
            </div>
          )}
          {!loadingCarousel && carouselSlides.length === 0 && (
            <div className="w-full h-[200px] md:h-[465px] bg-gray-200 rounded-lg md:rounded-[30px] flex items-center justify-center text-gray-500">
              No carousel images.
            </div>
          )}
        </div>
      </section>

      {isAdmin && adminToken && (
        <AdminAboutControls
          fetchedTracks={allTracks}
          onDataChange={handleDataChange}
          adminToken={adminToken}
        />
      )}

      <section className="w-full px-4 md:px-[70px] py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-[80px] font-light font-space-grotesk text-text_black_primary leading-tight">
              Research tracks
            </h1>
            <Down_left_dark_arrow className="w-10 h-10 md:w-14 md:h-14 text-primary_main shrink-0" />
          </div>

          {allTracks.length > 0 && filterOptions.length > 1 && (
            <div className="mb-8 md:mb-12">
              <Filter
                selected={selectedTrackFilter}
                setSelected={setSelectedTrackFilter}
                list={filterOptions}
              />
            </div>
          )}

          {loadingAbout && (
            <div className="mt-10 flex justify-center">
              <LoadingSpinner message="Loading tracks..." />
            </div>
          )}
          {!loadingAbout && error && (
            <div className="text-red-600 text-center mt-10 px-4">{error}</div>
          )}

          {!loadingAbout && !error && (
            <div className="space-y-16 md:space-y-20 lg:space-y-24">
              {tracksToDisplay.length > 0 ? (
                tracksToDisplay.map((track) => (
                  <div
                    key={track._id}
                    className="border-b border-gray-200 pb-10 mb-10 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk text-primary_main mb-6 md:mb-8 text-center lg:text-left">
                      {track.title}
                    </h2>
                    <div className="space-y-8 md:space-y-12">
                      {track.content?.map((block, blockIndex) => (
                        <div
                          key={block._id || blockIndex}
                          className="flex flex-col md:flex-row md:gap-8 lg:gap-16 items-start"
                        >
                          {block.img && (
                            <div
                              className={`w-full md:w-1/2 mt-4 md:mt-0 ${
                                blockIndex % 2 !== 0 ? "md:order-1" : "md:order-2"
                              }`}
                            >
                              <img
                                src={block.img}
                                alt={block.title || "Content image"}
                                className="w-full h-auto md:h-64 lg:h-72 object-cover rounded-lg shadow-md bg-gray-200"
                              />
                            </div>
                          )}
                          <div
                            className={`w-full ${block.img ? "md:w-1/2" : "md:w-full"} ${
                              blockIndex % 2 !== 0 ? "md:order-2" : "md:order-1"
                            }`}
                          >
                            <h3 className="text-xl md:text-2xl font-semibold text-text_black_primary mb-2">
                              {block.title}
                            </h3>
                            <p className="text-base text-text_black_secondary leading-relaxed">
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
                  {allTracks.length === 0
                    ? "No research tracks have been added yet."
                    : `No tracks found for "${selectedTrackFilter}".`}
                  {isAdmin && allTracks.length === 0 && " Use Admin Controls to add new tracks."}
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
