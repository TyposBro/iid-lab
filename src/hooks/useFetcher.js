import { BASE_URL } from "@/config/api";

/**
 * Generic JSON fetcher that prefixes BASE_URL if a relative path is provided.
 * Throws an Error for non-2xx responses including status code in message.
 * @param {string} path Relative ("/api/xxx") or absolute URL
 * @param {RequestInit} options fetch options
 */
export const jsonFetcher = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let details = "";
    try {
      const data = await res.json();
      details = data?.message ? ` - ${data.message}` : "";
    } catch (_) {
      // ignore json parse error
    }
    throw new Error(`Request failed (${res.status})${details}`);
  }
  // Try to parse json safely
  try {
    return await res.json();
  } catch (err) {
    throw new Error("Invalid JSON response");
  }
};

/** Helper to normalize API responses that may wrap data */
export const unwrapData = (payload) => {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload; // already array
  if (typeof payload === "object" && "data" in payload) return payload.data;
  return payload;
};

export const buildQueryOptions = ({
  key,
  path,
  select,
  enabled = true,
  staleTime = 60 * 1000,
  gcTime = 5 * 60 * 1000,
  retry,
  structuralSharing,
}) => ({
  queryKey: key,
  queryFn: () => jsonFetcher(path).then(unwrapData),
  select,
  enabled,
  staleTime,
  gcTime,
  retry,
  structuralSharing,
});
