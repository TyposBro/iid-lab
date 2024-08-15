import { Down_left_dark_arrow, Down_straight_neutral_arrow, Up_right_neutral_arrow } from "assets/";
import { Card } from "components/";

export const Projects = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll p-[25px] pt-[95px]">
      <Current />
      <Awards />
      <Awards />
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
      title: "Military Backpack",
      year: 2021,
      img: "/img/projects/military_backpack.png",
    },
    {
      title: "LG Hower Gym",
      year: 2021,
      img: "/img/projects/lg_hower_gym.png",
    },
    {
      title: "Military Sleeping Bag",
      year: 2021,
      img: "/img/projects/military_sleeping_bag.png",
    },
    {
      title: "Lemmy - AI Based Robot",
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
          <Down_straight_neutral_arrow className="size-[46px] rotate-45" />
        </div>
        <div className="flex gap-[12px] text-primary_main text-[16px] font-medium font-regular">
          <button className="rounded-full px-[24px] py-[8px] border-2 border-primary_main">
            Reddot
          </button>
          <button className="rounded-full px-[24px] py-[8px] border-2 border-primary_main">
            iF
          </button>
          <button className="rounded-full px-[24px] py-[8px] border-2 border-primary_main">
            Others
          </button>
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
            <div className="flex flex-col gap-[15px] px-[15px]">
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
