// {PATH_TO_THE_PROJECT}/frontend/src/config/api.js

// Get the API base URL from Vite's environment variables during development.
// These are injected by the Vite dev server based on environment variables
// starting with VITE_ passed to the container (like in docker-compose.yml).
// For production builds, Vite replaces this with the value at build time
// *unless* you specifically configure it otherwise (which the placeholder method did).
const apiUrlFromEnv = import.meta.env.VITE_API_URL;

// Fallback in case the variable isn't set (shouldn't happen with docker-compose setup)
export const BASE_URL = apiUrlFromEnv || "";

// Add runtime logging for debugging in the browser console
if (!apiUrlFromEnv) {
  console.warn(
    "WARNING: VITE_API_URL is not defined in Vite's environment variables (import.meta.env). Check docker-compose.yml environment section for the frontend service and ensure the variable name starts with VITE_. API calls will likely fail."
  );
  // Log all available Vite env vars for inspection
  console.log("Available import.meta.env variables:", import.meta.env);
} else {
  // This confirms the URL is being loaded correctly in development
  console.log("API BASE_URL loaded from import.meta.env:", BASE_URL);
}

// IMPORTANT: If you intend to use the placeholder mechanism for production builds later,
// you will need a different way to handle configuration loading based on NODE_ENV
// or use the placeholder replacement during the build step itself if possible.
// For now, this setup works for the development mode via docker-compose.
