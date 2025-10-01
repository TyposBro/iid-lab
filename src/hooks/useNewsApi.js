import { useQuery } from "@tanstack/react-query";
import { buildQueryOptions } from "./useFetcher";

export const newsQk = {
  meta: () => ["news", "meta"],
  list: () => ["news", "list"],
};

export const useNewsMeta = () => {
  const defaults = { title: "", description: "" };
  return useQuery(
    buildQueryOptions({
      key: newsQk.meta(),
      path: "/api/meta/news",
      select: (data) => ({ ...defaults, ...data }),
      retry: (failureCount, error) => {
        if (error.message.includes("404")) return false;
        return failureCount < 3;
      },
    })
  );
};

export const useNewsItems = () => {
  return useQuery(
    buildQueryOptions({
      key: newsQk.list(),
      path: "/api/news",
      select: (data) =>
        Array.isArray(data) ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date)) : [],
    })
  );
};
