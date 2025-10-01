// {PATH_TO_THE_PROJECT}/frontend/src/pages/About.jsx

import { useState, useMemo } from "react";
import { MainCarousel, LoadingSpinner, Filter } from "@/components";
import { AdminAboutControls } from "@/components/admin/AboutControls";
import { AdminMetaControls } from "@/components/AdminMetaControls";
import { useAdmin } from "@/contexts/AdminContext";
import { Down_left_dark_arrow } from "@/assets/";
import { useAboutMeta, useResearchTracks, useAboutCarousel } from "@/hooks/useAboutApi";
import { useQueryClient } from "@tanstack/react-query";

export const About = () => {
  const queryClient = useQueryClient();
  const { data: aboutMeta, isLoading: metaLoading } = useAboutMeta();
  const {
    data: allTracks = [],
    isLoading: loadingAboutTracks,
    error: tracksError,
  } = useResearchTracks();
  const { data: carouselSlides = [], isLoading: loadingCarousel } = useAboutCarousel();
  // selection state
  const { isAdmin, adminToken } = useAdmin();
  const [selectedTrackFilter, setSelectedTrackFilter] = useState(null); // Initialize to null
  const defaultAboutMeta = useMemo(
    () => ({ title: "", description: "", researchTracksTitle: "" }),
    []
  );

  // Effects replaced by query lifecycle; compute selection when tracks change
  if (
    !loadingAboutTracks &&
    allTracks.length > 0 &&
    (!selectedTrackFilter || !allTracks.find((t) => t.title === selectedTrackFilter))
  ) {
    // set first valid track
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setSelectedTrackFilter(allTracks[0].title);
  }
  if (!loadingAboutTracks && allTracks.length === 0 && selectedTrackFilter) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setSelectedTrackFilter(null);
  }

  const handleTrackDataChange = () => {
    queryClient.invalidateQueries({ queryKey: ["about", "tracks"] });
  };
  const handleMetaDataChange = () => {
    queryClient.invalidateQueries({ queryKey: ["about", "meta"] });
  };

  // Filter options derived from fetched tracks for the Filter component
  const filterOptions = useMemo(
    () => allTracks.map((track) => track.title).filter(Boolean),
    [allTracks]
  );

  // Preselect first track if options are available and nothing is selected
  if (!loadingAboutTracks && filterOptions.length > 0 && selectedTrackFilter === null) {
    setSelectedTrackFilter(filterOptions[0]);
  }

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
