/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { AccordionCard, GoTo, LoadingSpinner } from "@/components/"; // Import LoadingSpinner
import { useState, useEffect, useCallback } from "react";
import { HashLink } from "react-router-hash-link";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";

export const Team = () => {
  const { isAdmin } = useAdmin();
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profData, setProfData] = useState(null);
  const [profLoading, setProfLoading] = useState(true);
  const [profError, setProfError] = useState(null);

  // This function will be passed down to child components for team members
  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/team`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // This function will be passed down to child components for professor
  const fetchProfData = useCallback(async () => {
    try {
      setProfLoading(true);
      const response = await fetch(`${BASE_URL}/prof`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfData(data); // Assuming only one professor entry
      setProfLoading(false);
    } catch (err) {
      setProfError(err.message);
      setProfLoading(false);
    }
  }, []);

  // Initial data fetch for team members
  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  // Initial data fetch for professor
  useEffect(() => {
    fetchProfData();
  }, [fetchProfData]);

  // Filter data for current team and alumni
  const currentTeamMembers = teamData.filter((member) => member.type !== "alumni");
  const alumniMembers = teamData.filter((member) => member.type === "alumni");

  return (
    <div className="flex flex-col justify-start items-center px-[25px] pt-[95px] w-full">
      {isAdmin && <AdminProfessorControls professor={profData} refreshData={fetchProfData} />}
      {isAdmin && <AdminTeamControls refreshData={fetchTeamData} />}
      <TeamProf prof={profData} loading={profLoading} error={profError} />
      <CurrentTeam members={currentTeamMembers} loading={loading} error={error} />
      <Alumni members={alumniMembers} loading={loading} error={error} />
    </div>
  );
};

export default Team;

const TeamProf = ({ prof, loading, error }) => {
  if (loading) return <div>Loading Professor...</div>;
  if (error) return <div>Error loading Professor: {error}</div>;
  if (!prof) return <div>Professor data not found.</div>;

  return (
    <div className="flex flex-col gap-[30px] my-[30px] w-full sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-5 ">
      <div
        className="rounded-[30px] w-full h-[360px] sm:size-96 sm:m-auto sm:col-start-2 row-start-1 row-end-3 sm:self-start"
        style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      ></div>
      <div className="flex flex-col gap-[5px] w-full">
        <h2 className="font-bold text-[20px] text-primary_main">{prof.role}</h2>
        <h1 className="font-bold text-[36px] text-text_black_primary leading-[36px]">
          {prof.name}
        </h1>
        <h3 className="text-[12px] text-text_black_secondary">{prof.desc}</h3>
      </div>
      <div className="flex flex-col gap-[10px] font-semibold text-[18px] sm:flex-row sm:w-1/2">
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-primary_main bg-primary_main border-solid rounded-[15px] w-full h-[50px] text-text_white_primary"
          to="/prof"
        >
          CV <Up_right_neutral_arrow />
        </HashLink>
        <a
          className="place-content-center border-2 border-primary_main grid border-solid rounded-[15px] w-full h-[50px] text-primary_main"
          href={`mailto:${prof.email || "kmyung@unist.ac.kr"}`}
        >
          Contact
        </a>
      </div>
    </div>
  );
};

// Updated CurrentTeam component to accept members as props
const CurrentTeam = ({ members, loading, error }) => {
  const [selected, setSelected] = useState("All");
  const [derivedRoles, setDerivedRoles] = useState(["All"]);

  useEffect(() => {
    if (members.length > 0) {
      setDerivedRoles(["All", ...new Set(members.map((member) => member.role))]);
    }
  }, [members]);

  if (loading) return <div>Loading Current Team...</div>;
  if (error) return <div>Error loading Current Team: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-5xl text-text_black_primary">Current Team</h2>
          <Down_left_dark_arrow className="size-14" style={{ strokeWidth: 1 }} />
        </div>
        <h3 className="text-sm text-text_black_secondary">
          Our lab is a vibrant hub of international and Korean researchers from diverse backgrounds,
          creating a dynamic and inclusive environment. Working here is not just productive but also
          a lot of fun, thanks to our enthusiastic and collaborative team!
        </h3>
      </div>
      <div className="flex gap-[10px] sm:w-1/2 lg:w-1/3">
        {derivedRoles.map((role) => (
          <button
            className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full w-full h-[30px] text-primary_main active:text-text_white_primary ${
              role === selected ? "bg-primary_main text-text_white_primary" : "text-primary_main"
            }`}
            key={role}
            onClick={() => setSelected(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-[10px] sm:grid sm:grid-cols-2 lg:grid-cols-3 ">
        {members
          .filter((elem) => (selected === "All" ? true : elem.role === selected))
          .map((member) => (
            <AccordionCard
              key={member._id}
              title={member.name}
              subtitle={member.role}
              bg={member.img}
              desc={member.bio}
            />
          ))}
      </div>
    </div>
  );
};

