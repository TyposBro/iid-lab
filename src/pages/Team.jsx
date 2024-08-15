import { Down_left_dark_arrow, Up_right_neutral_arrow } from "assets/";
import { AccordionCard } from "components/";

export const Team = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll p-[25px] pt-[95px]">
      {/* <Intro /> */}
      <Prof />
      <CurrentTeam />
      <Alumni />
    </div>
  );
};

export default Team;

const Prof = () => {
  const prof = {
    img: "/img/people/director/prof_team.png",
    name: "Professor KwanMyung Kim",
    role: "Lab Director",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna porttitor rhoncus dolor purus non. Turpis massa sed elementum tempus egestas sed. Habitant morbi tristique senectus et netus et malesuada fames ac.",
  };

  return (
    <div className="my-[30px] w-full flex flex-col gap-[30px]">
      <div
        className="w-full h-[360px] rounded-[30px]"
        style={{ backgroundImage: `url(${prof.img})`, backgroundSize: "cover" }}
      ></div>
      <div className="w-full flex flex-col gap-[5px]">
        <h2 className="font-regular font-bold text-primary_main text-[20px]">{prof.role}</h2>
        <h1 className="font-super_special text-text_black_primary text-[36px] leading-[36px] font-bold">
          {prof.name}
        </h1>
        <h3 className="font-regular text-[12px] text-text_black_secondary">{prof.desc}</h3>
      </div>
      <div className="flex flex-col gap-[10px] font-semibold text-[18px] font-regular">
        <button className="w-full h-[50px] flex justify-center items-center gap-[10px] border-primary_main bg-primary_main rounded-[15px] border-2 border-solid text-text_white_primary">
          CV <Up_right_neutral_arrow />
        </button>
        <button className="w-full h-[50px]  border-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-primary_main ">
          Achievements
        </button>
      </div>
    </div>
  );
};

const CurrentTeam = () => {
  const members = [
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Haebin Lee",
      role: "PhD Candidate",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Ulugbek Ismatullaev",
      role: "PhD Candidate",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Daehun Lee",
      role: "PhD Candidate",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Danyal Sarfraz",
      role: "Masters",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Jounghyun Kim",
      role: "Masters",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Donierbek",
      role: "Masters",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] ">
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center">
          <h2 className="text-text_black_primary font-light text-[48px] leading-[48px] font-special">
            Current Team
          </h2>
          <Down_left_dark_arrow className="size-[58px]" />
        </div>
        <h3 className="text-text_black_secondary font-regular font-light text-[12px]">
          Our lab is a vibrant hub of international and Korean researchers from diverse backgrounds,
          creating a dynamic and inclusive environment. Working here is not just productive but also
          a lot of fun, thanks to our enthusiastic and collaborative team!
        </h3>
      </div>
      <div className="flex gap-[10px]">
        <button className="w-full h-[30px]  border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary ">
          PhD
        </button>
        <button className="w-full h-[30px]  border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary ">
          Masters
        </button>
        <button className="w-full h-[30px] border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary">
          Interns
        </button>
      </div>

      <div className="flex flex-col gap-[10px] items-center">
        {members.map((member) => (
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
  const members = [
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "JungSu",
      role: "Masters",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Tufail",
      role: "Masters",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
    {
      img: "/img/projects/lemmy_ai_based_robot.png",
      name: "Donierbek",
      role: "Undergraduate",
      bio: "Ulugbek Ismatullaev has completed his Master's degree in Industrial Engineering from Kumoh National Institute of Technology (KIT), Gumi, Korea. His research interests include Human Factors and Ergonomics, UX Design, and Product Design. He aims to improve Human-AI collaboration through considering Human Factors and Ergonomics challenges.",
    },
  ];

  return (
    <div className="w-dvw flex flex-col gap-[30px] pt-[30px] px-[25px] ">
      <div className="flex justify-between items-center ">
        <h2 className="text-text_black_primary font-extralight text-[48px] leading-[48px] font-special">
          Alumni
        </h2>
        <Down_left_dark_arrow className="size-[46px]" />
      </div>
      <div className="flex gap-[10px]">
        <button className="w-full h-[30px]  border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary ">
          PhD
        </button>
        <button className="w-full h-[30px]  border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary ">
          Masters
        </button>
        <button className="w-full h-[30px] border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary">
          Interns
        </button>
      </div>

      <div className="flex flex-col gap-[10px] items-center">
        {members.map((member) => (
          <AccordionCard
            key={member.name}
            title={member.name}
            subtitle={member.role}
            bg={member.img}
            desc={member.bio}
          />
        ))}
      </div>

      <button className="flex items-center gap-[10px] mx-auto text-primary_main font-semibold text-[18px] rounded-[18px] active:bg-primary_main active:text-white py-[8px] px-[24px]">
        View All Alumni <Up_right_neutral_arrow />
      </button>
    </div>
  );
};
