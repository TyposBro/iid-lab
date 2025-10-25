import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
import { LoadingSpinner } from "@/components/"; // Assuming you have this

export const AdminMetaControls = ({
  pageIdentifier,
  initialData,
  fieldsConfig,
  onUpdateSuccess,
  containerClass = "p-4 border rounded my-8 w-full bg-gray-100",
}) => {
  const { adminToken } = useAdmin();
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({}); // Track uploaded files for image fields
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Initialize form data from initialData based on fieldsConfig
    const initialForm = {};
    fieldsConfig.forEach((field) => {
      initialForm[field.name] = initialData?.[field.name] || field.defaultValue || "";
    });
    setFormData(initialForm);
  }, [initialData, fieldsConfig]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (fieldName, file) => {
    setImageFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // First, upload any images
      const updatedFormData = { ...formData };
      
      for (const fieldName in imageFiles) {
        if (imageFiles[fieldName]) {
          const file = imageFiles[fieldName];
          const formDataUpload = new FormData();
          formDataUpload.append("images", file);

          const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
            body: formDataUpload,
          });

          if (!uploadRes.ok) {
            throw new Error(`Image upload failed for ${fieldName}`);
          }

          const uploadResult = await uploadRes.json();
          // The upload endpoint returns an array of URLs
          const imageUrl = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult.urls?.[0];
          
          if (!imageUrl) {
            throw new Error(`No image URL returned for ${fieldName}`);
          }

          updatedFormData[fieldName] = imageUrl;
        }
      }

      // Then update the meta data
      const response = await fetch(`${BASE_URL}/api/meta/${pageIdentifier}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update meta data.");
      }
      setSuccess("Meta data updated successfully!");
      setIsEditing(false);
      setImageFiles({}); // Clear image files after successful upload
      if (onUpdateSuccess) {
        onUpdateSuccess(); // Trigger parent refetch
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!adminToken) return null; // Don't render if not admin

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Admin: Manage {pageIdentifier.charAt(0).toUpperCase() + pageIdentifier.slice(1)} Page Meta
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded text-sm"
          >
            Edit Meta
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          {isSubmitting && <LoadingSpinner message="Saving..." />}

          {fieldsConfig.map((field) => (
            <div key={field.name} className="mb-3">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  rows={field.rows || 3}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm"
                  disabled={isSubmitting}
                />
              ) : field.type === "image" ? (
                <div className="space-y-2">
                  {/* Show current image if exists */}
                  {formData[field.name] && !imageFiles[field.name] && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={formData[field.name]}
                        alt="Current"
                        className="w-full h-auto rounded border border-gray-300"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Current image</p>
                    </div>
                  )}
                  {/* Show preview of newly selected image */}
                  {imageFiles[field.name] && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={URL.createObjectURL(imageFiles[field.name])}
                        alt="Preview"
                        className="w-full h-auto rounded border border-green-500"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                      <p className="text-xs text-green-600 mt-1">New image selected</p>
                    </div>
                  )}
                  {/* File input */}
                  <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageChange(field.name, file);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm"
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm"
                  disabled={isSubmitting}
                  placeholder={field.placeholder || ""}
                />
              )}
              {field.hint && <p className="text-xs text-gray-500 mt-1">{field.hint}</p>}
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Optionally reset form to initialData on cancel
                const initialForm = {};
                fieldsConfig.forEach((f) => {
                  initialForm[f.name] = initialData?.[f.name] || f.defaultValue || "";
                });
                setFormData(initialForm);
                setImageFiles({}); // Clear any pending image uploads
                setError(null);
                setSuccess(null);
              }}
              className="text-gray-600 hover:text-gray-800 p-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

AdminMetaControls.propTypes = {
  pageIdentifier: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  fieldsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string, // text, textarea, email, url, tel, number
      rows: PropTypes.number, // for textarea
      defaultValue: PropTypes.any,
      placeholder: PropTypes.string,
      hint: PropTypes.string,
    })
  ).isRequired,
  onUpdateSuccess: PropTypes.func,
  containerClass: PropTypes.string,
};

export default AdminMetaControls;
