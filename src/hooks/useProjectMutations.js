import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QK } from "./queryKeys";
import { BASE_URL } from "@/config/api";

// Helper to update multiple status lists when a project might belong to one
const statusKeys = ["current", "completed", "award"];
const listKey = (status) => QK.projects(status);

const uploadImage = async (file, token) => {
  if (!file) return null;
  const fd = new FormData();
  fd.append("images", file);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`Image upload failed (${res.status})`);
  const data = await res.json();
  return data[0] || null;
};

export const useCreateProject = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, project }) => {
      const image = file ? await uploadImage(file, token) : undefined;
      const payload = { ...project, image };
      const res = await fetch(`${BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      return res.json();
    },
    onMutate: async (vars) => {
      await Promise.all(statusKeys.map((s) => qc.cancelQueries({ queryKey: listKey(s) })));
      const snapshots = Object.fromEntries(statusKeys.map((s) => [s, qc.getQueryData(listKey(s))]));
      const optimistic = {
        _id: `temp-${Date.now()}`,
        ...vars.project,
        image: null,
      };
      const status = vars.project.status;
      if (statusKeys.includes(status)) {
        qc.setQueryData(listKey(status), (old = []) => [optimistic, ...old]);
      }
      toast?.info?.("Creating project...");
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.snapshots) {
        statusKeys.forEach(
          (s) => ctx.snapshots[s] && qc.setQueryData(listKey(s), ctx.snapshots[s])
        );
      }
      toast?.error?.(err.message);
    },
    onSuccess: (data) => {
      toast?.success?.("Project created");
    },
    onSettled: (_data, _err, vars) => {
      // Invalidate affected list
      if (vars?.project?.status) {
        qc.invalidateQueries({ queryKey: listKey(vars.project.status) });
      } else {
        statusKeys.forEach((s) => qc.invalidateQueries({ queryKey: listKey(s) }));
      }
    },
  });
};

export const useUpdateProject = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, update }) => {
      let image = update.image; // keep existing unless changed
      if (file) image = (await uploadImage(file, token)) || image;
      const payload = { ...update, image };
      const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      return res.json();
    },
    onMutate: async ({ id, update }) => {
      await Promise.all(statusKeys.map((s) => qc.cancelQueries({ queryKey: listKey(s) })));
      const snapshots = Object.fromEntries(statusKeys.map((s) => [s, qc.getQueryData(listKey(s))]));
      statusKeys.forEach((s) => {
        qc.setQueryData(listKey(s), (old = []) =>
          old.map((p) => (p._id === id ? { ...p, ...update } : p))
        );
      });
      toast?.info?.("Updating project...");
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.snapshots) {
        statusKeys.forEach(
          (s) => ctx.snapshots[s] && qc.setQueryData(listKey(s), ctx.snapshots[s])
        );
      }
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("Project updated"),
    onSettled: (data, _err, vars) => {
      // Invalidate potential old & new status lists if status changed
      const newStatus = vars?.update?.status;
      statusKeys.forEach((s) => qc.invalidateQueries({ queryKey: listKey(s) }));
      if (newStatus) qc.invalidateQueries({ queryKey: listKey(newStatus) });
    },
  });
};

export const useDeleteProject = (token, { toast } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      return id;
    },
    onMutate: async (id) => {
      await Promise.all(statusKeys.map((s) => qc.cancelQueries({ queryKey: listKey(s) })));
      const snapshots = Object.fromEntries(statusKeys.map((s) => [s, qc.getQueryData(listKey(s))]));
      statusKeys.forEach((s) => {
        qc.setQueryData(listKey(s), (old = []) => old.filter((p) => p._id !== id));
      });
      toast?.info?.("Deleting project...");
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.snapshots) {
        statusKeys.forEach(
          (s) => ctx.snapshots[s] && qc.setQueryData(listKey(s), ctx.snapshots[s])
        );
      }
      toast?.error?.(err.message);
    },
    onSuccess: () => toast?.success?.("Project deleted"),
    onSettled: () => {
      statusKeys.forEach((s) => qc.invalidateQueries({ queryKey: listKey(s) }));
    },
  });
};
