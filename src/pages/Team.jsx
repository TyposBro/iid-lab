import { Down_left_dark_arrow, Up_right_neutral_arrow } from "@/assets/";
import { AccordionCard, GoTo } from "@/components/";
import { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";

export const Team = () => {
  return (
    <div className="flex flex-col justify-start items-center px-[25px] pt-[95px] w-full h-dvh overflow-y-scroll">
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
        const response = await fetch("/api/professor");
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
        const response = await fetch("/api/team/members/current");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMembers(data);
        setDerivedRoles(["All", ...new Set(data.map((member) => member.role))]);
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
        const response = await fetch("/api/team/members/alumni");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMembers(data);
        setDerivedRoles(["All", ...new Set(data.map((member) => member.role))]);
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
