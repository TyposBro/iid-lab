import { useQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "./useFetcher";
import { QK } from "./queryKeys";

export const aboutQk = {
  meta: () => QK.about.meta,
  tracks: () => QK.about.tracks,
  carousel: () => QK.about.carousel,
};

// About Page Meta
export const useAboutMeta = () => {
  const defaults = { title: "", description: "", researchTracksTitle: "", aboutYoutubeId: "" };
  return useQuery(
    buildQueryOptions({
      key: aboutQk.meta(),
      path: "/api/meta/about",
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false; // don't retry 404
        return failureCount < 3;
      },
    })
  );
};

// Research Tracks list
export const useResearchTracks = () => {
  return useQuery(
    buildQueryOptions({
      key: aboutQk.tracks(),
      path: "/api/about",
      select: (payload) => {
        // API seems to return { success, data } maybe
        if (payload?.success && Array.isArray(payload.data)) return payload.data;
        if (Array.isArray(payload)) return payload;
        return [];
      },
    })
  );
};

// About Carousel (merge news + gallery)
export const useAboutCarousel = () => {
  return useQuery({
    queryKey: aboutQk.carousel(),
    queryFn: async () => {
      const [newsRes, galleryRes] = await Promise.allSettled([
        fetch(`/api/news`).then((r) => (r.ok ? r.json() : { data: [] })),
        fetch(`/api/gallery`).then((r) => (r.ok ? r.json() : { data: [] })),
      ]);

      const newsData = newsRes.status === "fulfilled" ? newsRes.value.data || newsRes.value : [];
      const galleryData =
        galleryRes.status === "fulfilled" ? galleryRes.value.data || galleryRes.value : [];

      const newsImages = Array.isArray(newsData)
        ? newsData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .flatMap((n) => n.images || [])
            .filter(Boolean)
            .slice(0, 5)
        : [];
      const galleryImages = Array.isArray(galleryData)
        ? galleryData
            .flatMap((g) => g.images || [])
            .filter(Boolean)
            .slice(0, 5)
        : [];

      return [...newsImages, ...galleryImages].slice(0, 7);
    },
    staleTime: 5 * 60 * 1000,
  });
};
