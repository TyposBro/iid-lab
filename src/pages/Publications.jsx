import PropTypes from "prop-types";
import { Down_straight_neutral_arrow } from "assets/";

export const Publications = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-start items-center overflow-y-scroll px-[25px] pt-[95px]">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-black font-bold text-[48px] leading-[48px] font-special">
          Publications
        </h2>
        <div className="border-text_black_secondary  text-[12px] font-normal font-regular">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate laborum minus
          laboriosam! Optio eaque nemo sit corrupti excepturi quisquam consequatur ab maiores! Sit
          atque, dolor minus sed aspernatur dolorem alias.
        </div>
      </div>

      <PublicationList
        bg="bg-[transparent]"
        buttonColor="text-primary_main"
        iconColor="text-primary_main"
        buttonBorder="border-primary_main"
      />
      <PublicationList
        bg="bg-primary_main"
        buttonColor="border-text_black_primary"
        iconColor="text-white"
        buttonBorder="border-text_black_primary"
      />
    </div>
  );
};

export default Publications;

const PublicationList = ({ bg, buttonColor, iconColor, buttonBorder }) => {
  const cardColors = [
    { bg: "#C1EDFF", text: "#10719A" },
    { bg: "#FFE5E5", text: "#F34D4D" },
    { bg: "#FFD6A5", text: "#FF7B00" },
    { bg: "#C1FFD3", text: "#00A86B" },
    { bg: "#D1D1FF", text: "#5A5AFF" },
    { bg: "#FFC1FF", text: "#FF00FF" },
  ];

  const publications = [
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      journal: "IASDR",
      year: 2023,
      authors: "Jaehan Park, M. Tufail, HB. Lee, KM. Kim",
    },
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      journal: "IASDR",
      year: 2023,
      authors: "Jaehan Park, M. Tufail, HB. Lee, KM. Kim",
    },
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      journal: "IASDR",
      year: 2023,
      authors: "Jaehan Park, M. Tufail, HB. Lee, KM. Kim",
    },
    {
      title:
        "The Design of Rehabilitation Device for Upper Limb After Stroke Using an Integrated Design Process, December 2021 HongKong",
      journal: "IASDR",
      year: 2023,
      authors: "Jaehan Park, M. Tufail, HB. Lee, KM. Kim",
    },
  ];

  return (
    <div className={`w-dvw flex flex-col gap-[30px] py-[30px] px-[25px] bg-primary_main ${bg}`}>
      <div className="flex flex-col gap-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="text-black font-extralight text-[42px] leading-[48px] font-super_special">
            Completed Projects
          </h2>
          <Down_straight_neutral_arrow className={`size-[56px] rotate-45 ${iconColor}`} />
        </div>
        <div
          className={`flex gap-[12px] border-text_black_primary text-[16px] font-medium font-regular ${buttonColor}`}
        >
          <button
            className={`rounded-full px-[24px] py-[8px] border-2 ${buttonColor} ${buttonBorder}`}
          >
            Needs
          </button>
          <button
            className={`rounded-full px-[24px] py-[8px] border-2 ${buttonColor} ${buttonBorder}`}
          >
            Sorting
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-[15px]">
        {publications.map((project) => {
          const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

          return (
            <div
              key={project.title}
              className="w-full flex flex-col justify-between gap-[16px] rounded-[20px] p-[20px]"
              style={{ backgroundColor: randomColor.bg }}
            >
              <h3 className="font-regular font-normal text-[20px]">{project.title}</h3>
              <h4 className="text-[20px] font-special">
                <span className="font-bold">{project.journal}</span>{" "}
                <span className="font-normal">{project.year}</span>
              </h4>
              <h4
                className="font-semibold text-[14px] font-regular"
                style={{ color: randomColor.text }}
              >
                {project.authors}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

PublicationList.propTypes = {
  bg: PropTypes.string,
  buttonColor: PropTypes.string,
  iconColor: PropTypes.string,
  buttonBorder: PropTypes.string,
};
