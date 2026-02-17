import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useAdmin } from "@/contexts/AdminContext";
import { useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { LoadingSpinner, ImageCropModal } from "@/components/";
import { BASE_URL } from "@/config/api";

/*
  Admin Projects Controls (refactored)
  - Uses TanStack Query mutation hooks (create/update/delete)
  - Optimistic updates handled inside mutations
  - This component now only drives form state + calls mutations
  - Independent fetch for full list (admin overview) still done here (could be refactored to query hook later)
*/

const ProjectsAdminControls = ({ onProjectsUpdated, refreshKey = 0 }) => {
  const { adminToken } = useAdmin();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);

  const [mode, setMode] = useState("idle"); // 'idle' | 'create' | 'edit'
  const [editingProject, setEditingProject] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("current");
  const [year, setYear] = useState("");
  const [authors, setAuthors] = useState("");
  const [awardName, setAwardName] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [number, setNumber] = useState("");
  const [cropImageSrc, setCropImageSrc] = useState(null);

  // Mutations: always use latest adminToken
  const createMutation = useCreateProject(adminToken);
  const updateMutation = useUpdateProject(adminToken);
  const deleteMutation = useDeleteProject(adminToken);

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  const fetchAllAdminProjects = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const resp = await fetch(`${BASE_URL}/api/projects`);
      if (!resp.ok) throw new Error(`Failed to load projects (${resp.status})`);
      const data = await resp.json();
      setProjects(
        data.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
        )
      );
    } catch (err) {
      setListError(err.message);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAdminProjects();
  }, [fetchAllAdminProjects, onProjectsUpdated, refreshKey]);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setLink("");
    setStatus("current");
    setYear("");
    setAuthors("");
    setAwardName("");
    setTags("");
    setSelectedFile(null);
    setCurrentImageUrl(null);
    setEditingProject(null);
    setMode("idle");
    setSubmitError(null);
    setNumber("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => setCropImageSrc(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
    setSelectedFile(croppedFile);
    setCurrentImageUrl(URL.createObjectURL(croppedBlob));
    setCropImageSrc(null);
  };

  const handleCropCancel = () => {
    setCropImageSrc(null);
  };

  const beginCreate = () => {
    resetForm();
    setMode("create");
  };

  const beginEdit = (project) => {
    resetForm();
    setMode("edit");
    setEditingProject(project);
    setTitle(project.title);
    setSubtitle(project.subtitle || "");
    setDescription(project.description || "");
    setLink(project.link || "");
    setStatus(project.status);
    setYear(project.year?.toString() || "");
    setAuthors(project.authors?.join(", ") || "");
    setAwardName(project.awardName || "");
    setTags(project.tags?.join(", ") || "");
    setCurrentImageUrl(project.image || null);
    setNumber(project.number?.toString() || "");
  };

  const validate = () => {
    if (!title || !status) return "Title and Status are required";
    if ((status === "award" || status === "completed") && !year)
      return "Year is required for this status";
    if (status === "award" && !awardName) return "Award Name is required for Award status";
    if (!number && number !== 0) return "Project number is required";
    if (isNaN(Number(number))) return "Project number must be a valid number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const err = validate();
    if (err) {
      setSubmitError(err);
      return;
    }

    // Build payload
    const projectPayload = {
      title,
      subtitle: subtitle || undefined,
      description: description || undefined,
      link: link || undefined,
      status,
      year: year ? parseInt(year, 10) : undefined,
      number: Number(number),
      authors: authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      awardName: status === "award" ? awardName : undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    // When editing and existing image removed explicitly
    if (mode === "edit" && currentImageUrl === null && !selectedFile && editingProject?.image) {
      projectPayload.image = undefined; // indicates deletion
    }
    let action, actionArgs;
    if (mode === "edit") {
      action = updateMutation.mutateAsync;
      actionArgs = {
        id: editingProject?._id,
        file: selectedFile,
        update: projectPayload,
        token: adminToken,
      };
    } else {
      action = createMutation.mutateAsync;
      actionArgs = {
        file: selectedFile,
        project: projectPayload,
        token: adminToken,
      };
    }
    try {
      await action(actionArgs);
      toast.success(`Project ${mode === "edit" ? "updated" : "created"} successfully`);
      resetForm();
      onProjectsUpdated?.();
    } catch (error) {
      // Show backend error in UI and toast
      const msg =
        error?.message || (error?.response && error.response.data?.message) || "Operation failed";
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id); // Pass only the ID string
      toast.success("Project deleted");
      if (editingProject?._id === id) resetForm();
      onProjectsUpdated?.();
    } catch (error) {
      const msg =
        error?.message || (error?.response && error.response.data?.message) || "Delete failed";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100";
  const buttonBase =
    "font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50";
  const primaryBtn = `bg-blue-600 hover:bg-blue-700 text-white ${buttonBase}`;
  const secondaryBtn = `bg-gray-200 hover:bg-gray-300 text-gray-700 ${buttonBase}`;
  const dangerBtn = `bg-red-600 hover:bg-red-700 text-white ${buttonBase} text-xs px-3 py-1.5`;
  const warningBtn = `bg-yellow-500 hover:bg-yellow-600 text-white ${buttonBase} text-xs px-3 py-1.5`;
  const successBtn = `bg-green-600 hover:bg-green-700 text-white ${buttonBase}`;

  return (
    <>
    {cropImageSrc && (
      <ImageCropModal
        imageSrc={cropImageSrc}
        aspect={16 / 9}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    )}
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="p-4 sm:p-6 border border-gray-200 rounded-lg my-8 bg-gray-50 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 w-full">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Admin: Manage Projects
          </h3>
          {mode === "idle" && (
            <button
              onClick={beginCreate}
              className={successBtn}
              disabled={isSubmitting || isLoadingList}
            >
              + Add New Project
            </button>
          )}
        </div>

        {(isSubmitting || deleteMutation.isLoading || isLoadingList) && (
          <div className="my-4">
            <LoadingSpinner
              message={
                isLoadingList
                  ? "Loading projects..."
                  : isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : deleteMutation.isLoading
                  ? "Deleting..."
                  : "Processing..."
              }
            />
          </div>
        )}

        {mode === "idle" && (
          <div className="space-y-3 w-full max-h-96 overflow-y-auto pr-2">
            {listError && (
              <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
                Error loading list: {listError}
              </div>
            )}
            {!isLoadingList &&
              projects.map((project) => (
                <div
                  key={project._id}
                  className="border border-gray-200 rounded-md p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded flex-shrink-0 border"
                      />
                    )}
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold text-gray-800 truncate" title={project.title}>
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {project.status}
                        {project.year ? `, ${project.year}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-end md:self-center mt-2 md:mt-0">
                    <button
                      onClick={() => beginEdit(project)}
                      className={warningBtn}
                      disabled={isSubmitting || deleteMutation.isLoading || isLoadingList}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className={`${dangerBtn} ${
                        deletingId === project._id ? "opacity-50 cursor-wait" : ""
                      }`}
                      disabled={isSubmitting || deleteMutation.isLoading || isLoadingList}
                    >
                      {deletingId === project._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            {!isLoadingList && !listError && projects.length === 0 && (
              <p className="text-gray-500 italic text-center py-4">
                No projects found. Click "Add New Project" to create one.
              </p>
            )}
          </div>
        )}

        {(mode === "create" || mode === "edit") && (
          <div className="p-4 border border-gray-200 rounded-md mt-4 bg-white shadow-md w-full">
            <h4 className="text-lg font-medium mb-4 text-gray-700">
              {mode === "create" ? "Create New Project" : `Edit Project: ${editingProject?.title}`}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
                  {submitError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Number *
                  </label>
                  <input
                    id="number"
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className={inputClass}
                    required
                    min="0"
                    disabled={isSubmitting}
                    placeholder="For ordering"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`${inputClass} bg-white`}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="current">Current</option>
                    <option value="completed">Completed</option>
                    <option value="award">Award</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="subtitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subtitle
                  </label>
                  <input
                    id="subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>
                {(status === "completed" || status === "award") && (
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      id="year"
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className={inputClass}
                      required
                      disabled={isSubmitting}
                      placeholder="YYYY"
                    />
                  </div>
                )}
                {status === "award" && (
                  <div>
                    <label
                      htmlFor="awardName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Award Name *
                    </label>
                    <input
                      id="awardName"
                      type="text"
                      value={awardName}
                      onChange={(e) => setAwardName(e.target.value)}
                      className={inputClass}
                      required
                      disabled={isSubmitting}
                      placeholder="e.g., Reddot Design Award"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
                    Authors (comma-separated)
                  </label>
                  <input
                    id="authors"
                    type="text"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    className={inputClass}
                    disabled={isSubmitting}
                    placeholder="J. Doe, A. Smith"
                  />
                </div>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link (URL)
                  </label>
                  <input
                    id="link"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className={inputClass}
                    disabled={isSubmitting}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={inputClass}
                    disabled={isSubmitting}
                    placeholder="healthcare, iot, design"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="image-upload"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {mode === "edit" && editingProject?.image ? "Replace Image (Optional)" : "Image"}
                </label>
                {currentImageUrl && (
                  <div className="my-2 relative w-40 h-32">
                    <img
                      src={currentImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded border border-gray-300"
                    />
                    {mode === "edit" && editingProject?.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentImageUrl(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none focus:outline-none hover:bg-red-600"
                        title="Remove Image"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className={primaryBtn} disabled={isSubmitting}>
                  {isSubmitting
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                    ? "Create Project"
                    : "Update Project"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={secondaryBtn}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

ProjectsAdminControls.propTypes = {
  onProjectsUpdated: PropTypes.func,
};

export default ProjectsAdminControls;
