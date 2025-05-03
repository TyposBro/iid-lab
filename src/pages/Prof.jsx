/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Down_straight_neutral_arrow } from "@/assets";
import { GoTo } from "@/components/";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api"; // Import BASE_URL
import { LoadingSpinner } from "@/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Prof = () => {
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const response = await fetch(`${BASE_URL}/prof`);
        if (!response.ok) throw new Error("Failed to fetch professor");
        const data = await response.json();
        setProf(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessor();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Professor..." />;
  if (error) return <div>Error loading professor: {error}</div>;

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] px-[25px] w-full gap-6">
      {prof ? (
        <>
          <Intro prof={prof} />
          <Background list={prof.background} />
          <Links list={prof.background} />
          <div className="w-full flex flex-col gap-[10px] font-semibold text-[18px]">
            <a
              href={prof.cvLink || "#"}
              target="_blank"
              className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
            >
              Download CV
            </a>
            <a
              className="place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-primary_main active:text-white no-underline"
              href={`mailto:${prof.email}`}
            >
              Contact
            </a>
          </div>
        </>
      ) : (
        <div className="text-center">No professor data available</div>
      )}

      {isAdmin && <AdminProfessorControls prof={prof} setProf={setProf} />}
      <GoTo title="Projects Gallery" link="/projects" />
    </div>
  );
};

export default Prof;

