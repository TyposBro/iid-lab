import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QK } from "./queryKeys";
import { BASE_URL } from "@/config/api";

const uploadImages = async (files, token) => {
  if (!files || files.length === 0) return [];
  const fd = new FormData();
  [...files].forEach((f) => fd.append("file", f));
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`Image upload failed (${res.status})`);
  const data = await res.json();
  return data.urls || [];
};

export const useCreateNewsItem = (token, { onSuccess, toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { files, ...news } = payload;
      const uploaded = await uploadImages(files, token);
      const res = await fetch(`${BASE_URL}/api/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...news, images: uploaded }),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      return res.json();
    },
    onMutate: async (newItem) => {
      await qc.cancelQueries({ queryKey: QK.news.list });
      const prev = qc.getQueryData(QK.news.list);
      const optimistic = {
        _id: `temp-${Date.now()}`,
        ...newItem,
        images: [],
        date: newItem.date || new Date().toISOString().split("T")[0],
      };
      qc.setQueryData(QK.news.list, (old = []) => [optimistic, ...old]);
      toast?.info?.("Creating news item...");
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.news.list, ctx.prev);
      toast?.error?.(err.message);
    },
    onSuccess: (data) => {
      toast?.success?.("News item created");
      onSuccess?.(data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QK.news.list });
    },
  });
};

export const useUpdateNewsItem = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, files, update }) => {
      let images = update.images || [];
      if (files && files.length) {
        const uploaded = await uploadImages(files, token);
        images = [...images, ...uploaded];
      }
      const res = await fetch(`${BASE_URL}/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...update, images }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      return res.json();
    },
    onMutate: async ({ id, update }) => {
      await qc.cancelQueries({ queryKey: QK.news.list });
      const prev = qc.getQueryData(QK.news.list);
      qc.setQueryData(QK.news.list, (old = []) =>
        old.map((n) => (n._id === id ? { ...n, ...update } : n))
      );
      toast?.info?.("Updating news item...");
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.news.list, ctx.prev);
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("News item updated"),
    onSettled: () => qc.invalidateQueries({ queryKey: QK.news.list }),
  });
};

export const useDeleteNewsItem = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QK.news.list });
      const prev = qc.getQueryData(QK.news.list);
      qc.setQueryData(QK.news.list, (old = []) => old.filter((n) => n._id !== id));
      toast?.info?.("Deleting news item...");
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.news.list, ctx.prev);
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("News item deleted"),
    onSettled: () => qc.invalidateQueries({ queryKey: QK.news.list }),
  });
};
