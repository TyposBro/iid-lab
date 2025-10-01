import { useQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "./useFetcher";
import { QK } from "./queryKeys";

// Query Keys helpers (arrays so we can namespace & include params)
// Legacy qk retained for backward compatibility if imported elsewhere
export const qk = {
  homeMeta: () => QK.home.meta,
  gallery: (featured) => QK.galleryFeatured(featured),
  professors: () => QK.professors.list,
  team: (featured) => QK.team(featured),
  projects: (status) => QK.projects(status),
  publications: (type) => QK.publications(type),
};

// Home Page Meta
export const useHomePageMeta = () => {
  const defaults = {
    title: "",
    description: "",
    homeYoutubeId: "",
    currentProjectsTitle: "",
    currentProjectsDescription: "",
    journalPapersTitle: "",
    conferencePapersTitle: "",
    currentTeamTitle: "",
  };
  return useQuery(
    buildQueryOptions({
      key: qk.homeMeta(),
      path: "/api/meta/home",
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 3;
      },
    })
  );
};

// Gallery Events (optionally only featured - first image of each event)
export const useGalleryEvents = (featured = false) => {
  return useQuery(
    buildQueryOptions({
      key: qk.gallery(featured),
      path: `/api/gallery${featured ? "?featured=true" : ""}`,
      select: (data) => {
        if (featured) {
          return data
            .map((event) => event.images?.[0])
            .filter(Boolean)
            .slice(0, 7);
        }
        return data;
      },
    })
  );
};

// Professor (single) - backend exposes /api/prof returning one document
export const useProfessors = () => {
  return useQuery(
    buildQueryOptions({
      key: qk.professors(),
      staleTime: 5 * 60 * 1000,
      path: "/api/prof",
      select: (data) => data || null,
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 3;
      },
    })
  );
};

// Team Members (optionally featured)
export const useTeamMembers = (featured = false) => {
  return useQuery(
    buildQueryOptions({
      key: qk.team(featured),
      path: `/api/team${featured ? "?featured=true" : ""}`,
      select: (data) => {
        if (featured) return data.filter((m) => m.type !== "alumni");
        return data;
      },
    })
  );
};

// Projects (optionally status filter, trim current for home page display)
export const useProjects = (status = null) => {
  return useQuery(
    buildQueryOptions({
      key: qk.projects(status),
      path: `/api/projects${status ? `?status=${status}` : ""}`,
      select: (data) => {
        if (status === "current") return data.slice(0, 4);
        return data;
      },
    })
  );
};

// Publications (optionally type filter; slice to 5 for home display)
// Backend provides /api/publications/type/:type for type-specific lists
export const usePublications = (type = null) => {
  const path = type ? `/api/publications/type/${type}` : "/api/publications"; // all (admin protected) but used only when type null in limited cases
  return useQuery(
    buildQueryOptions({
      key: qk.publications(type),
      path,
      select: (data) => (Array.isArray(data) ? data.slice(0, 5) : []),
    })
  );
};
