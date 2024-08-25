import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Down_left_dark_arrow } from "assets/";

export const About = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll px-[30px] pt-[65px]">
      <Intro />
      <Tracks />
      <Details />
    </div>
  );
};

const Intro = () => {
  return (
    <div className="w-full flex flex-col gap-[30px] py-[30px]">
      <div className="flex flex-col gap-[15px]">
        <div className="w-full h-[160px] bg-border_dark rounded-[30px]"></div>
        <h1 className="font-special text-text_black_primary text-[48px] font-bold leading-[48px]">
          Integration <span className="text-primary_main ">&</span> Innovation Design
        </h1>
      </div>
      <h3 className="font-regular text-text_black_secondary text-[18px]">
        Integration + Innovation Design Lab (IIDL) focuses on the design of innovative products and
        services through multi-disciplinary approaches among industrial design, ergonomics, and
        engineering design. IIDL seeks to establish integrated and innovative design methodologies,
        develop human-centered design factors and concepts, and investigate the design engineering
        and mechanical aspects of a whole product. This is achieved by actively collaborating with
        experts in engineering design, human factors engineering, business, and applied fields.
      </h3>
    </div>
  );
};

const Tracks = () => {
  return (
    <div className="w-dvw flex flex-col gap-[30px] p-[30px] ">
      <div className="flex items-center">
        <h2 className="text-text_black_primary font-light text-[48px] leading-[48px] font-special">
          Research Tracks
        </h2>
        <Down_left_dark_arrow className="size-[58px]" />
      </div>
      <div className="flex flex-wrap gap-[10px] text-[14px] font-normal font-regular">
        <button className="shrink-0 py-[8px] px-[24px]  border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary ">
          Integrated Design Innovation
        </button>
        <button className="shrink-0 py-[8px] px-[24px]  border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary ">
          Pervasive Design
        </button>
        <button className="shrink-0 py-[8px] px-[24px] border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary">
          Engineering Design
        </button>
        <button className="shrink-0 py-[8px] px-[24px] border-primary_main rounded-full grid place-content-center border-2 border-solid text-primary_main active:bg-primary_main active:text-text_white_primary">
          Transformable Design
        </button>
      </div>
    </div>
  );
};

const Details = () => {
  return (
    <div className="w-full py-[30px] flex flex-col gap-[15px]">
      <h1 className="font-special text-text_black_primary text-[48px] font-bold leading-[48px]">
        Integration Innovation Design
      </h1>
      <h3 className="font-regular text-text_black_secondary text-[12px]">
        Owing to the increasing use and expansion of global network infrastructure, a new paradigm
        in the design domain has emerged. This paradigm boosts traditional designers from 2D and 3D
        boundaries to face complex design problems and become design researchers, social innovators,
        knowledgeable problem solvers, and innovation-focused businessmen. This transformation is
        achieved through an interdisciplinary environment and collaboration among related fields.
      </h3>

      <div
        className="w-full h-[200px] bg-border_dark rounded-[20px]"
        style={{
          backgroundImage: "url(/img/projects/current/military_backpack.png)",
          backgroundSize: "100% 200px",
          backgroundPosition: "center",
        }}
      />

      <h3 className="font-regular text-text_black_secondary text-[12px]">
        Integrated Design Innovation seeks holistic approaches to understand social, ecological,
        environmental, medical, and technological problems, and create solutions for complex issues
        faced by society. Using integrated design, IIDL explores various aspects of collaboration
        among designers, engineers, and professionals in the product development process. IIDL
        identifies the role and expertise of experts, especially designers and engineers, to develop
        integrated and effective design methods.
      </h3>

      <div
        className="w-full h-[200px] bg-border_dark rounded-[20px]"
        style={{
          backgroundImage: "url(/img/projects/awards/wave_hat.png)",
          backgroundSize: "100% 200px",
          backgroundPosition: "center",
        }}
      />

      <h3 className="font-regular text-text_black_secondary text-[12px]">
        Currently, one research area focuses on understanding the product design process where
        industrial designers and engineering designers contribute as product designers. Moreover,
        this research area aims to develop an effective and innovative interaction model for
        industrial and engineering designers.
      </h3>

      <div
        className="w-full h-[200px] bg-border_dark rounded-[20px]"
        style={{
          backgroundImage: "url(/img/projects/current/lemmy_ai_based_robot.png)",
          backgroundSize: "100% 200px",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default About;
