import PropTypes from "prop-types";
import { Down_straight_neutral_arrow, Link } from "@/assets/";
import { truncateText } from "@/utils/text";
import { useState, useEffect } from "react";

export const Publications = () => {
  return (
    <div className="flex flex-col justify-start items-center pt-[95px] w-full h-dvh overflow-y-scroll">
      <div className="flex flex-col gap-[10px] px-[25px]">
        <h2 className="font-bold text-[48px] text-black leading-[48px]">Publications</h2>
        <div className="border-text_black_secondary  text-[12px]">
          We&apos;ve published world-class research and won prestigious design awards. Our students
          gain the integrated knowledge and experience needed to lead new product development,
          leading to successful careers after graduation.
        </div>
      </div>

      <PublicationList
        title="Journals"
        bg="#ffffff"
        buttonBg="#ffffff"
        buttonText="#25AAE1"
        iconColor="#25AAE1"
        listType="journals" // Indicate the type for fetching
      />
      <PublicationList
        title="Conferences"
        bg="#25AAE1"
        buttonBg="#25AAE1"
        buttonText="#231F20"
        iconColor="#ffffff"
        listType="conferences" // Indicate the type for fetching
      />
    </div>
  );
};

export default Publications;

const PublicationList = ({ title, bg, buttonBg, iconColor, buttonText, listType }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterButtons, setFilterButtons] = useState([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(`/api/publications/${listType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPublications(data);
        const uniqueYears = [...new Set(data.map((item) => item.year))].sort((a, b) => b - a); // Sort by year descending
        setFilterButtons(uniqueYears.slice(0, 4));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPublications();
  }, [listType]);

  if (loading) return <div>Loading {title}...</div>;
  if (error)
    return (
      <div>
        Error loading {title}: {error}
      </div>
    );

  const filteredList = (() => {
    if (!selectedYear) {
      return publications.slice(0, 5);
    } else if (selectedYear === "Archive") {
      return publications.filter((item) => !filterButtons.includes(item.year));
    } else {
      return publications.filter((item) => item.year === selectedYear);
    }
  })();

  return (
    <div className="w-full flex flex-col gap-[30px] py-[30px]" style={{ backgroundColor: bg }}>
      <div className="flex flex-col gap-[25px] px-[25px]">
        <div className="flex justify-between items-center">
          <h2 className="font-extralight text-[42px] text-black leading-[48px]">{title}</h2>
          <Down_straight_neutral_arrow
            className="size-[56px] rotate-45"
            style={{ color: iconColor }}
          />
        </div>
        <div className="flex flex-wrap gap-[12px] border-text_black_primary text-[16px] font-medium">
          {filterButtons.map((year) => (
            <button
              className="rounded-full px-[24px] py-[8px] border-2 "
              style={{
                borderColor: buttonText,
                backgroundColor: selectedYear === year ? buttonText : buttonBg,
                color: selectedYear === year ? buttonBg : buttonText,
              }}
              key={year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
          <button
            className="rounded-full px-[24px] py-[8px] border-2"
            onClick={() => setSelectedYear("Archive")}
            style={{
              borderColor: buttonText,
              backgroundColor: selectedYear === "Archive" ? buttonText : buttonBg,
              color: selectedYear === "Archive" ? buttonBg : buttonText,
            }}
          >
            Archive
          </button>
          <button
            className="rounded-full px-[24px] py-[8px] border-2"
            onClick={() => setSelectedYear(null)}
            style={{
              borderColor: buttonText,
              backgroundColor: selectedYear === null ? buttonText : buttonBg,
              color: selectedYear === null ? buttonBg : buttonText,
            }}
          >
            All
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[15px] px-[25px] w-full">
        {filteredList.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-col justify-between gap-[16px] bg-[#C1EDFF] p-[20px] rounded-[20px] w-full"
            >
              <span className=" text-[20px]">{truncateText(item.title, 150)}</span>
              <div className="flex flex-col gap-4">
                <h4 className=" flex gap-3 justify-between items-center text-[20px]">
                  <span className="font-bold shrink-0">{item.publisher}</span>
                  <span className="">{item.year}</span>
                  <a
                    className="flex justify-end items-center grow shrink-0"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.link && <Link className="size-[24px] text-[#10719A]" />}
                  </a>
                </h4>
                <h4 className="font-semibold text-[#10719A] text-[14px]">
                  {item.authors.join(", ")}
                </h4>
              </div>
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
  buttonBg: PropTypes.string,
  buttonText: PropTypes.string,
  iconColor: PropTypes.string,
  listType: PropTypes.oneOf(["journals", "conferences"]).isRequired,
};
