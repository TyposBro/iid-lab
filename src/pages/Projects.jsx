import {
  Down_left_dark_arrow,
  Down_straight_neutral_arrow,
  Up_right_neutral_arrow,
} from "@/assets/";
import { Card, GoTo } from "@/components/";
import { useState, useEffect } from "react";

export const Projects = () => {
  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full h-dvh overflow-y-scroll">
      <div className="flex flex-col gap-[10px] px-[25px]">
        <h2 className="font-bold text-[48px] text-black leading-[48px]">Projects</h2>
        <div className="border-text_black_secondary text-[12px]">
          We create innovative design concepts using systematic, human-centered methods and develop
          them into products and services through engineering design. Our focus is on elderly care,
          rehabilitation, healthcare, and safety, collaborating with experts in medicine,
          geriatrics, physical therapy, materials, and production.
        </div>
      </div>

      <Current />
      <Completed />
      <Awards />
      {window.innerWidth <= 640 ? (
        <GoTo title="Projects Gallery" link="/gallery" />
      ) : (
        <div className="sm:w-full sm:items-center sm:flex sm:justify-between">
          <GoTo title="Team members" link="/team" />
          <GoTo title="Publications" link="/publications" />
        </div>
      )}
    </div>
  );
};

export default Projects;

const Current = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentProjects = async () => {
      try {
        const response = await fetch("/api/projects/current");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCurrentProjects();
  }, []);

  if (loading) return <div>Loading Current Projects...</div>;
  if (error) return <div>Error loading Current Projects: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] px-[25px] py-[30px] w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-light text-[48px] text-text_black_primary leading-[48px]">
          Current Projects
        </h2>
        <Down_left_dark_arrow className="size-[58px]" />
      </div>

      <div className="flex flex-col items-center gap-[10px]">
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            subtitle={project.subtitle}
            bg={project.img}
            desc={project.desc}
            action={project.action}
          />
        ))}
      </div>
    </div>
  );
};

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch("/api/projects/awards");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAwards(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  if (loading) return <div>Loading Awards...</div>;
  if (error) return <div>Error loading Awards: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] bg-primary_main py-[30px] w-full">
      <div className="flex flex-col gap-[25px] px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-light text-[48px]  leading-[48px]">Awards</h2>
          <Down_straight_neutral_arrow className=" rotate-45 size-[46px]" />
        </div>
        <div className="flex gap-[12px] font-medium text-base ">
          <button className="border-2 px-[24px] py-[8px] rounded-full">Reddot</button>
          <button className="border-2 px-[24px] py-[8px] rounded-full">iF</button>
          <button className="border-2 px-[24px] py-[8px] rounded-full">Others</button>
        </div>
      </div>

      <div className="flex gap-[15px] px-[25px] w-full overflow-x-auto">
        {awards.map((award) => (
          <div
            key={award.title}
            className="flex flex-col gap-[12px] bg-white rounded-[20px] w-[300px] shrink-0 cursor-pointer"
          >
            <div
              className="relative bg-border_dark rounded-[20px] w-full h-[480px]"
              style={{
                backgroundImage: `url(${award.img})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />

            <div className="flex flex-col gap-[15px] px-[15px] pb-[5px]">
              <h2 className="font-bold text-[24px] text-text_black_primary">{award.title}</h2>
              <h3 className="text-border_dark font-light text-base">{award.authors}</h3>
              <h3 className="text-border_dark font-bold text-[12px]">{award.year}</h3>
            </div>
          </div>
        ))}
      </div>

      <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-bold text-lg">
        <span>View All Awards</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};

const Completed = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        const response = await fetch("/api/projects/completed");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompletedProjects();
  }, []);

  if (loading) return <div>Loading Completed Projects...</div>;
  if (error) return <div>Error loading Completed Projects: {error}</div>;

  return (
    <div className="flex flex-col gap-[30px] bg-text_black_primary py-[30px] w-full" id="completed">
      <div className="flex flex-col gap-[25px] px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-extralight text-[48px] text-white leading-[50px]">
            Completed Projects
          </h2>
          <Down_straight_neutral_arrow className="text-text_white_primary -rotate-45 size-[56px]" />
        </div>
        <div className="flex gap-[12px] border-white font-medium text-base text-white">
          <button className="border-2 px-[24px] py-[8px] border-white rounded-full">Recent</button>
          <button className="border-2 px-[24px] py-[8px] border-white rounded-full">2024</button>
          <button className="border-2 px-[24px] py-[8px] border-white rounded-full">2023</button>
        </div>
      </div>

      <div className="flex flex-col gap-[15px] px-[25px] w-full overflow-x-auto sm:grid sm:grid-cols-3 ">
        {projects.map((project) => (
          <div key={project.title} className="relative w-full cursor-pointer">
            <div
              className="relative bg-border_dark rounded-[20px] w-full h-[260px]"
              style={{
                background: `url(${project.img})`,
                backgroundSize: "100% 100%",
              }}
            >
              {/* Dark Overlay */}
              <div
                className="absolute inset-0 bg-black rounded-[20px]"
                style={{ background: "linear-gradient(180deg, #32323200 20%, #323232AA 100%)" }}
              ></div>
              {/* Dark Overlay */}
              <div className="bottom-[20px] absolute flex justify-between items-center px-[20px] w-full">
                <div>
                  <h2 className="font-bold text-[24px] text-text_white_primary">{project.title}</h2>
                  <h3 className="text-[12px] text-text_white_secondary">{project.desc}</h3>
                  <h3 className="text-[12px] text-text_white_secondary">{project.year}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="flex justify-center items-center gap-[10px] rounded-[15px] h-[50px] font-semibold text-[18px] text-text_white_primary">
        <span>View All Completed Projects</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};
