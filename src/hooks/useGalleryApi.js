import { useQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "./useFetcher";
import { QK } from "./queryKeys";

export const galleryQk = {
  meta: () => QK.gallery.meta,
  events: () => QK.gallery.events,
};

export const useGalleryMeta = () => {
  const defaults = { title: "", description: "" };
  return useQuery(
    buildQueryOptions({
      key: galleryQk.meta(),
      path: "/api/meta/gallery",
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 3;
      },
    })
  );
};

export const useGalleryEvents = () => {
  return useQuery(
    buildQueryOptions({
      key: galleryQk.events(),
      path: "/api/gallery",
      select: (data) =>
        Array.isArray(data) ? [...data].sort((a, b) => (b.number ?? 0) - (a.number ?? 0)) : [],
    })
  );
};
