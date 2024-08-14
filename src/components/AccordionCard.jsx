import { Down_straight_neutral_arrow } from "assets";
import PropTypes from "prop-types";
import { useState } from "react";

const AccordionCard = ({ title, subtitle, desc, bg }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div key={title} className="w-full relative " onClick={() => setExpanded((prev) => !prev)}>
      <div
        className="bg-border_dark w-full h-[270px] rounded-[20px] z-10 relative "
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
        {/* Dark Overlay */}
        <div className="w-full flex justify-between items-center absolute bottom-[20px] px-[20px] ">
          <div>
            <h2 className="text-text_white_primary font-bold text-[24px] font-special">{title}</h2>
            <h3 className="text-primary_main italic font-regular text-[12px] font-bold">
              {subtitle}
            </h3>
          </div>
          <Down_straight_neutral_arrow
            className={`size-[27px] transform origin-center transition duration-500 ease-out ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <div
        className={`grid px-[10px] py-[15px] transition-all duration-700 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{desc}</div>
      </div>
    </div>
  );
};

AccordionCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
};

export default AccordionCard;
