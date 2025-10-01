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

// Professors (returns first professor or null)
export const useProfessors = () => {
  return useQuery(
    buildQueryOptions({
      key: qk.professors(),
      staleTime: 5 * 60 * 1000, // cache professor data for 5 minutes
      path: "/api/professors/all",
      select: (data) => (Array.isArray(data) && data.length > 0 ? data[0] : null),
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
export const usePublications = (type = null) => {
  return useQuery(
    buildQueryOptions({
      key: qk.publications(type),
      path: `/api/publications${type ? `?type=${type}` : ""}`,
      select: (data) => data.slice(0, 5),
    })
  );
};
