import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jsonFetcher } from "./useFetcher";
import { QK } from "./queryKeys";
import { BASE_URL } from "@/config/api";

const uploadSingleFile = async (file, token) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  const url = data.urls?.[0];
  if (!url) throw new Error("Upload response missing url");
  return url;
};

export const useCreateOrUpdateProfessor = (adminToken) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ existing, formData }) => {
      let imageUrl = formData.img;
      if (formData._newImageFile) {
        imageUrl = await uploadSingleFile(formData._newImageFile, adminToken);
      }
      let cvUrl = formData.cvLink;
      if (formData._newCvFile) {
        cvUrl = await uploadSingleFile(formData._newCvFile, adminToken);
      }
      if (formData._removeCv) {
        cvUrl = ""; // explicit removal
      }
      const payload = {
        ...formData,
        img: imageUrl,
        cvLink: cvUrl,
        stats: (formData.stats || []).map((s) => ({ ...s, value: parseFloat(s.value) || 0 })),
      };
      delete payload._newImageFile;
      delete payload._newCvFile;
      delete payload._removeCv;

      const method = existing?._id ? "PUT" : "POST";
      const endpoint = existing?._id
        ? `${BASE_URL}/api/professors/${existing._id}`
        : `${BASE_URL}/api/professors`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Save failed (${res.status})`);
      }
      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: QK.professors.list });
    },
  });
};

export const useDeleteProfessor = (adminToken) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/api/professors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Delete failed (${res.status})`);
      }
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.professors.list });
    },
  });
};
