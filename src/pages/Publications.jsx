import PropTypes from "prop-types";
import { Down_straight_neutral_arrow } from "assets/";

export const Publications = () => {
  const journalPapers = [
    {
      title:
        "Interdisciplinary Co-Design Research Practice in the Rehabilitation of Elderly Individuals with Chronic Low Back Pain from a Senior Care Center in South Korea",
      journal: "Applied Sciences",
      year: 2022,
      authors: "M. Tufail, H. Lee, YG. Moon, H. Kim,KM. Kim",
      link: "https://www.mdpi.com/2076-3417/12/9/4687",
    },
    {
      title:
        "How do visitors perceive the significance of tangible cultural heritage through a 3D reconstructed immersive visual experience at the Seokguram Grotto, South Korea?",
      journal: "Science Reports",
      year: 2022,
      authors: "MC Chang, SW Park, JY Cho, BJ Lee, JM Hwang, KM Kim & DH Park",
      link: "https://www.tandfonline.com/doi/full/10.1080/1743873X.2022.2039672",
    },
  ];

  const conferencePapers = [
    {
      title:
        "Introducing a framework to translate user scenarios into engineering specifications with “action steps”",
      authors: ["Ulugbek Ismatullaev", "KM. Kim"],
      year: "2024",
      conference: "DESIGN CONFERENCE",
      location: "Dubrovnik, Croatia",
      color: "#10719A",
      link: "https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/introducing-a-framework-to-translate-user-scenarios-into-engineering-specifications-with-action-steps/21306D946ED8FF4C56AEC995CAE50768",
    },
    {
      title:
        "Exercise Characteristics of Older Adults and Considerations for Exercise Equipment Design for them",
      authors: ["J. Kim", "A. Saduakas", "U. Ismatullaev", "D. Lee", "BB. Garza", "KM. Kim"],
      year: "2023",
      conference: "IASDR",
      location: "Milan, Italy",
      color: "#003152",
      link: "https://dl.designresearchsociety.org/iasdr/iasdr2023/fullpapers/223/",
    },
    {
      title: "Dynamic personalities for elderly care robots: user-based recommendations",
      authors: ["D. Lee", "A. Saduakas", "U. Ismatullaev", "BB. Garza", "J. Kim", "KM. Kim"],
      year: "2023",
      conference: "IASDR",
      location: "Milan, Italy",
      color: "#03ADBB",
      link: "https://dl.designresearchsociety.org/iasdr/iasdr2023/fullpapers/210/",
    },

    {
      title: "Human Factors Considerations in Design for the Elderly",
      authors: ["U. Ismatullaev", "A. Saduakas", "KM. Kim"],
      year: "2022",
      conference: "AHFE",
      location: "New York, USA",
      color: "#03ADBB",
      link: "https://openaccess.cms-conferences.org/publications/book/978-1-958651-14-8/article/978-1-958651-14-8_3",
    },
    {
      title:
        "Addressing the Gaps in Elderly Falling Prevention from the Perspective of a Human-Centered Design.",
      authors: ["A. Saduakas", "U. Ismatullaev", "KM. Kim"],
      year: "2022",
      conference: "AHFE",
      location: "New York, USA",
      color: "#03ADBB",
      link: "https://openaccess.cms-conferences.org/publications/book/978-1-958651-14-8/article/978-1-958651-14-8_3",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full h-dvh overflow-y-scroll">
      <div className="flex flex-col gap-[10px] px-[25px]">
        <h2 className="font-bold text-[48px] text-black leading-[48px]">Publications</h2>
        <div className="border-text_black_secondary font-normal text-[12px]">
          We&apos;ve published world-class research and won prestigious design awards. Our students
          gain the integrated knowledge and experience needed to lead new product development,
          leading to successful careers after graduation.
        </div>
      </div>

      <PublicationList
        title="Journals"
        bg="bg-transparent"
        buttonColor="text-primary_main"
        iconColor="text-primary_main"
        buttonBorder="border-primary_main"
        list={journalPapers}
      />
      <PublicationList
        title="Conferences"
        bg="bg-primary_main"
        buttonColor="border-text_black_primary"
        iconColor="text-white"
        buttonBorder="border-text_black_primary"
        list={conferencePapers}
      />
    </div>
  );
};

export default Publications;

const PublicationList = ({ title, bg, buttonColor, iconColor, buttonBorder, list }) => {
  // const cardColors = [
  //   { bg: "#C1EDFF", text: "#10719A" },
  //   { bg: "#FFE5E5", text: "#F34D4D" },
  //   { bg: "#FFD6A5", text: "#FF7B00" },
  //   { bg: "#C1FFD3", text: "#00A86B" },
  //   { bg: "#D1D1FF", text: "#5A5AFF" },
  //   { bg: "#FFC1FF", text: "#FF00FF" },
  // ];

  return (
    <div className={`w-full flex flex-col gap-[30px] py-[30px] bg-primary_main ${bg}`}>
      <div className="flex flex-col gap-[25px] px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-extralight text-[42px] text-black leading-[48px]">{title}</h2>
          <Down_straight_neutral_arrow className={`size-[56px] rotate-45 ${iconColor}`} />
        </div>
        <div
          className={`flex gap-[12px] border-text_black_primary text-[16px] font-medium  ${buttonColor}`}
        >
          <button
            className={`rounded-full px-[24px] py-[8px] border-2 ${buttonColor} ${buttonBorder}`}
          >
            2022
          </button>
          <button
            className={`rounded-full px-[24px] py-[8px] border-2 ${buttonColor} ${buttonBorder}`}
          >
            2021
          </button>
          <button
            className={`rounded-full px-[24px] py-[8px] border-2 ${buttonColor} ${buttonBorder}`}
          >
            2020
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[15px] px-[25px] w-full">
        {list.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-col justify-between gap-[16px] bg-[#C1EDFF] p-[20px] rounded-[20px] w-full"
            >
              <a
                className="font-normal text-[20px] underline"
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                {item.title}
              </a>
              <h4 className="text-[20px]">
                <span className="font-bold">{item.journal}</span>{" "}
                <span className="font-normal">{item.year}</span>
              </h4>
              <h4 className="font-semibold text-[#10719A] text-[14px]">{item.authors}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

PublicationList.propTypes = {
  title: PropTypes.string,
  bg: PropTypes.string,
  buttonColor: PropTypes.string,
  iconColor: PropTypes.string,
  buttonBorder: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      journal: PropTypes.string,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      authors: PropTypes.string,
    })
  ),
};
