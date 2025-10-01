import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/config/api";

// Generic API fetcher function
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Custom hook for home page meta
export const useHomePageMeta = () => {
  const defaultHomePageMeta = {
    title: "",
    description: "",
    homeYoutubeId: "",
    currentProjectsTitle: "",
    currentProjectsDescription: "",
    journalPapersTitle: "",
    conferencePapersTitle: "",
    currentTeamTitle: "",
  };

  return useQuery({
    queryKey: ["homePageMeta"],
    queryFn: () => fetcher(`${BASE_URL}/api/meta/home`),
    select: (data) => ({ ...defaultHomePageMeta, ...data }),
    placeholderData: defaultHomePageMeta,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors, use defaults instead
      if (error.message.includes("404")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Custom hook for gallery events
export const useGalleryEvents = (featured = false) => {
  return useQuery({
    queryKey: ["gallery", { featured }],
    queryFn: () => fetcher(`${BASE_URL}/api/gallery${featured ? "?featured=true" : ""}`),
    select: (data) => {
      if (featured) {
        return data
          .map((event) => event.images[0])
          .filter(Boolean)
          .slice(0, 7);
      }
      return data;
    },
  });
};

// Custom hook for professor data
export const useProfessors = () => {
  return useQuery({
    queryKey: ["professors"],
    queryFn: () => fetcher(`${BASE_URL}/api/professors/all`),
    select: (data) => (Array.isArray(data) && data.length > 0 ? data[0] : null),
    retry: (failureCount, error) => {
      if (error.message.includes("404")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Custom hook for team members
export const useTeamMembers = (featured = false) => {
  return useQuery({
    queryKey: ["team", { featured }],
    queryFn: () => fetcher(`${BASE_URL}/api/team${featured ? "?featured=true" : ""}`),
    select: (data) => {
      if (featured) {
        return data.filter((member) => member.type !== "alumni");
      }
      return data;
    },
  });
};

// Custom hook for projects
export const useProjects = (status = null) => {
  return useQuery({
    queryKey: ["projects", { status }],
    queryFn: () => fetcher(`${BASE_URL}/api/projects${status ? `?status=${status}` : ""}`),
    select: (data) => {
      if (status === "current") {
        return data.slice(0, 4);
      }
      return data;
    },
  });
};

// Custom hook for publications
export const usePublications = (type = null) => {
  return useQuery({
    queryKey: ["publications", { type }],
    queryFn: () => fetcher(`${BASE_URL}/api/publications${type ? `?type=${type}` : ""}`),
    select: (data) => {
      // Limit to 5 items for home page display
      return data.slice(0, 5);
    },
  });
};
