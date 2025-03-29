import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { AccordionCard, GoTo, LoadingSpinner } from "@/components/"; // Import LoadingSpinner
import { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";

export const Team = () => {
  const { isAdmin } = useAdmin();

  return (
    <div className="flex flex-col justify-start items-center px-[25px] pt-[95px] w-full h-dvh overflow-y-scroll">
      {isAdmin && <AdminTeamControls />}
      <TeamProf />
      <CurrentTeam />
      <Alumni />
      {window.innerWidth <= 640 ? (
        <GoTo title="Projects Gallery" link="/gallery" />
      ) : (
        <div className="w-full flex justify-between">
          <GoTo title="Projects Gallery" link="/gallery" />
          <GoTo title="Lab News" link="/news" />
        </div>
      )}
    </div>
  );
};

export default Team;

const TeamProf = () => {
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/professor`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProf(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfData();
  }, []);

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

const CurrentTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSetselected] = useState("All");
  const [derivedRoles, setDerivedRoles] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/team`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const currentMembers = data.filter((member) => member.type !== "alumni"); // Assuming you might have a 'type' field
        setMembers(currentMembers);
        setDerivedRoles(["All", ...new Set(currentMembers.map((member) => member.role))]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) return <div>Loading Current Team...</div>;
  if (error) return <div>Error loading Current Team: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full">
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <h2 className="font-light text-[48px] text-text_black_primary leading-[48px]">
            Current Team
          </h2>
          <Down_left_dark_arrow className="size-[58px]" />
        </div>
        <h3 className="font-light text-[12px] text-text_black_secondary">
          Our lab is a vibrant hub of international and Korean researchers from diverse backgrounds,
          creating a dynamic and inclusive environment. Working here is not just productive but also
          a lot of fun, thanks to our enthusiastic and collaborative team!
        </h3>
      </div>
      <div className="flex gap-[10px] sm:w-1/2 lg:w-1/3">
        <button
          className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full w-full h-[30px] text-primary_main active:text-text_white_primary ${
            "All" === selected ? "bg-primary_main text-text_white_primary" : "text-primary_main"
          }`}
          key="All"
          onClick={() => setSetselected("All")}
        >
          All
        </button>
        {derivedRoles.map((role) => (
          <button
            className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full w-full h-[30px] text-primary_main active:text-text_white_primary ${
              role === selected ? "bg-primary_main text-text_white_primary" : "text-primary_main"
            }`}
            key={role}
            onClick={() => setSetselected(role)}
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
              key={member.name}
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

const Alumni = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSetselected] = useState("All");
  const [derivedRoles, setDerivedRoles] = useState([]);

  useEffect(() => {
    const fetchAlumniMembers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/team`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const alumniMembers = data.filter((member) => member.type === "alumni"); // Assuming you might have a 'type' field
        setMembers(alumniMembers);
        setDerivedRoles(["All", ...new Set(alumniMembers.map((member) => member.role))]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlumniMembers();
  }, []);

  if (loading) return <div>Loading Alumni...</div>;
  if (error) return <div>Error loading Alumni: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] pt-[30px] w-full" id="alumni">
      <div className="flex justify-between items-center">
        <h2 className="font-extralight text-[48px] text-text_black_primary leading-[48px]">
          Alumni
        </h2>
        <Down_left_dark_arrow className="size-[46px]" />
      </div>
      <div className="flex gap-[10px] sm:w-1/2 lg:w-1/3">
        <button
          className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full w-full h-[30px] text-primary_main active:text-text_white_primary ${
            "All" === selected ? "bg-primary_main text-text_white_primary" : "text-primary_main"
          }`}
          key={"All"}
          onClick={() => setSetselected("All")}
        >
          All
        </button>
        {derivedRoles.map((role) => (
          <button
            className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full w-full h-[30px] text-primary_main active:text-text_white_primary  ${
              role === selected ? "bg-primary_main text-text_white_primary" : "text-primary_main"
            }`}
            key={role}
            onClick={() => setSetselected(role)}
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
              key={member.name}
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

// --- Admin UI Component for Team ---
const AdminTeamControls = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdmin();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
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
    };

    fetchTeamMembers();
  }, [isCreating, isEditing]); // Refetch on create/edit close

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("role", newRole);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await fetch(`${BASE_URL}/team`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIsCreating(false);
        setNewName("");
        setNewRole("");
        setSelectedFile(null);
        // refetchTeamMembers(); // Trigger refetch through useEffect dependency
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
    setSelectedFile(null); // Reset selected file
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("role", newRole);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await fetch(`${BASE_URL}/team/${editingMember._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIsEditing(false);
        setEditingMember(null);
        setNewName("");
        setNewRole("");
        setSelectedFile(null);
        // refetchTeamMembers(); // Trigger refetch through useEffect dependency
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
          // refetchTeamMembers(); // Trigger refetch through useEffect dependency
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
    <div className="p-4">
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
          Add New Member
        </button>
      )}

      {members.map((member) => (
        <div key={member._id} className="border rounded p-2 mb-2 relative">
          <p>
            <strong>{member.name}</strong> ({member.role})
          </p>
          <button
            onClick={() => handleEdit(member)}
            className="bg-yellow-500 text-white p-1 rounded mr-2 text-xs"
            disabled={isSubmitting || deletingId}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(member._id)}
            className="bg-red-500 text-white p-1 rounded text-xs"
            disabled={isSubmitting || deletingId === member._id}
          >
            {deletingId === member._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}

      {isCreating && (
        <div className="p-4 border rounded mt-4">
          <h3>Create New Team Member</h3>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
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
          <input
            type="text"
            placeholder="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            disabled={isSubmitting}
          />
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
            {editingMember.img && (
              <div className="mt-2">
                <img
                  src={editingMember.img}
                  alt="Current Team Member Image"
                  className="w-32 h-32 object-cover rounded"
                />
                <p className="text-xs text-gray-500">Current Image</p>
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
