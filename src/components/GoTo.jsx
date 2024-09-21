import PropTypes from "prop-types";
import { Down_straight_neutral_arrow } from "assets/";
import { HashLink } from "react-router-hash-link";

const GoTo = ({ title, link }) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <h3 className="font-semibold text-[28px] text-primary_main">Go to..</h3>
      <div className="flex justify-between items-center">
        <HashLink
          className="font-light text-[48px] text-text_black_primary leading-[64px]"
          to={link}
        >
          {title}
        </HashLink>
        <Down_straight_neutral_arrow className="text-primary_main -rotate-[135deg] size-[46px]" />
      </div>
    </div>
  );
};

export default GoTo;

GoTo.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
