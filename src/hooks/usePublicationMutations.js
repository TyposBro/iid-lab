import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QK } from "./queryKeys";
import { BASE_URL } from "@/config/api";

// Publications are queried per type via QK.publications(type)
// We'll optimistically update both the specific type list and the 'all' list (if it exists in cache)
// Supported types assumed: journal | conference (extendable)

const listKey = (type) => QK.publications(type);
const allKey = () => QK.publications("all");
const knownTypes = ["journal", "conference"]; // could be extended later

// Helper merge util
const upsert = (arr = [], item, match = (a) => a._id === item._id) => {
  let found = false;
  const next = arr.map((el) => {
    if (match(el)) {
      found = true;
      return { ...el, ...item };
    }
    return el;
  });
  return found ? next : [item, ...next];
};

export const useCreatePublication = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, publication }) => {
      let image = publication.image;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const resUpload = await fetch(`${BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!resUpload.ok) throw new Error(`Image upload failed (${resUpload.status})`);
        const dataUpload = await resUpload.json();
        image = dataUpload.urls?.[0] || null;
      }
      const res = await fetch(`${BASE_URL}/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...publication, image }),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      return res.json();
    },
    onMutate: async (vars) => {
      const type = vars.publication.type || "journal";
      await Promise.all([
        qc.cancelQueries({ queryKey: listKey(type) }),
        qc.cancelQueries({ queryKey: allKey() }),
      ]);
      const snapshotType = qc.getQueryData(listKey(type));
      const snapshotAll = qc.getQueryData(allKey());
      const optimistic = {
        _id: `temp-${Date.now()}`,
        ...vars.publication,
        image: null,
      };
      // Insert into specific type list
      qc.setQueryData(listKey(type), (old = []) => [optimistic, ...old]);
      // Insert into all list if present
      if (snapshotAll) {
        qc.setQueryData(allKey(), (old = []) => [optimistic, ...old]);
      }
      toast?.info?.("Creating publication...");
      return { snapshotType, snapshotAll, type };
    },
    onError: (err, _vars, ctx) => {
      if (ctx) {
        ctx.snapshotType && qc.setQueryData(listKey(ctx.type), ctx.snapshotType);
        if (ctx.snapshotAll) qc.setQueryData(allKey(), ctx.snapshotAll);
      }
      toast?.error?.(err.message);
    },
    onSuccess: () => {
      toast?.success?.("Publication created");
    },
    onSettled: (_data, _err, _vars, ctx) => {
      if (ctx?.type) qc.invalidateQueries({ queryKey: listKey(ctx.type) });
      qc.invalidateQueries({ queryKey: allKey() });
    },
  });
};

export const useUpdatePublication = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, update }) => {
      let image = update.image;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const resUpload = await fetch(`${BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!resUpload.ok) throw new Error(`Image upload failed (${resUpload.status})`);
        const dataUpload = await resUpload.json();
        image = dataUpload.urls?.[0] || null;
      }
      const res = await fetch(`${BASE_URL}/publications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...update, image }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      return res.json();
    },
    onMutate: async ({ id, update }) => {
      const newType = update.type;
      // Cancel queries for all known types + aggregate
      await Promise.all([
        ...knownTypes.map((t) => qc.cancelQueries({ queryKey: listKey(t) })),
        qc.cancelQueries({ queryKey: allKey() }),
      ]);
      const snapshots = Object.fromEntries(knownTypes.map((t) => [t, qc.getQueryData(listKey(t))]));
      const snapshotAll = qc.getQueryData(allKey());
      // Apply optimistic update across lists
      knownTypes.forEach((t) => {
        qc.setQueryData(listKey(t), (old = []) =>
          old.map((p) => (p._id === id ? { ...p, ...update } : p))
        );
      });
      if (snapshotAll) {
        qc.setQueryData(allKey(), (old = []) =>
          old.map((p) => (p._id === id ? { ...p, ...update } : p))
        );
      }
      toast?.info?.("Updating publication...");
      return { snapshots, snapshotAll, newType };
    },
    onError: (err, _vars, ctx) => {
      if (ctx) {
        knownTypes.forEach(
          (t) => ctx.snapshots?.[t] && qc.setQueryData(listKey(t), ctx.snapshots[t])
        );
        if (ctx.snapshotAll) qc.setQueryData(allKey(), ctx.snapshotAll);
      }
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("Publication updated"),
    onSettled: () => {
      knownTypes.forEach((t) => qc.invalidateQueries({ queryKey: listKey(t) }));
      qc.invalidateQueries({ queryKey: allKey() });
    },
  });
};

export const useDeletePublication = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/api/publications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      return id;
    },
    onMutate: async (id) => {
      await Promise.all([
        ...knownTypes.map((t) => qc.cancelQueries({ queryKey: listKey(t) })),
        qc.cancelQueries({ queryKey: allKey() }),
      ]);
      const snapshots = Object.fromEntries(knownTypes.map((t) => [t, qc.getQueryData(listKey(t))]));
      const snapshotAll = qc.getQueryData(allKey());
      knownTypes.forEach((t) => {
        qc.setQueryData(listKey(t), (old = []) => old.filter((p) => p._id !== id));
      });
      if (snapshotAll) {
        qc.setQueryData(allKey(), (old = []) => old.filter((p) => p._id !== id));
      }
      toast?.info?.("Deleting publication...");
      return { snapshots, snapshotAll };
    },
    onError: (err, _vars, ctx) => {
      if (ctx) {
        knownTypes.forEach(
          (t) => ctx.snapshots?.[t] && qc.setQueryData(listKey(t), ctx.snapshots[t])
        );
        if (ctx.snapshotAll) qc.setQueryData(allKey(), ctx.snapshotAll);
      }
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("Publication deleted"),
    onSettled: () => {
      knownTypes.forEach((t) => qc.invalidateQueries({ queryKey: listKey(t) }));
      qc.invalidateQueries({ queryKey: allKey() });
    },
  });
};
