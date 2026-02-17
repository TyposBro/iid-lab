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

/** Map `id` → `_id` so the rest of the app (written for MongoDB) works with D1 responses */
const addLegacyId = (item) => {
  if (item && typeof item === "object" && "id" in item && !("_id" in item)) {
    return { ...item, _id: item.id };
  }
  return item;
};

/** Helper to normalize API responses that may wrap data */
export const unwrapData = (payload) => {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload.map(addLegacyId);
  if (typeof payload === "object" && "data" in payload) {
    const d = payload.data;
    return Array.isArray(d) ? d.map(addLegacyId) : addLegacyId(d);
  }
  return addLegacyId(payload);
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
  token,
}) => ({
  queryKey: key,
  queryFn: () => {
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return jsonFetcher(path, options).then(unwrapData);
  },
  select,
  enabled,
  staleTime,
  gcTime,
  retry,
  structuralSharing,
});
