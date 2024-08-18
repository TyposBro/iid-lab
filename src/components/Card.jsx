import PropTypes from "prop-types";

const Card = ({ title, subtitle, bg }) => {
  return (
    <div key={title} className="w-full relative ">
      <div
        className="bg-border_dark w-full h-[200px] rounded-[20px] relative"
        style={{
          background: `url(${bg})`,
          backgroundSize: "100% 200px",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 rounded-[20px]"></div>
        {/* Dark Overlay */}
        <div className="w-full flex justify-between items-center absolute bottom-[20px] px-[20px] ">
          <div>
            <h2 className="text-text_white_primary font-bold text-[24px] font-special">{title}</h2>
            <h3 className="text-text_white_secondary font-regular text-[12px] font-normal">
              {subtitle}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
};

export default Card;
