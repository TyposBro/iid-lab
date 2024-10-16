import { Down_left_dark_arrow, Down_straight_neutral_arrow, Up_right_neutral_arrow } from "assets/";
import { Card, GoTo } from "components/";

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
  const projects = [
    {
      img: "/img/projects/current/lemmy_ai_based_robot.png",
      title: "Lemmy - AI Based Robot",
      subtitle: "Elderly care robot-service system",
      desc: "Development of a robot-service system for elderly care, including a robot, a service platform, and a service model",
    },
    {
      img: "/img/projects/current/lg_hower_gym.png",
      title: "LG Hover Gym",
      subtitle: "Designing accessories for LG Hower Gym",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat,",
    },
    {
      img: "/img/projects/current/military_sleeping_bag.png",
      title: "Military Sleeping Bag",
      subtitle: "Military Backpack and Frame Design for effective Weight Distribution System ",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat,",
    },
    {
      img: "/img/projects/current/military_backpack.png",
      title: "Military backpack",
      subtitle: "Winter sleeping bag for Special Forces",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat,",
    },
  ];

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
  const awards = [
    {
      title: "iF Design Award - UMAY",
      year: 2022,
      img: "/img/projects/awards/umay.png",
      authors: "M. Gabbas, Y. Ismailov, KM Kim",
    },
    {
      title: "Best of the Best, RedDot - GOOPI",
      year: 2021,
      img: "/img/projects/awards/goopi.png",
      authors: "JH Park, M. Gabbas, YD Ryu, KM Kim",
    },
    {
      title: "iF Design Award - Wave Hat",
      year: 2021,
      img: "/img/projects/awards/wave_hat.png",
      authors: "SJ Joo, DB Lee, JY Lee, HM Choi, HJ Jin, SY Park, H KIM, KM Kim",
    },
    {
      title: "iF Design Award - Wave App",
      year: 2021,
      img: "/img/projects/awards/wave_app.png",
      authors: "SJ Joo, DB Lee, JY Lee, HM Choi, HJ Jin, SY Park, H KIM, KM Kim",
    },
    {
      title: "Good Design - Anybaro",
      year: 2019,
      img: "/img/projects/awards/anybaro.png",
      authors: "JH Yang, KM Kim",
    },
  ];

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
                // backgroundSize: "100% 100%",
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
  const projects = [
    {
      title: "Food Waste Disposer Accessibility Kit",
      desc: "Development of a kit to improve accessibility for installing food waste disposers and to check installation feasibility",
      year: "09/2023-03/2024",
      img: "/img/projects/completed/food_waste_disposer_accesibility_kit.png",
    },
    {
      title: "UMAY",
      desc: "Data-base Dysphagia rehabilitation training device and Gamified UI Design",
      year: "2020-2023",
      img: "/img/projects/completed/umay.png",
    },
  ];

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
