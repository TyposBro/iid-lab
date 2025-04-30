// frontend/src/config/api.js

// Read from the global object injected into index.html at runtime by entrypoint.sh
// Use optional chaining (?.) and provide a fallback for safety
const apiUrlFromWindow = window.runtimeConfig?.VITE_API_BASE_URL;

export const BASE_URL = apiUrlFromWindow || ""; // Use empty string if not found

// Add some runtime logging for easier debugging in the browser console
if (!apiUrlFromWindow) {
  console.warn(
    "WARNING: VITE_API_BASE_URL was not found in window.runtimeConfig. API calls might fail.",
    "window.runtimeConfig:",
    window.runtimeConfig
  );
} else {
  console.log("API BASE_URL loaded from runtime config:", BASE_URL);
}