const AdminProfessorControls = ({ prof, setProf }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(prof || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { adminToken } = useAdmin();

  useEffect(() => {
    setFormData(
      prof || {
        name: "",
        role: "",
        img: "",
        desc: "",
        stats: [],
        interests: "",
        background: [],
        cvLink: "",
        email: "",
        phone: "",
      }
    );
    // Set initial image preview if prof has an image
    if (prof?.img) {
      setImagePreview(prof.img);
    } else {
      setImagePreview(null);
    }
  }, [prof]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setImagePreview(prof?.img || null);
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("Image size should be less than 50MB");
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    // Generate preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile) return formData.img;

    const imageFormData = new FormData();
    imageFormData.append("images", selectedFile);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: imageFormData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the API returns an imageUrl or url property
      const imageUrl = data.imageUrl || data.url || (Array.isArray(data) ? data[0] : null);

      if (!imageUrl) {
        throw new Error("Invalid response format from upload API");
      }

      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(`Failed to upload image: ${error.message}`);
      return formData.img;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);

    try {
      let imageUrl = formData.img;
      if (selectedFile) {
        imageUrl = await uploadImage();
        if (uploadError) throw new Error(uploadError);
      }

      const professorData = {
        ...formData,
        img: imageUrl,
      };

      const url = prof?._id ? `${BASE_URL}/professors/${prof._id}` : `${BASE_URL}/professors`;
      const method = prof?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(professorData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${prof ? "update" : "create"} professor profile`);
      }

      const result = await response.json();
      setProf(result);
      setIsEditing(false);
    } catch (error) {
      console.error("Submission error:", error);
      setUploadError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!prof?._id) return;
    if (!window.confirm("Delete professor profile?")) return;

    try {
      const response = await fetch(`${BASE_URL}/professors/${prof._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }

      setProf(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Delete error:", error);
      setUploadError(`Failed to delete profile: ${error.message}`);
    }
  };

  const resetImageSelection = () => {
    setSelectedFile(null);
    setImagePreview(prof?.img || null);
    setUploadError(null);
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { key: "", value: "" }],
    }));
  };

  const addBackground = () => {
    setFormData((prev) => ({
      ...prev,
      background: [...prev.background, { type: "", items: [{ period: "", desc: "" }] }],
    }));
  };

  const addBackgroundItem = (bgIndex) => {
    setFormData((prev) => {
      const updated = [...prev.background];
      updated[bgIndex].items.push({ period: "", desc: "" });
      return { ...prev, background: updated };
    });
  };

  if (!isEditing) {
    return (
      <div className="w-full p-4">
        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded">
          {prof ? "Edit Profile" : "Create Profile"}
        </button>
        {prof && (
          <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded ml-2">
            Delete Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full p-4 border-t-2 mt-4">
      {isSubmitting && <LoadingSpinner message="Saving..." />}
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {uploadError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload with Preview */}
        <div className="border p-4 rounded">
          <label className="block mb-2 font-bold">Profile Image</label>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
                <button
                  type="button"
                  onClick={resetImageSelection}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            {/* File Input */}
            <div className="flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: JPEG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info Fields */}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          className="w-full p-2 border rounded"
          rows="4"
        />
        <input
          type="text"
          placeholder="Interests"
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="w-full p-2 border rounded"
        />

        {/* Stats Section */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-bold mb-2">Stats</h3>
          {formData.stats.map((stat, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={stat.key}
                onChange={(e) => {
                  const newStats = [...formData.stats];
                  newStats[index].key = e.target.value;
                  setFormData({ ...formData, stats: newStats });
                }}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Value"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...formData.stats];
                  newStats[index].value = e.target.value;
                  setFormData({ ...formData, stats: newStats });
                }}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const newStats = [...formData.stats];
                  newStats.splice(index, 1);
                  setFormData({ ...formData, stats: newStats });
                }}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStat}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            Add Stat
          </button>
        </div>

        {/* Background Section */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-bold mb-2">Background</h3>
          {formData.background.map((bg, bgIndex) => (
            <div key={bgIndex} className="mb-4 border p-2 rounded">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type (Education, Academia, etc.)"
                  value={bg.type}
                  onChange={(e) => {
                    const newBg = [...formData.background];
                    newBg[bgIndex].type = e.target.value;
                    setFormData({ ...formData, background: newBg });
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newBg = [...formData.background];
                    newBg.splice(bgIndex, 1);
                    setFormData({ ...formData, background: newBg });
                  }}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </div>

              {bg.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Period"
                    value={item.period}
                    onChange={(e) => {
                      const newBg = [...formData.background];
                      newBg[bgIndex].items[itemIndex].period = e.target.value;
                      setFormData({ ...formData, background: newBg });
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.desc}
                    onChange={(e) => {
                      const newBg = [...formData.background];
                      newBg[bgIndex].items[itemIndex].desc = e.target.value;
                      setFormData({ ...formData, background: newBg });
                    }}
                    className="flex-1 p-2 border rounded"
                    rows="2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newBg = [...formData.background];
                      newBg[bgIndex].items.splice(itemIndex, 1);
                      setFormData({ ...formData, background: newBg });
                    }}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBackgroundItem(bgIndex)}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                Add Background Item
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBackground}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            Add Background Section
          </button>
        </div>

        {/* Contact Info */}
        <input
          type="text"
          placeholder="CV Link"
          value={formData.cvLink}
          onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={isSubmitting}
          >
            {prof ? "Save Changes" : "Create Profile"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Intro = ({ prof }) => {
  return (
    <div className="flex flex-col gap-[30px] w-full">
      <div
        className="mx-auto w-full min-h-[360px]"
        style={{
          backgroundImage: `url(${prof.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="flex flex-col gap-[10px] w-full">
        <div>
          <h2 className="font-semibold text-[16px] text-primary_main">{prof.role}</h2>
          <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
            {prof.name}
          </h1>
        </div>
        <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>
        {/* Stats */}
        <div className="flex flex-col items-center gap-4 w-full py-6 ">
          {/* First row - always 2 items */}
          <div className="flex justify-center gap-4 w-full">
            {prof.stats.slice(0, 2).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>

          {/* Second row - next 3 items */}
          <div className="flex justify-center gap-4 w-full">
            {prof.stats.slice(2, 5).map((elem) => (
              <div key={elem.key} className="max-w-[120px] text-center">
                <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
              </div>
            ))}
          </div>

          {/* Additional rows - any remaining items */}
          {prof.stats.length > 5 && (
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {prof.stats.slice(5).map((elem) => (
                <div key={elem.key} className="max-w-[120px] text-center">
                  <h1 className="font-semibold text-[64px] leading-[48px]">{elem.value}</h1>
                  <h3 className="text-[12px] text-text_black_secondary">{elem.key}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Interest */}
        <div className="text-[12px]">
          <div className="font-bold">Research Interests</div>
          <div className="font-light leading-[14px] text-text_black_secondary">
            {prof.interests}
          </div>
        </div>
      </div>
    </div>
  );
};

Intro.propTypes = {
  prof: PropTypes.object.isRequired,
};

const Background = ({ list }) => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-semibold text-[16px] text-primary_main">Background</h2>
      <div className="flex flex-col gap-[10px]">
        {list.map((elem) => (
          <AccordionCard key={elem.type} title={elem.type} items={elem.items} />
        ))}
      </div>
    </div>
  );
};

Background.propTypes = {
  list: PropTypes.array.isRequired,
};

const AccordionCard = ({ title, items }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div key={title} className="w-full relative" onClick={() => setExpanded((prev) => !prev)}>
      <div
        className={`flex justify-between items-center w-full relative border-b-text_black_primary ${
          expanded ? "" : "border-b-[1px]"
        }`}
      >
        <h2 className="font-semibold text-[48px] leading-[48px]">{title}</h2>
        <Down_straight_neutral_arrow
          className={`size-[30px] transform origin-center transition duration-500 ease-out text-white bg-primary_main rounded-full p-[5px] ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`grid transition-all duration-700 ease-in-out ${
          expanded ? "grid-rows-[1fr] py-[15px] opacity-100" : "grid-rows-[0fr]  opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-hidden">
          {items.map((item) => (
            <div key={item.period} className="flex gap-4">
              <div className="font-semibold text-[11px] flex-shrink-0 w-1/3">{item.period}</div>
              <div className="font-light text-[11px]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AccordionCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

const Links = ({ list }) => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-semibold text-[16px] text-primary_main">
        Professional Activities and Services
      </h2>
      <div className="flex flex-col gap-[10px]">
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Journal Papers</h2>
          <a href="/publications?type=journal" className="no-underline">
            <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
          </a>
        </div>
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Conference Papers</h2>
          <a href="/publications?type=conference" className="no-underline">
            <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
          </a>
        </div>
        <div className="flex justify-between items-center w-full relative border-b-text_black_primary">
          <h2 className="font-semibold text-[24px] leading-[48px]">Design Awards</h2>
          <a href="/publications?type=awards" className="no-underline">
            <Down_straight_neutral_arrow className="size-[30px] text-white bg-primary_main rounded-full p-[5px] -rotate-90" />
          </a>
        </div>
      </div>
    </div>
  );
};

Links.propTypes = {
  list: PropTypes.array.isRequired,
};
