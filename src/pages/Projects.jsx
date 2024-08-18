import PropTypes from "prop-types";
import { Down_left_dark_arrow, Down_straight_neutral_arrow, Up_right_neutral_arrow } from "assets/";
import { Card } from "components/";

export const Projects = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll px-[25px] pt-[95px]">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-black font-bold text-[48px] leading-[48px] font-special">Projects</h2>
        <div className="border-text_black_secondary  text-[12px] font-normal font-regular">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate laborum minus
          laboriosam! Optio eaque nemo sit corrupti excepturi quisquam consequatur ab maiores! Sit
          atque, dolor minus sed aspernatur dolorem alias.
        </div>
      </div>

      <Current />
      <Awards />
      <Completed />
      <div className="flex flex-col gap-[50px] py-[50px]">
        <GoTo title="Team members" link={() => console.log("/team")} />
        <GoTo title="Journal publications" link={() => console.log("/publications")} />
      </div>
    </div>
  );
};

export default Projects;

const Current = () => {
  const projects = [
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      title: "Lemmy - AI Based Robot",
      subtitle: "Description goes here upto two lines max",
    },
    {
      img: "/img/projects/lg_hower_gym.png",
      title: "LG Hover Gym",
      subtitle: "Description goes here upto two lines max",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      title: "Military Sleeping Bag",
      subtitle: "Description goes here upto two lines max",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      title: "Military backpack",
      subtitle: "Description goes here upto two lines max",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] ">
      <div className="flex items-center">
        <h2 className="text-text_black_primary font-light text-[48px] leading-[48px] font-special">
          Current Projects
        </h2>
        <Down_left_dark_arrow className="size-[58px]" />
      </div>

      <div className="flex flex-col gap-[10px] items-center">
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            subtitle={project.subtitle}
            bg={project.img}
          />
        ))}
      </div>
    </div>
  );
};

const Awards = () => {
  const awards = [
    {
      title: "iF Design Award - XYZ Project",
      year: 2023,
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "iF Design Award - XYZ Project",
      year: 2021,
      img: "/img/projects/lg_hower_gym.png",
    },
    {
      title: "iF Design Award - XYZ Project",
      year: 2021,
      img: "/img/projects/military_sleeping_bag.png",
    },
    {
      title: "iF Design Award - XYZ Project",
      year: 2021,
      img: "/img/projects/lemmy_ai_based_robot.png",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] bg-black ">
      <div className="flex flex-col gap-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="text-text_white_primary font-extralight text-[42px] leading-[48px] font-super_special">
            Awards
          </h2>
          <Down_straight_neutral_arrow className="size-[46px] rotate-45 text-primary_main" />
        </div>
        <div className="flex gap-[12px] text-primary_main text-[16px] font-medium font-regular">
          <button className="rounded-full px-[24px] py-[8px] border-2">Reddot</button>
          <button className="rounded-full px-[24px] py-[8px] border-2">iF</button>
          <button className="rounded-full px-[24px] py-[8px] border-2">Others</button>
        </div>
      </div>

      <div className="w-full flex gap-[15px] overflow-x-auto">
        {awards.map((award) => (
          <div
            key={award.title}
            className="w-[300px] flex flex-col gap-[12px] shrink-0 bg-white rounded-[20px] "
          >
            <div
              className="bg-border_dark w-full h-[570px] rounded-[20px]"
              style={{ backgroundImage: `url(${award.img})`, backgroundSize: "300px 570px" }}
            />
            <div className="flex flex-col gap-[15px] px-[15px] pb-[5px] ">
              <h2 className="text-text_black_primary font-bold text-[24px] font-special">
                {award.title}
              </h2>
              <h3 className="text-border_dark font-regular text-[12px] font-bold">{award.year}</h3>
            </div>
          </div>
        ))}
      </div>

      <button className="flex justify-center items-center gap-[10px] h-[50px] font-semibold font-regular text-[18px] text-primary_main rounded-[15px] ">
        <span>View All Awards</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};

const Completed = () => {
  const projects = [
    {
      title: "Project Name",
      desc: "Description goes here upto two lines max",
      year: 2023,
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "Project Name",
      desc: "Description goes here upto two lines max",
      year: 2023,
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "Project Name",
      desc: "Description goes here upto two lines max",
      year: 2023,
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "Project Name",
      desc: "Description goes here upto two lines max",
      year: 2023,
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "Project Name",
      desc: "Description goes here upto two lines max",
      year: 2023,
      img: "/img/projects/military_backpack.png",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] bg-primary_main ">
      <div className="flex flex-col gap-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="text-black font-extralight text-[42px] leading-[48px] font-super_special">
            Completed Projects
          </h2>
          <Down_straight_neutral_arrow className="size-[56px] -rotate-45 text-text_white_primary" />
        </div>
        <div className="flex gap-[12px] border-text_black_primary text-[16px] font-medium font-regular">
          <button className="rounded-full px-[24px] py-[8px] border-2 border-text_black_primary">
            Needs
          </button>
          <button className="rounded-full px-[24px] py-[8px] border-2 border-text_black_primary">
            Sorting
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-[15px] overflow-x-auto">
        {projects.map((project) => (
          <div key={project.title} className="w-full relative ">
            <div
              className="bg-border_dark w-full h-[260px] rounded-[20px] relative"
              style={{
                background: `url(${project.img})`,
                backgroundSize: "100% 100%",
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
              {/* Dark Overlay */}
              <div className="w-full flex justify-between items-center absolute bottom-[20px] px-[20px] ">
                <div>
                  <h2 className="text-text_white_primary font-bold text-[24px] font-special">
                    {project.title}
                  </h2>
                  <h3 className="text-text_white_secondary font-regular text-[12px] font-normal">
                    {project.desc}
                  </h3>
                  <h3 className="text-text_white_secondary font-regular text-[12px] font-normal">
                    {project.year}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="flex justify-center items-center gap-[10px] h-[50px] font-semibold font-regular text-[18px] text-text_white_primary rounded-[15px] ">
        <span>View All Completed Projects</span>
        <Up_right_neutral_arrow alt="up right light arrow icon" />
      </button>
    </div>
  );
};

const GoTo = ({ title, link }) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <h3 className="text-primary_main font-semibold font-regular text-[28px]">Go to..</h3>
      <div className="flex justify-between items-center">
        <h2
          className="text-text_black_primary font-special font-light text-[48px] leading-[64px]"
          onClick={link}
        >
          {title}
        </h2>
        <Down_straight_neutral_arrow className="size-[46px] -rotate-[135deg] text-primary_main" />
      </div>
    </div>
  );
};

GoTo.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
