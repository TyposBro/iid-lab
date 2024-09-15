import PropTypes from "prop-types";

const Card = ({ title, subtitle, bg }) => {
  return (
    <div key={title} className="relative w-full">
      <div
        className="relative bg-border_dark rounded-[20px] w-full h-[200px]"
        style={{
          background: `url(${bg})`,
          backgroundSize: "100% 200px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay */}
        <div
          className="absolute inset-0 bg-black rounded-[20px]"
          style={{ background: "linear-gradient(180deg, #32323200 0%, #323232FF 100%)" }}
        ></div>
        {/* Dark Overlay */}
        <div className="bottom-[20px] absolute flex justify-between items-center px-[20px] w-full">
          <div>
            <h2 className="font-bold text-[24px] text-text_white_primary">{title}</h2>
            <h3 className="text-[12px] text-text_white_secondary">{subtitle}</h3>
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
