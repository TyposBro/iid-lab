import { up_right_neutral_arrow } from "assets";
import { down_right_light_arrow } from "assets";

export const Home = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll p-[25px] pt-[95px]">
      <Intro />
      <div className="w-full my-[30px]">
        <div className="w-full rounded-[30px] h-[210px] bg-border_dark "></div>
      </div>
      <Prof />
      <Members />
      <Projects />
      <Journal />
      <Conference />
    </div>
  );
};

export default Home;

const Intro = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[465px] bg-border_dark rounded-[30px]"></div>
      <div className="w-full flex flex-col gap-[30px]">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-special text-text_black_primary text-[48px] font-bold">
            Integration <span className="text-primary_main ">&</span> Innovation Design
          </h1>
          <h3 className="font-regular text-text_black_secondary text-[12px]">
            Integration + Innovation Design Lab focuses on design and development of innovative
            products and services by integrating Design, Ergonomics, Engineering, Technology and
            Entrepreneurship.
          </h3>
        </div>
        <div className="flex flex-col gap-[10px] font-semibold text-[18px] font-regular">
          <button className="w-full h-[50px] border-border_dark rounded-[15px] grid place-content-center border-2 border-solid ">
            Publications
          </button>
          <button className="w-full h-[50px] border-border_dark rounded-[15px] grid place-content-center border-2 border-solid ">
            Achievements
          </button>
        </div>
      </div>
    </div>
  );
};

const Prof = () => {
  return (
    <div className="my-[30px] w-full flex flex-col gap-[30px]">
      <div className="w-[240px] h-[300px] rounded-[30px] bg-border_dark"></div>
      <div className="w-full flex flex-col gap-[5px]">
        <h2 className="font-regular font-bold text-primary_main text-[20px]">Lab Director</h2>
        <h1 className="font-super_special text-text_black_primary text-[36px] leading-[36px] font-bold">
          Professor KwanMyung Kim
        </h1>
        <h3 className="font-regular text-[12px] text-text_black_secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Urna porttitor rhoncus dolor purus non. Turpis massa sed
          elementum tempus egestas sed. Habitant morbi tristique senectus et netus et malesuada
          fames ac.
        </h3>
      </div>
      <div className="flex flex-col gap-[10px] font-semibold text-[18px] font-regular">
        <button className="w-full h-[50px] border-primary_main bg-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-text_white_primary">
          Publications
        </button>
        <button className="w-full h-[50px]  border-primary_main rounded-[15px] grid place-content-center border-2 border-solid text-primary_main ">
          Achievements
        </button>
      </div>
    </div>
  );
};
const Members = () => {
  const members = [
    { img: "", name: "Ulugbek", role: "PhD Candidate" },
    { img: "", name: "Daehun Lee", role: "PhD Candidate" },
    { img: "", name: "John Doe", role: "Masters" },
    { img: "", name: "John Doe", role: "Masters" },
  ];

  return (
    <div className="w-full my-[30px] flex flex-col gap-[30px] ">
      <div className="flex flex-col gap-[10px]">
        <img
          src={down_right_light_arrow}
          alt="down right light arrow icon"
          className="w-[34px] h-[34px]"
        />
        <h1 className="text-[42px] text-text_black_primary font-light font-super_special leading-[46px] ">
          Team Members
        </h1>
      </div>
      <div className="w-full flex flex-row gap-[10px] overflow-x-scroll">
        {members.map((member) => (
          <div key={member.name} className="w-full flex flex-col gap-[14px]">
            <div className="w-[170px] h-[270px] rounded-[20px] bg-border_dark shrink-0"></div>
            <div className="flex flex-col gap-[4px] font-regular">
              <h2 className="font-bold text-[18px] text-text_black_primary">{member.name}</h2>
              <h3 className="font-regular font-normal text-[12px] text-text_black_primary">
                {member.role}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <button className="flex justify-center items-center gap-[10px] font-semibold font-regular text-[18px] text-primary_main ">
        <span>View Past Members</span>
        <img src={up_right_neutral_arrow} alt="up right light arrow icon" />
      </button>
    </div>
  );
};
const Projects = () => {};
const Journal = () => {};
const Conference = () => {};
