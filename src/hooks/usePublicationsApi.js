import { useQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "./useFetcher";
import { QK } from "./queryKeys";

// Extend QK with publications meta helpers if not present externally (avoid mutation of QK object shape here)
// We'll namespace: page meta => publicationsPage, section meta => publicationsSection(type)
const publicationsMetaKey = () => ["publications", "meta", "page"];
const publicationsSectionMetaKey = (section) => ["publications", "meta", section];
const publicationsListKey = (type) => QK.publications(type); // existing dynamic key structure

export const usePublicationsPageMeta = () => {
  const defaults = { title: "", description: "" };
  return useQuery(
    buildQueryOptions({
      key: publicationsMetaKey(),
      path: "/api/meta/publications",
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
    })
  );
};

export const usePublicationsSectionMeta = (section) => {
  const defaults = { title: "", description: "" };
  return useQuery(
    buildQueryOptions({
      key: publicationsSectionMetaKey(section),
      path: `/api/meta/publications-${section}`,
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 2;
      },
      enabled: !!section,
      staleTime: 5 * 60 * 1000,
    })
  );
};

// Full list for type (journal|conference). Backend exposes /api/publications/type/:type for public access.
// Passing null/undefined hits the admin-protected aggregate endpoint, so consumers should usually supply a type.
export const usePublicationsList = (type) => {
  const keyType = type ?? "all";
  const path = type ? `/api/publications/type/${type}` : "/publications";
  return useQuery(
    buildQueryOptions({
      key: publicationsListKey(keyType),
      path,
      select: (data) => data,
      staleTime: 60 * 1000,
    })
  );
};

// Export keys (optional consumer usage)
export const publicationsQK = {
  pageMeta: publicationsMetaKey,
  sectionMeta: publicationsSectionMetaKey,
  list: publicationsListKey,
};
