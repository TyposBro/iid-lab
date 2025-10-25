import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QK } from "./queryKeys";
import { BASE_URL } from "@/config/api";

const uploadImages = async (files, token) => {
  if (!files || files.length === 0) return [];
  const fd = new FormData();
  [...files].forEach((f) => fd.append("images", f));
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`Image upload failed (${res.status})`);
  const data = await res.json();
  return data.urls || [];
};

export const useCreateGalleryEvent = (token, { onSuccess, toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { files, ...eventData } = payload;
      const uploaded = await uploadImages(files, token);
      const res = await fetch(`${BASE_URL}/api/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...eventData, images: uploaded }),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      return res.json();
    },
    onMutate: async (newEvent) => {
      await qc.cancelQueries({ queryKey: QK.gallery.events });
      const prev = qc.getQueryData(QK.gallery.events);
      const optimistic = {
        _id: `temp-${Date.now()}`,
        ...newEvent,
        images: [],
      };
      qc.setQueryData(QK.gallery.events, (old = []) => [optimistic, ...old]);
      toast?.success?.("Creating gallery event...");
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.gallery.events, ctx.prev);
      toast?.error?.(err.message);
    },
    onSuccess: (data) => {
      toast?.success?.("Gallery event created");
      onSuccess?.(data);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QK.gallery.events });
    },
  });
};

export const useUpdateGalleryEvent = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, files, update }) => {
      let images = update.images || [];
      if (files && files.length) {
        const uploaded = await uploadImages(files, token);
        images = [...images, ...uploaded];
      }
      const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...update, images }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      return res.json();
    },
    onMutate: async ({ id, update }) => {
      await qc.cancelQueries({ queryKey: QK.gallery.events });
      const prev = qc.getQueryData(QK.gallery.events);
      qc.setQueryData(QK.gallery.events, (old = []) =>
        old.map((e) => (e._id === id ? { ...e, ...update } : e))
      );
      toast?.info?.("Updating gallery event...");
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.gallery.events, ctx.prev);
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("Gallery event updated"),
    onSettled: () => qc.invalidateQueries({ queryKey: QK.gallery.events }),
  });
};

export const useDeleteGalleryEvent = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QK.gallery.events });
      const prev = qc.getQueryData(QK.gallery.events);
      qc.setQueryData(QK.gallery.events, (old = []) => old.filter((e) => e._id !== id));
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK.gallery.events, ctx.prev);
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("Gallery event deleted"),
    onSettled: () => qc.invalidateQueries({ queryKey: QK.gallery.events }),
  });
};
