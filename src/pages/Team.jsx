/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { AccordionCard, GoTo, LoadingSpinner, AdminMetaControls } from "@/components/"; // Added AdminMetaControls
import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import { HashLink } from "react-router-hash-link";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";

export const Team = () => {
  const { isAdmin } = useAdmin();
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true); // For team members
  const [error, setError] = useState(null); // For team members
  const [profData, setProfData] = useState(null);
  const [profLoading, setProfLoading] = useState(true);
  const [profError, setProfError] = useState(null);

  // --- Overall Team Page Meta ---
  const [teamPageMeta, setTeamPageMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState(null);
  const [refreshMetaKey, setRefreshMetaKey] = useState(0);

  const defaultTeamPageMeta = useMemo(
    () => ({
      title: "Our Team",
      description: "Meet the talented individuals driving innovation at our lab.", // This is a default, can be empty if not used.
    }),
    []
  );

  const fetchTeamPageMeta = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/team`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Team page meta not found, using defaults.");
          setTeamPageMeta(defaultTeamPageMeta);
          document.title = defaultTeamPageMeta.title + " - I&I Design Lab";
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setTeamPageMeta(data);
        document.title = (data.title || defaultTeamPageMeta.title) + " - I&I Design Lab";
      }
    } catch (err) {
      setMetaError(err.message);
      setTeamPageMeta(defaultTeamPageMeta);
      document.title = defaultTeamPageMeta.title + " - I&I Design Lab";
      console.error("Failed to fetch team page meta:", err);
    } finally {
      setMetaLoading(false);
    }
  }, [defaultTeamPageMeta]);

  useEffect(() => {
    fetchTeamPageMeta();
  }, [fetchTeamPageMeta, refreshMetaKey]);
  const handleTeamPageMetaUpdated = () => setRefreshMetaKey((prev) => prev + 1);

  // --- Current Team Section Meta ---
  const [currentTeamMeta, setCurrentTeamMeta] = useState(null);
  const [currentMetaLoading, setCurrentMetaLoading] = useState(true);
  const [currentMetaError, setCurrentMetaError] = useState(null);
  const [refreshCurrentMetaKey, setRefreshCurrentMetaKey] = useState(0);

  const defaultCurrentTeamMeta = useMemo(
    () => ({
      title: "Current Team",
      description:
        "Our lab is a vibrant hub of international and Korean researchers from diverse backgrounds, creating a dynamic and inclusive environment. Working here is not just productive but also a lot of fun, thanks to our enthusiastic and collaborative team!",
    }),
    []
  );

  const fetchCurrentTeamMeta = useCallback(async () => {
    setCurrentMetaLoading(true);
    setCurrentMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/team-current`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Current Team meta not found, using defaults.");
          setCurrentTeamMeta(defaultCurrentTeamMeta);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setCurrentTeamMeta(data);
      }
    } catch (err) {
      setCurrentMetaError(err.message);
      setCurrentTeamMeta(defaultCurrentTeamMeta);
      console.error("Failed to fetch current team meta:", err);
    } finally {
      setCurrentMetaLoading(false);
    }
  }, [defaultCurrentTeamMeta]);

  useEffect(() => {
    fetchCurrentTeamMeta();
  }, [fetchCurrentTeamMeta, refreshCurrentMetaKey]);
  const handleCurrentTeamMetaUpdated = () => setRefreshCurrentMetaKey((prev) => prev + 1);

  // --- Alumni Section Meta ---
  const [alumniMeta, setAlumniMeta] = useState(null);
  const [alumniMetaLoading, setAlumniMetaLoading] = useState(true);
  const [alumniMetaError, setAlumniMetaError] = useState(null);
  const [refreshAlumniMetaKey, setRefreshAlumniMetaKey] = useState(0);

  const defaultAlumniMeta = useMemo(
    () => ({
      title: "Alumni",
      description:
        "Celebrating the achievements and contributions of our esteemed alumni who continue to make an impact worldwide.",
    }),
    []
  );

  const fetchAlumniMeta = useCallback(async () => {
    setAlumniMetaLoading(true);
    setAlumniMetaError(null);
    try {
      const response = await fetch(`${BASE_URL}/meta/team-alumni`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Alumni meta not found, using defaults.");
          setAlumniMeta(defaultAlumniMeta);
        } else throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setAlumniMeta(data);
      }
    } catch (err) {
      setAlumniMetaError(err.message);
      setAlumniMeta(defaultAlumniMeta);
      console.error("Failed to fetch alumni meta:", err);
    } finally {
      setAlumniMetaLoading(false);
    }
  }, [defaultAlumniMeta]);

  useEffect(() => {
    fetchAlumniMeta();
  }, [fetchAlumniMeta, refreshAlumniMetaKey]);
  const handleAlumniMetaUpdated = () => setRefreshAlumniMetaKey((prev) => prev + 1);

  // Fetching Team Members and Professor Data
  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/team`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setTeamData(await response.json());
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch team data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfData = useCallback(async () => {
    setProfLoading(true);
    setProfError(null);
    try {
      const response = await fetch(`${BASE_URL}/prof`);
      if (!response.ok) {
        // If professor not found, don't throw error, just setProfData to null
        if (response.status === 404) {
          setProfData(null);
          console.warn("Professor data not found (404). Admin can create it.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        setProfData(await response.json());
      }
    } catch (err) {
      setProfError(err.message);
      console.error("Failed to fetch professor data:", err);
    } finally {
      setProfLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);
  useEffect(() => {
    fetchProfData();
  }, [fetchProfData]);

  const currentTeamMembers = teamData.filter((member) => member.type !== "alumni");
  const alumniMembers = teamData.filter((member) => member.type === "alumni");

  // Meta values for rendering
  const currentTeamPageTitle = teamPageMeta?.title || defaultTeamPageMeta.title;
  // const currentTeamPageDescription = teamPageMeta?.description || defaultTeamPageMeta.description;

  const currentTeamSectionTitle = currentTeamMeta?.title || defaultCurrentTeamMeta.title;
  const currentTeamSectionDesc = currentTeamMeta?.description || defaultCurrentTeamMeta.description;

  const alumniSectionTitle = alumniMeta?.title || defaultAlumniMeta.title;
  const alumniSectionDesc = alumniMeta?.description || defaultAlumniMeta.description;

  return (
    <div className="flex flex-col justify-start items-center px-4 sm:px-[25px] pt-[95px] w-full">
      {" "}
      {/* Added responsive padding */}
      {/* Overall Team Page Meta Controls */}
      {isAdmin && teamPageMeta && (
        <AdminMetaControls
          pageIdentifier="team"
          initialData={teamPageMeta}
          fieldsConfig={[
            { name: "title", label: "Team Page Title (Document Title)", type: "text" },
            // Optional: { name: "description", label: "Team Page Overall Description", type: "textarea" },
          ]}
          onUpdateSuccess={handleTeamPageMetaUpdated}
          containerClass="w-full max-w-screen-xl mx-auto py-2 bg-gray-50 rounded-b-lg shadow mb-6"
        />
      )}
      {metaLoading && (
        <div className="text-center py-6">
          <LoadingSpinner message="Loading page details..." />
        </div>
      )}
      {metaError && (
        <div className="text-red-500 text-center p-4">Error loading page details: {metaError}</div>
      )}
      {/* Professor Section */}
      {isAdmin && ( // Conditionally render AdminProfessorControls based on isAdmin, not profData
        <AdminProfessorControls professor={profData} refreshData={fetchProfData} />
      )}
      <TeamProf prof={profData} loading={profLoading} error={profError} />
      {/* Admin controls for team members */}
      {isAdmin && <AdminTeamControls refreshData={fetchTeamData} />}
      {/* --- Current Team Section --- */}
      <div className="w-full max-w-screen-xl mx-auto">
        {" "}
        {/* Added max-width container */}
        {isAdmin && currentTeamMeta && (
          <AdminMetaControls
            pageIdentifier="team-current"
            initialData={currentTeamMeta}
            fieldsConfig={[
              { name: "title", label: "Current Team Section Title", type: "text" },
              { name: "description", label: "Current Team Section Introduction", type: "textarea" },
            ]}
            onUpdateSuccess={handleCurrentTeamMetaUpdated}
            containerClass="py-2 bg-gray-100 rounded-lg shadow my-4"
          />
        )}
        {currentMetaLoading && (
          <div className="text-center py-6">
            <LoadingSpinner message="Loading current team intro..." />
          </div>
        )}
        {currentMetaError && (
          <div className="text-red-500 text-center p-4">
            Error loading current team intro: {currentMetaError}
          </div>
        )}
        {(!currentMetaLoading || currentTeamMeta) && (
          <CurrentTeam
            members={currentTeamMembers}
            loading={loading}
            error={error}
            introTitle={currentTeamSectionTitle}
            introDescription={currentTeamSectionDesc}
          />
        )}
      </div>
      {/* --- Alumni Section --- */}
      <div className="w-full max-w-screen-xl mx-auto">
        {" "}
        {/* Added max-width container */}
        {isAdmin && alumniMeta && (
          <AdminMetaControls
            pageIdentifier="team-alumni"
            initialData={alumniMeta}
            fieldsConfig={[
              { name: "title", label: "Alumni Section Title", type: "text" },
              { name: "description", label: "Alumni Section Introduction", type: "textarea" },
            ]}
            onUpdateSuccess={handleAlumniMetaUpdated}
            containerClass="py-2 bg-gray-100 rounded-lg shadow my-4"
          />
        )}
        {alumniMetaLoading && (
          <div className="text-center py-6">
            <LoadingSpinner message="Loading alumni intro..." />
          </div>
        )}
        {alumniMetaError && (
          <div className="text-red-500 text-center p-4">
            Error loading alumni intro: {alumniMetaError}
          </div>
        )}
        {(!alumniMetaLoading || alumniMeta) && (
          <Alumni
            members={alumniMembers}
            loading={loading}
            error={error}
            introTitle={alumniSectionTitle}
            introDescription={alumniSectionDesc}
          />
        )}
      </div>
    </div>
  );
};

export default Team;

const TeamProf = ({ prof, loading, error }) => {
  if (loading)
    return (
      <div className="text-center py-10">
        <LoadingSpinner message="Loading Professor..." />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Error loading Professor: {error}</div>;
  if (!prof)
    return (
      <div className="text-gray-500 text-center p-4">
        Professor data not available. Admin can add it.
      </div>
    );

  return (
    <div className="flex flex-col gap-[30px] my-[30px] w-full max-w-screen-xl mx-auto sm:grid sm:grid-cols-2 sm:grid-rows-auto sm:gap-5 items-center">
      {" "}
      {/* Added max-width, items-center */}
      <div
        className="rounded-[30px] w-full h-[300px] sm:h-[360px] md:w-96 md:h-96 mx-auto sm:col-start-2 sm:row-start-1 sm:row-span-2 bg-gray-200"
        style={{
          backgroundImage: `url(${prof.img || "/img/placeholder.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="img"
        aria-label={`Image of ${prof.name}`}
      ></div>
      <div className="flex flex-col gap-[5px] w-full sm:row-start-1 sm:col-start-1">
        <h2 className="font-bold text-lg sm:text-[20px] text-primary_main">{prof.role}</h2>
        <h1 className="font-bold text-3xl sm:text-[36px] text-text_black_primary leading-tight sm:leading-[36px]">
          {prof.name}
        </h1>
        <h3 className="text-sm sm:text-[12px] text-text_black_secondary max-w-lg">{prof.desc}</h3>{" "}
        {/* Added max-width */}
      </div>
      <div className="flex flex-col gap-[10px] font-semibold text-base sm:text-[18px] sm:flex-row sm:w-auto sm:col-start-1 sm:row-start-2">
        {" "}
        {/* Adjusted width for buttons */}
        <HashLink
          className="flex justify-center items-center gap-[10px] border-2 border-primary_main bg-primary_main border-solid rounded-[15px] w-full sm:w-auto px-6 h-[50px] text-text_white_primary hover:bg-primary_dark transition-colors"
          to="/prof" // Assuming this is the CV page route for the professor
        >
          CV <Up_right_neutral_arrow className="size-4" />
        </HashLink>
        <a
          className="flex justify-center items-center border-2 border-primary_main border-solid rounded-[15px] w-full sm:w-auto px-6 h-[50px] text-primary_main hover:bg-primary_light transition-colors"
          href={`mailto:${prof.email || "kmyung@unist.ac.kr"}`} // Use professor's email if available
        >
          Contact
        </a>
      </div>
    </div>
  );
};

