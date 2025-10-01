import { useQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "./useFetcher";
import { QK } from "./queryKeys";

// Separate query key namespace for projects page metas & lists
export const projectsQK = {
  pageMeta: () => ["projects", "meta", "page"],
  currentMeta: () => ["projects", "meta", "current"],
  completedMeta: () => ["projects", "meta", "completed"],
  awardsMeta: () => ["projects", "meta", "awards"],
  list: (status) => QK.projects(status), // reuse global pattern
};

// Generic meta fetcher with fallback defaults
const makeMetaQuery = ({ key, path, defaults }) =>
  useQuery(
    buildQueryOptions({
      key,
      path,
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false; // don't retry missing meta
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
    })
  );

export const useProjectsPageMeta = () =>
  makeMetaQuery({
    key: projectsQK.pageMeta(),
    path: "/api/meta/projects",
    defaults: { title: "", description: "" },
  });

export const useCurrentProjectsMeta = () =>
  makeMetaQuery({
    key: projectsQK.currentMeta(),
    path: "/api/meta/projects-current",
    defaults: { title: "", description: "" },
  });

export const useCompletedProjectsMeta = () =>
  makeMetaQuery({
    key: projectsQK.completedMeta(),
    path: "/api/meta/projects-completed",
    defaults: { title: "", description: "" },
  });

export const useAwardsProjectsMeta = () =>
  makeMetaQuery({
    key: projectsQK.awardsMeta(),
    path: "/api/meta/projects-awards",
    defaults: { title: "", description: "" },
  });

// Lists
export const useProjectsList = (status) =>
  useQuery(
    buildQueryOptions({
      key: projectsQK.list(status),
      path: `/api/projects${status ? `?status=${status}` : ""}`,
      select: (data) => data,
      staleTime: 60 * 1000,
    })
  );
