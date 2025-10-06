import { Down_straight_neutral_arrow } from "@/assets";
import PropTypes from "prop-types";
import { useState } from "react";
import { LinkedIn } from "@mui/icons-material";

const AccordionCard = ({ title, subtitle, desc, bg, linkedIn }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div key={title} className="w-full flex flex-col gap-1.5">
      <img className="w-full h-72 rounded-3xl object-cover object-top" src={bg} />
      <div className="w-full flex justify-between items-center px-4">
        <div className="font-bold text-black">
          <h2 className="text-xl">{title}</h2>
          <h3 className="italic text-base">{subtitle}</h3>
        </div>
        <div className="flex justify-between items-center gap-2">
          {linkedIn && (
            <a href={linkedIn} target="_blank" rel="noreferrer noopener">
              <LinkedIn className="text-text_black_primary hover:text-blue-400 size-7 z-10" />
            </a>
          )}

          <div
            onClick={() => setExpanded((prev) => !prev)}
            className="bg-black size-7 p-1 rounded-full grid place-content-center"
          >
            <Down_straight_neutral_arrow
              className={`transform origin-center transition duration-500 ease-out text-white ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      <div
        className={`grid text-sm px-4 transition-all duration-700 ease-in-out text-border_dark ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr]  opacity-0"
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
  linkedIn: PropTypes.string.isRequired,
};

export default AccordionCard;
