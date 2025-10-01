// Centralized query keys to avoid typos and enable reuse
export const QK = {
  home: {
    meta: ["home", "meta"],
  },
  gallery: {
    meta: ["gallery", "meta"],
    events: ["gallery", "events"],
  },
  about: {
    meta: ["about", "meta"],
    tracks: ["about", "tracks"],
    carousel: ["about", "carousel"],
  },
  news: {
    meta: ["news", "meta"],
    list: ["news", "list"],
  },
  professors: {
    list: ["professors"],
  },
  team: (featured) => ["team", { featured }],
  projects: (status) => ["projects", { status }],
  publications: (type) => ["publications", { type }],
  galleryFeatured: (featured) => ["gallery", { featured }],
};
