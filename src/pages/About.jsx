import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Down_left_dark_arrow } from "assets/";
import { MainCarousel } from "components";

export const About = () => {
  return (
    <div className="flex flex-col justify-start items-center px-[30px] pt-[65px] w-full h-dvh overflow-y-scroll">
      <Intro />
      <Tracks />
      <Details />
    </div>
  );
};

const Intro = () => {
  const slides = [
    "/img/home/home_intro.png",
    "/img/gallery/jeju-2024/1.png",
    "/img/gallery/croatia-2024/1.png",
    "/img/gallery/unist-2024/1.png",
    "/img/gallery/gyeongju-2023/1.png",
  ];
  return (
    <div className="flex flex-col gap-[30px] py-[30px] w-full">
      <div className="flex flex-col gap-[15px]">
        <MainCarousel slides={slides} />
        <h1 className="font-bold text-[48px] text-text_black_primary leading-[48px]">
          Integration <span className="text-primary_main">&</span> Innovation Design
        </h1>
      </div>
      <h3 className="text-[18px] text-text_black_secondary">
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
    <div className="flex flex-col gap-[30px] py-[30px] w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-light text-[48px] text-text_black_primary leading-[48px]">
          Research Tracks
        </h2>
        <Down_left_dark_arrow className="size-[58px]" />
      </div>
      <div className="flex flex-wrap gap-[10px] text-[14px]">
        <button className="place-content-center border-2 border-primary_main grid active:bg-primary_main px-[24px] py-[8px] border-solid rounded-full text-primary_main active:text-text_white_primary shrink-0">
          Integrated Design Innovation
        </button>
        <button className="place-content-center border-2 border-primary_main grid active:bg-primary_main px-[24px] py-[8px] border-solid rounded-full text-primary_main active:text-text_white_primary shrink-0">
          Pervasive Design
        </button>
        <button className="place-content-center border-2 border-primary_main grid active:bg-primary_main px-[24px] py-[8px] border-solid rounded-full text-primary_main active:text-text_white_primary shrink-0">
          Engineering Design
        </button>
        <button className="place-content-center border-2 border-primary_main grid active:bg-primary_main px-[24px] py-[8px] border-solid rounded-full text-primary_main active:text-text_white_primary shrink-0">
          Transformable Design
        </button>
      </div>
    </div>
  );
};

const Details = () => {
  return (
    <div className="flex flex-col gap-[15px] py-[30px] w-full sm:grid sm:grid-cols-2">
      <div className="flex flex-col gap-[15px] sm:order-1">
        <h1 className="font-bold text-3xl text-text_black_primary leading-[48px]">
          Integration Innovation Design
        </h1>
        <h3 className="text-[12px] text-text_black_secondary">
          Owing to the increasing use and expansion of global network infrastructure, a new paradigm
          in the design domain has emerged. This paradigm boosts traditional designers from 2D and
          3D boundaries to face complex design problems and become design researchers, social
          innovators, knowledgeable problem solvers, and innovation-focused businessmen. This
          transformation is achieved through an interdisciplinary environment and collaboration
          among related fields.
        </h3>
      </div>

      <div
        className="bg-border_dark rounded-[20px] w-full h-[200px] sm:h-96 bg-no-repeat object-cover sm:order-2"
        style={{
          backgroundImage: "url(/img/projects/current/military_backpack.png)",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      />

      <h3 className="text-[12px] text-text_black_secondary sm:order-4">
        Integrated Design Innovation seeks holistic approaches to understand social, ecological,
        environmental, medical, and technological problems, and create solutions for complex issues
        faced by society. Using integrated design, IIDL explores various aspects of collaboration
        among designers, engineers, and professionals in the product development process. IIDL
        identifies the role and expertise of experts, especially designers and engineers, to develop
        integrated and effective design methods.
      </h3>

      <div
        className="bg-border_dark rounded-[20px] w-full h-[200px] sm:h-96 bg-no-repeat sm:order-3 object-cover "
        style={{
          backgroundImage: "url(/img/projects/awards/wave_hat.png)",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      />

      <h3 className="text-[12px] text-text_black_secondary sm:order-5">
        Currently, one research area focuses on understanding the product design process where
        industrial designers and engineering designers contribute as product designers. Moreover,
        this research area aims to develop an effective and innovative interaction model for
        industrial and engineering designers.
      </h3>

      <div
        className="bg-border_dark rounded-[20px] w-full h-[200px] sm:order-6 sm:h-96 bg-no-repeat object-cover"
        style={{
          backgroundImage: "url(/img/projects/current/lemmy_ai_based_robot.png)",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
};

export default About;
