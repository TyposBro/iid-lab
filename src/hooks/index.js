// New modular hook structure
export * from "./useHomeApi";
export * from "./useAboutApi";
export * from "./useGalleryApi";
export { jsonFetcher } from "./useFetcher";

// Temporary backward compatibility: re-export legacy hooks from useHomeApi if old import path `useApi` was used elsewhere
// TODO: Remove after migrating all imports.
export {
  useHomePageMeta,
  useGalleryEvents,
  useProfessors,
  useTeamMembers,
  useProjects,
  usePublications,
} from "./useHomeApi";