// Updated Alumni component to accept members as props
const Alumni = ({ members, loading, error }) => {
  const [selected, setSelected] = useState("All");
  const [derivedRoles, setDerivedRoles] = useState(["All"]);

  useEffect(() => {
    if (members.length > 0) {
      setDerivedRoles(["All", ...new Set(members.map((member) => member.role))]);
    }
  }, [members]);

  if (loading) return <div>Loading Alumni...</div>;
  if (error) return <div>Error loading Alumni: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full" id="alumni">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-5xl text-text_black_primary">Alumni</h2>
        <Down_left_dark_arrow className="size-12" style={{ strokeWidth: 1 }} />
      </div>
      <div className="flex gap-[10px] sm:w-1/2 lg:w-1/3">
        {derivedRoles.map((role) => (
          <button
            className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full w-full h-[30px] text-primary_main active:text-text_white_primary  ${
              role === selected ? "bg-primary_main text-text_white_primary" : "text-primary_main"
            }`}
            key={role}
            onClick={() => setSelected(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-[10px] sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {members
          .filter((elem) => (selected === "All" ? true : elem.role === selected))
          .map((member) => (
            <AccordionCard
              key={member._id}
              title={member.name}
              subtitle={member.role}
              bg={member.img}
              desc={member.bio}
            />
          ))}
      </div>

      <button className="flex items-center gap-[10px] active:bg-primary_main mx-auto px-[24px] py-[8px] rounded-[18px] font-semibold text-[18px] text-primary_main active:text-white">
        View All Alumni <Up_right_neutral_arrow />
      </button>
    </div>
  );
};

// Updated AdminTeamControls component to handle immediate data refresh
const AdminTeamControls = ({ refreshData }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newType, setNewType] = useState("current");
  const [newBio, setNewBio] = useState("");
  const [newLinkedIn, setNewLinkedIn] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdmin();
  const [deletingId, setDeletingId] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const roles = ["PhD", "Masters", "Researcher", "Intern"];
  const types = ["current", "alumni"];

  // Fetch team members for the admin panel
  const fetchAdminTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/team`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMembers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [adminToken]); // Added adminToken to dependency array

  useEffect(() => {
    fetchAdminTeamMembers();
  }, [fetchAdminTeamMembers]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedImageUrl(data[0]);
        } else {
          console.error("Failed to upload image");
          const errorData = await response.json();
          alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
          setUploadedImageUrl("");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadedImageUrl("");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setUploadedImageUrl("");
    }
  };

  const handleCreate = async () => {
    if (!uploadedImageUrl) {
      alert("Please upload an image.");
      return;
    }

    setIsSubmitting(true);
    const newMember = {
      name: newName,
      role: newRole,
      type: newType,
      bio: newBio,
      img: uploadedImageUrl,
    };

    try {
      const response = await fetch(`${BASE_URL}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        setIsCreating(false);
        setNewName("");
        setNewRole("");
        setNewType("current");
        setNewBio("");
        setNewLinkedIn("");
        setSelectedFile(null);
        setUploadedImageUrl("");

        // Refresh data in both admin panel and main components
        await fetchAdminTeamMembers();
        await refreshData();
      } else {
        console.error("Failed to create team member");
        const errorData = await response.json();
        alert(`Failed to create team member: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error creating team member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setEditingMember(member);
    setNewName(member.name);
    setNewRole(member.role);
    setNewType(member.type || "current");
    setNewBio(member.bio || "");
    setNewLinkedIn(member.linkedIn || "");
    setUploadedImageUrl(member.img);
    setSelectedFile(null);
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    setIsSubmitting(true);
    const updatedMember = {
      name: newName,
      role: newRole,
      type: newType,
      bio: newBio,
      linkedIn: newLinkedIn,
      img: uploadedImageUrl,
    };

    try {
      const response = await fetch(`${BASE_URL}/team/${editingMember._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatedMember),
      });

      if (response.ok) {
        setIsEditing(false);
        setEditingMember(null);
        setNewName("");
        setNewRole("");
        setNewType("current");
        setNewBio("");
        setNewLinkedIn("");
        setSelectedFile(null);
        setUploadedImageUrl("");

        // Refresh data in both admin panel and main components
        await fetchAdminTeamMembers();
        await refreshData();
      } else {
        console.error("Failed to update team member");
        const errorData = await response.json();
        alert(`Failed to update team member: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error updating team member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setDeletingId(id);
      try {
        const response = await fetch(`${BASE_URL}/team/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          // Refresh data in both admin panel and main components
          await fetchAdminTeamMembers();
          await refreshData();
        } else {
          console.error("Failed to delete team member");
        }
      } catch (error) {
        console.error("Error deleting team member:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return <div>Loading Team Members...</div>;
  if (error) return <div>Error loading Team Members: {error}</div>;

  return (
    <div className="p-4 border rounded w-full flex justify-between items-center flex-wrap">
      <h3 className="text-xl font-semibold mb-4">Admin: Manage Members</h3>

      {(isSubmitting || deletingId) && (
        <LoadingSpinner
          message={
            isSubmitting
              ? isCreating
                ? "Creating Member..."
                : "Updating Member..."
              : "Deleting Member..."
          }
        />
      )}

      {!isCreating && !isEditing && (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-500 text-white p-2 rounded mb-4"
          disabled={isSubmitting || deletingId}
        >
          + Add New Member
        </button>
      )}

      {members.map((member) => (
        <div
          key={member._id}
          className="w-full border rounded p-2 mb-2 relative flex items-center justify-between"
        >
          <p>
            <strong>{member.name}</strong> ({member.role}) - {member.type || "current"}
          </p>
          <div>
            <button
              onClick={() => handleEdit(member)}
              className="bg-yellow-500 text-white p-1 px-2 rounded mr-2 text"
              disabled={isSubmitting || deletingId}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(member._id)}
              className="bg-red-500 text-white p-1 px-2 rounded"
              disabled={isSubmitting || deletingId === member._id}
            >
              {deletingId === member._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}

      {isCreating && (
        <div className="w-full p-4 border rounded mt-4">
          <h3>Create New Team Member</h3>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-1">
            Role
          </label>
          <select
            id="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            disabled={isSubmitting}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-1">
            Type
          </label>
          <select
            id="type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            disabled={isSubmitting}
          >
            <option value="current">Current</option>
            <option value="alumni">Alumni</option>
          </select>
          <div className="mb-2">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              rows="3"
              placeholder="Enter bio"
              disabled={isSubmitting}
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={newLinkedIn}
              onChange={(e) => setNewLinkedIn(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            />
            {uploadedImageUrl && isCreating && (
              <img
                src={uploadedImageUrl}
                alt="Uploaded Image"
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting || !uploadedImageUrl}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="ml-2 text-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      )}

      {isEditing && editingMember && (
        <div className="p-4 border rounded">
          <h3>Edit Team Member</h3>
          {isSubmitting && <LoadingSpinner message="Updating Member..." />}
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-1">
            Role
          </label>
          <select
            id="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            disabled={isSubmitting}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-1">
            Type
          </label>
          <select
            id="type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            disabled={isSubmitting}
          >
            <option value="current">Current</option>
            <option value="alumni">Alumni</option>
          </select>
          <div className="mb-2">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              rows="3"
              placeholder="Enter bio"
              disabled={isSubmitting}
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={newLinkedIn}
              onChange={(e) => setNewLinkedIn(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="image">
              Image (Upload new to replace)
            </label>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            />
            {(uploadedImageUrl || editingMember.img) && (
              <div className="mt-2">
                <img
                  src={uploadedImageUrl || editingMember.img}
                  alt="Current Team Member Image"
                  className="w-32 h-32 object-cover rounded"
                />
                <p className="text-xs text-gray-500">
                  {uploadedImageUrl ? "New Image Preview" : "Current Image"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            Update
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 text-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// New component for Professor CRUD
const AdminProfessorControls = ({ professor, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { adminToken } = useAdmin();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (professor) {
      setEditingProfessor(professor);
      setName(professor.name || "");
      setRole(professor.role || "");
      setDesc(professor.desc || "");
      setCvLink(professor.cvLink || "");
      setUploadedImageUrl(professor.img || "");
      setIsCreating(false);
    } else {
      setEditingProfessor(null);
      setName("");
      setRole("");
      setDesc("");
      setCvLink("");
      setUploadedImageUrl("");
      setIsEditing(false);
    }
  }, [professor]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedImageUrl(data[0]);
        } else {
          console.error("Failed to upload image");
          const errorData = await response.json();
          alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
          setUploadedImageUrl("");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadedImageUrl("");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setUploadedImageUrl("");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreateButtonClick = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingProfessor(null);
    setName("");
    setRole("");
    setDesc("");
    setCvLink("");
    setUploadedImageUrl("");
    setSelectedFile(null);
  };

  const handleCreate = async () => {
    if (!uploadedImageUrl) {
      alert("Please upload an image.");
      return;
    }

    setIsSubmitting(true);
    const newProfessorData = {
      name,
      role,
      img: uploadedImageUrl,
      desc,
      cvLink,
    };

    try {
      const response = await fetch(`${BASE_URL}/prof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newProfessorData),
      });

      if (response.ok) {
        setIsCreating(false);
        await refreshData(); // Refresh to get the newly created professor
      } else {
        console.error("Failed to create professor");
        const errorData = await response.json();
        alert(`Failed to create professor: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error creating professor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingProfessor) return;

    setIsSubmitting(true);
    const updatedProfessorData = {
      name,
      role,
      img: uploadedImageUrl,
      desc,
      cvLink,
    };

    try {
      const response = await fetch(`${BASE_URL}/prof/${editingProfessor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatedProfessorData),
      });

      if (response.ok) {
        setIsEditing(false);
        await refreshData(); // Refresh professor data
      } else {
        console.error("Failed to update professor");
        const errorData = await response.json();
        alert(`Failed to update professor: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error updating professor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingProfessor) return;
    if (window.confirm("Are you sure you want to delete the professor?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`${BASE_URL}/prof/${editingProfessor._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          await refreshData(); // Refresh to indicate no professor exists
        } else {
          console.error("Failed to delete professor");
          const errorData = await response.json();
          alert(`Failed to delete professor: ${errorData?.message || "An error occurred"}`);
        }
      } catch (error) {
        console.error("Error deleting professor:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderForm = () => (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        disabled={isSubmitting}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        disabled={isSubmitting}
      />
      <div className="mb-2">
        <label htmlFor="desc" className="block text-gray-700 text-sm font-bold mb-1">
          Description
        </label>
        <textarea
          id="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          rows="3"
          placeholder="Enter description"
          disabled={isSubmitting}
        ></textarea>
      </div>
      <input
        type="text"
        placeholder="CV Link"
        value={cvLink}
        onChange={(e) => setCvLink(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        disabled={isSubmitting}
      />
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="image">
          Image (Upload new)
        </label>
        <input
          type="file"
          id="image"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
        />
        {(uploadedImageUrl || (editingProfessor && editingProfessor.img)) && (
          <div className="mt-2">
            <img
              src={uploadedImageUrl || (editingProfessor && editingProfessor.img)}
              alt="Professor Image Preview"
              className="w-32 h-32 object-cover rounded"
            />
            <p className="text-xs text-gray-500">
              {uploadedImageUrl ? "New Image Preview" : "Current Image"}
            </p>
          </div>
        )}
      </div>

      {isCreating && (
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white p-2 rounded"
          disabled={isSubmitting || !uploadedImageUrl}
        >
          {isSubmitting ? "Creating..." : "Create Professor"}
        </button>
      )}
      {isEditing && (
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Professor"}
        </button>
      )}
      {(isCreating || isEditing) && (
        <button
          onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
          }}
          className="ml-2 text-gray-600"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4 mb-4 border rounded w-full">
      <div className="flex flex-wrap justify-between items-center">
        <h3 className="text-xl font-semibold mb-4">Admin: Manage Professor Info</h3>

        {isSubmitting && (
          <LoadingSpinner
            message={
              isCreating
                ? "Creating Professor..."
                : isEditing
                ? "Updating Professor..."
                : "Loading..."
            }
          />
        )}
        {isDeleting && <LoadingSpinner message="Deleting Professor..." />}

        {!professor && !isCreating && (
          <button onClick={handleCreateButtonClick} className="bg-green-500 text-white p-2 rounded">
            Create Professor Info
          </button>
        )}
        {professor && !isEditing && !isCreating && (
          <div className="flex gap-2">
            <button onClick={handleEdit} className="bg-yellow-500 text-white p-2 rounded">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
              Delete
            </button>
          </div>
        )}
      </div>

      {(isCreating || isEditing) && renderForm()}
    </div>
  );
};
