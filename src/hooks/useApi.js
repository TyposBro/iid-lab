// DEPRECATED: This file is kept for backward compatibility.
// All hooks have been moved to modular files:
// - useHomeApi.js
// - useAboutApi.js
// Please migrate imports: import { useHomePageMeta } from "@/hooks" or from specific file.

export {
  useHomePageMeta,
  useGalleryEvents,
  useProfessors,
  useTeamMembers,
  useProjects,
  usePublications,
} from "./useHomeApi";