const CurrentTeam = ({ members, loading, error, introTitle, introDescription }) => {
  const [selected, setSelected] = useState("All");
  const [derivedRoles, setDerivedRoles] = useState(["All"]);

  useEffect(() => {
    if (members.length > 0) {
      const uniqueRoles = [...new Set(members.map((member) => member.role))].sort();
      setDerivedRoles(["All", ...uniqueRoles]);
    } else {
      setDerivedRoles(["All"]);
    }
  }, [members]);

  if (loading && !members.length)
    return (
      <div className="text-center py-10">
        <LoadingSpinner message="Loading Current Team..." />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Error loading Current Team: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-4xl sm:text-5xl text-text_black_primary">
            {introTitle}
          </h2>
          <Down_left_dark_arrow className="size-12 sm:size-14" style={{ strokeWidth: 1 }} />
        </div>
        {introDescription && (
          <h3 className="text-sm text-text_black_secondary max-w-3xl">{introDescription}</h3>
        )}
      </div>
      {members.length > 0 && derivedRoles.length > 1 && (
        <div className="flex gap-2 sm:gap-[10px] flex-wrap">
          {" "}
          {/* Added flex-wrap */}
          {derivedRoles.map((role) => (
            <button
              className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full px-3 sm:px-4 h-[30px] text-xs sm:text-sm transition-colors ${
                role === selected
                  ? "bg-primary_main text-text_white_primary"
                  : "text-primary_main hover:bg-primary_light"
              }`}
              key={role}
              onClick={() => setSelected(role)}
            >
              {role}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[10px]">
        {" "}
        {/* Changed to grid and gap */}
        {members.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500 py-6">
            No current team members found.
          </p>
        )}
        {members
          .filter((elem) => (selected === "All" ? true : elem.role === selected))
          .map((member) => (
            <AccordionCard
              key={member._id}
              title={member.name}
              subtitle={member.role}
              bg={member.img}
              desc={member.bio}
              linkedIn={member.linkedIn}
            />
          ))}
        {members.length > 0 &&
          members.filter((elem) => (selected === "All" ? true : elem.role === selected)).length ===
            0 && (
            <p className="col-span-full text-center text-gray-500 py-6">
              No members found for filter: {selected}
            </p>
          )}
      </div>
    </div>
  );
};

const Alumni = ({ members, loading, error, introTitle, introDescription }) => {
  const [selected, setSelected] = useState("All");
  const [derivedRoles, setDerivedRoles] = useState(["All"]);

  useEffect(() => {
    if (members.length > 0) {
      const uniqueRoles = [...new Set(members.map((member) => member.role))].sort();
      setDerivedRoles(["All", ...uniqueRoles]);
    } else {
      setDerivedRoles(["All"]);
    }
  }, [members]);

  if (loading && !members.length)
    return (
      <div className="text-center py-10">
        <LoadingSpinner message="Loading Alumni..." />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Error loading Alumni: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full" id="alumni">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-4xl sm:text-5xl text-text_black_primary">
            {introTitle}
          </h2>
          <Down_left_dark_arrow className="size-10 sm:size-12" style={{ strokeWidth: 1 }} />
        </div>
        {introDescription && (
          <h3 className="text-sm text-text_black_secondary max-w-3xl">{introDescription}</h3>
        )}
      </div>
      {members.length > 0 && derivedRoles.length > 1 && (
        <div className="flex gap-2 sm:gap-[10px] flex-wrap">
          {derivedRoles.map((role) => (
            <button
              className={`place-content-center border-2 border-primary_main grid active:bg-primary_main border-solid rounded-full px-3 sm:px-4 h-[30px] text-xs sm:text-sm transition-colors  ${
                role === selected
                  ? "bg-primary_main text-text_white_primary"
                  : "text-primary_main hover:bg-primary_light"
              }`}
              key={role}
              onClick={() => setSelected(role)}
            >
              {role}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[10px]">
        {members.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500 py-6">No alumni members found.</p>
        )}
        {members
          .filter((elem) => (selected === "All" ? true : elem.role === selected))
          .map((member) => (
            <AccordionCard
              key={member._id}
              title={member.name}
              subtitle={member.role}
              bg={member.img}
              desc={member.bio}
              linkedIn={member.linkedIn}
            />
          ))}
        {members.length > 0 &&
          members.filter((elem) => (selected === "All" ? true : elem.role === selected)).length ===
            0 && (
            <p className="col-span-full text-center text-gray-500 py-6">
              No alumni found for filter: {selected}
            </p>
          )}
      </div>
      {/* Consider if "View All Alumni" button is needed or if this section shows all by default */}
    </div>
  );
};

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

  const roles = [
    "PhD",
    "Masters",
    "Researcher",
    "Intern",
    "Undergraduate Researcher",
    "Visiting Researcher",
    "Research Professor",
  ];

  const fetchAdminTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/team`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMembers(data.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Failed to fetch team members for admin:", err);
    }
  }, []);

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
          headers: { Authorization: `Bearer ${adminToken}` },
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImageUrl(data[0]);
        } else {
          const errorData = await response.json();
          alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
          setUploadedImageUrl(editingMember?.img || "");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred during image upload.");
        setUploadedImageUrl(editingMember?.img || "");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setUploadedImageUrl(editingMember?.img || ""); // Keep existing if no new file
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewRole("");
    setNewType("current");
    setNewBio("");
    setNewLinkedIn("");
    setSelectedFile(null);
    setUploadedImageUrl("");
  };

  const handleCreate = async () => {
    if (!newName || !newRole || !newType || !uploadedImageUrl) {
      alert("Name, Role, Type, and Image are required.");
      return;
    }
    setIsSubmitting(true);
    const newMember = {
      name: newName,
      role: newRole,
      type: newType,
      bio: newBio,
      img: uploadedImageUrl,
      linkedIn: newLinkedIn,
    };
    try {
      const response = await fetch(`${BASE_URL}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(newMember),
      });
      if (response.ok) {
        setIsCreating(false);
        resetForm();
        await fetchAdminTeamMembers();
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(`Failed to create team member: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error creating team member:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setIsCreating(false);
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
    if (!editingMember || !newName || !newRole || !newType || !uploadedImageUrl) {
      alert("Name, Role, Type, and Image are required for update.");
      return;
    }
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(updatedMember),
      });
      if (response.ok) {
        setIsEditing(false);
        setEditingMember(null);
        resetForm();
        await fetchAdminTeamMembers();
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(`Failed to update team member: ${errorData?.message || "An error occurred"}`);
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      alert("Error: " + error.message);
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
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (response.ok) {
          await fetchAdminTeamMembers();
          await refreshData();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete team member: ${errorData?.message || "An error occurred"}`);
        }
      } catch (error) {
        console.error("Error deleting team member:", error);
        alert("Error: " + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const inputClass =
    "w-full p-2 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100";
  const selectClass = `${inputClass} appearance-none`;
  const buttonClass =
    "font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50";
  const primaryButtonClass = `bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`;
  const secondaryButtonClass = `bg-gray-200 hover:bg-gray-300 text-gray-700 ${buttonClass}`;
  const dangerButtonClass = `bg-red-600 hover:bg-red-700 text-white ${buttonClass} text-xs px-3 py-1.5`;
  const warningButtonClass = `bg-yellow-500 hover:bg-yellow-600 text-white ${buttonClass} text-xs px-3 py-1.5`;
  const successButtonClass = `bg-green-600 hover:bg-green-700 text-white ${buttonClass}`;

  if (loading && !members.length)
    return (
      <div className="text-center py-6">
        <LoadingSpinner message="Loading Team Members for Admin..." />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center p-4">
        Error loading Team Members for Admin: {error}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-lg w-full bg-gray-50 mb-8 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Admin: Manage Team Members
        </h3>
        {!isCreating && !isEditing && (
          <button
            onClick={() => {
              setIsCreating(true);
              resetForm();
            }}
            className={successButtonClass}
            disabled={isSubmitting || deletingId !== null}
          >
            + Add New Member
          </button>
        )}
      </div>

      {(isSubmitting || deletingId !== null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingSpinner
            message={
              deletingId
                ? "Deleting..."
                : isSubmitting
                ? isCreating
                  ? "Creating..."
                  : "Updating..."
                : "Processing..."
            }
          />
        </div>
      )}

      {!isCreating && !isEditing && (
        <div className="w-full space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {members.map((member) => (
            <div
              key={member._id}
              className="border border-gray-200 rounded-md p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 flex-grow min-w-0">
                <img
                  src={member.img || "/img/placeholder.png"}
                  alt={member.name}
                  className="w-12 h-12 object-cover rounded-full border border-gray-100"
                />
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-gray-800 truncate" title={member.name}>
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {member.role} - <span className="capitalize">{member.type}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-end md:self-center mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(member)}
                  className={warningButtonClass}
                  disabled={isSubmitting || deletingId !== null}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className={`${dangerButtonClass} ${
                    deletingId === member._id ? "opacity-50 cursor-wait" : ""
                  }`}
                  disabled={isSubmitting || deletingId === member._id}
                >
                  {deletingId === member._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-gray-500 italic text-center py-4">No team members found.</p>
          )}
        </div>
      )}

      {(isCreating || isEditing) && (
        <div className="p-4 border border-gray-200 rounded-md mt-4 bg-white shadow-sm space-y-4">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            {isCreating ? "Create New Team Member" : `Editing: ${editingMember?.name}`}
          </h4>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />
          <div>
            <label htmlFor="role-select" className="block text-gray-700 text-sm font-bold mb-1">
              Role
            </label>
            <select
              id="role-select"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className={selectClass}
              disabled={isSubmitting}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type-select" className="block text-gray-700 text-sm font-bold mb-1">
              Type (Current/Alumni)
            </label>
            <select
              id="type-select"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className={selectClass}
              disabled={isSubmitting}
            >
              <option value="current">Current</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <textarea
            id="bio-text"
            placeholder="Bio (optional, Markdown supported)"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className={`${inputClass} h-24`}
            rows="3"
            disabled={isSubmitting}
          />
          <input
            type="url"
            placeholder="LinkedIn URL (optional)"
            value={newLinkedIn}
            onChange={(e) => setNewLinkedIn(e.target.value)}
            className={inputClass}
            disabled={isSubmitting}
          />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="image-upload">
              {isEditing && editingMember?.img ? "Replace Image (Optional)" : "Image"}
            </label>
            <input
              type="file"
              id="image-upload"
              onChange={handleFileChange}
              className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
              disabled={isSubmitting}
            />
            {uploadedImageUrl && ( // Show preview if uploadedImageUrl is set (either from new upload or existing)
              <div className="mt-2">
                <img
                  src={uploadedImageUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded border border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedFile ? `New: ${selectedFile.name}` : "Current/Uploaded Image"}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={isCreating ? handleCreate : handleUpdate}
              className={primaryButtonClass}
              disabled={
                isSubmitting ||
                (!isEditing && !uploadedImageUrl && !selectedFile) ||
                (isEditing && !uploadedImageUrl)
              }
            >
              {isSubmitting
                ? isCreating
                  ? "Creating..."
                  : "Updating..."
                : isCreating
                ? "Create"
                : "Update"}
            </button>
            <button
              onClick={() => {
                isCreating ? setIsCreating(false) : setIsEditing(false);
                resetForm();
              }}
              className={secondaryButtonClass}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminProfessorControls = ({ professor, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(!professor);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [email, setEmail] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { adminToken } = useAdmin();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (professor) {
      setName(professor.name || "");
      setRole(professor.role || "");
      setDesc(professor.desc || "");
      setCvLink(professor.cvLink || "");
      setEmail(professor.email || "");
      setUploadedImageUrl(professor.img || "");
      setIsCreating(false);
      setIsEditing(false);
    } else {
      setName("");
      setRole("");
      setDesc("");
      setCvLink("");
      setEmail("");
      setUploadedImageUrl("");
      setIsCreating(true);
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
          headers: { Authorization: `Bearer ${adminToken}` },
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setUploadedImageUrl(data[0]);
        } else {
          const errorData = await response.json();
          alert(`Image upload failed: ${errorData?.message || "An error occurred"}`);
          setUploadedImageUrl(professor?.img || "");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred during image upload.");
        setUploadedImageUrl(professor?.img || "");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setUploadedImageUrl(professor?.img || "");
    }
  };

  const resetFormAndState = () => {
    setName("");
    setRole("");
    setDesc("");
    setCvLink("");
    setEmail("");
    setSelectedFile(null);
    setUploadedImageUrl("");
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCreateOrUpdate = async () => {
    if (!name || !role || !uploadedImageUrl) {
      alert("Name, Role, and Image are required.");
      return;
    }
    setIsSubmitting(true);
    const professorData = { name, role, img: uploadedImageUrl, desc, cvLink, email };

    // Determine if we are creating a new professor or updating an existing one
    // If 'professor' prop is null or doesn't have an _id, it's a create operation
    const isCreateOperation = !professor || !professor._id || isCreating;
    const url = isCreateOperation ? `${BASE_URL}/prof` : `${BASE_URL}/prof/${professor._id}`;
    const method = isCreateOperation ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify(professorData),
      });
      if (response.ok) {
        await refreshData();
        setIsCreating(false);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to ${isCreateOperation ? "create" : "update"} professor: ${
            errorData?.message || "An error occurred"
          }`
        );
      }
    } catch (error) {
      console.error(`Error ${isCreateOperation ? "creating" : "updating"} professor:`, error);
      alert(`An error occurred. Check console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!professor || !professor._id) {
      alert("No professor selected or professor ID is missing.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the professor's information?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`${BASE_URL}/prof/${professor._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (response.ok) {
          await refreshData();
          resetFormAndState();
          setIsCreating(true);
        } else {
          const errorData = await response.json();
          alert(`Failed to delete professor: ${errorData?.message || "An error occurred"}`);
        }
      } catch (error) {
        console.error("Error deleting professor:", error);
        alert("An error occurred during deletion. Check console.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const inputClass =
    "w-full p-2 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100";
  const buttonClass =
    "font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50";
  const primaryButtonClass = `bg-blue-600 hover:bg-blue-700 text-white ${buttonClass}`;
  const secondaryButtonClass = `bg-gray-200 hover:bg-gray-300 text-gray-700 ${buttonClass}`;
  const dangerButtonClass = `bg-red-600 hover:bg-red-700 text-white ${buttonClass}`;
  const successButtonClass = `bg-green-600 hover:bg-green-700 text-white ${buttonClass}`;
  const warningButtonClass = `bg-yellow-500 hover:bg-yellow-600 text-white ${buttonClass}`;

  const renderForm = () => (
    <div className="mt-4 space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        disabled={isSubmitting}
      />
      <input
        type="text"
        placeholder="Role (e.g., Professor, Head of Lab)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className={inputClass}
        disabled={isSubmitting}
      />
      <textarea
        placeholder="Description / Short Bio"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className={`${inputClass} h-24`}
        rows="3"
        disabled={isSubmitting}
      />
      <input
        type="url"
        placeholder="CV Link (e.g., https://...)"
        value={cvLink}
        onChange={(e) => setCvLink(e.target.value)}
        className={inputClass}
        disabled={isSubmitting}
      />
      <input
        type="email"
        placeholder="Contact Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
        disabled={isSubmitting}
      />
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="prof-image-upload">
          Professor Image {isEditing || professor?.img ? "(Upload new to replace)" : ""}
        </label>
        <input
          type="file"
          id="prof-image-upload"
          onChange={handleFileChange}
          className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          disabled={isSubmitting}
        />
        {uploadedImageUrl && (
          <div className="mt-2">
            <img
              src={uploadedImageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedFile ? `New: ${selectedFile.name}` : "Current Image"}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleCreateOrUpdate}
          className={isCreating || !professor?._id ? successButtonClass : primaryButtonClass}
          disabled={isSubmitting || !uploadedImageUrl}
        >
          {isSubmitting
            ? isCreating || !professor?._id
              ? "Creating..."
              : "Updating..."
            : isCreating || !professor?._id
            ? "Create Professor Info"
            : "Update Professor Info"}
        </button>
        {(isCreating || isEditing) && (
          <button
            onClick={() => {
              if (isCreating) {
                resetFormAndState();
                if (!professor) setIsCreating(true);
              } // If was creating and no prof, stay in create
              else {
                setIsEditing(
                  false
                ); /* useEffect will repopulate form from professor prop if it exists */
              }
            }}
            className={secondaryButtonClass}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 mb-8 border border-gray-200 rounded-lg shadow-lg w-full bg-gray-50 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Admin: Manage Professor Info
        </h3>
        {/* Show Edit/Delete only if professor data exists and not in create/edit mode */}
        {professor && !isEditing && !isCreating && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} className={warningButtonClass}>
              Edit
            </button>
            <button onClick={handleDelete} className={dangerButtonClass} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {(isSubmitting || isDeleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingSpinner
            message={
              isDeleting
                ? "Deleting Professor..."
                : isSubmitting
                ? isCreating || !professor?._id
                  ? "Creating..."
                  : "Updating..."
                : "Processing..."
            }
          />
        </div>
      )}

      {/* Render form if creating or editing. If no professor and not creating, show prompt to create. */}
      {isCreating || isEditing
        ? renderForm()
        : !professor && ( // Only show "Add Professor" button if no professor exists and not in create/edit mode
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No professor information found.</p>
              <button onClick={() => setIsCreating(true)} className={successButtonClass}>
                + Add Professor Info
              </button>
            </div>
          )}
    </div>
  );
};
