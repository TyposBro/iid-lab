// New modular hook structure
export * from "./useHomeApi";
export * from "./useAboutApi";
export * from "./useGalleryApi";
export * from "./useNewsApi";
export * from "./useProjectsApi";
export * from "./usePublicationsApi";
export { QK } from "./queryKeys";
export * from "./useProfessorMutations";
export { jsonFetcher } from "./useFetcher";
export * from "./useGalleryMutations";
export * from "./useNewsMutations";
export * from "./useProjectMutations";
export * from "./usePublicationMutations";

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
