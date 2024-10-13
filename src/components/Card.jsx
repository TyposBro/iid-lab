import PropTypes from "prop-types";

const Card = ({ title, subtitle, bg, desc = null, action = null }) => {
  return (
    <div
      key={title}
      className="relative w-full h-[200px] sm:h-96 animate-shrink-right cursor-pointer "
    >
      <div className="absolute bg-border_dark overflow-hidden rounded-[20px] w-full h-full layer-1">
        {/* Dark Overlay */}
        <img src={bg} alt="" className="absolute block object-cover w-full h-full z-[2]" />
        <div
          className="absolute inset-0 bg-black rounded-[20px]"
          style={{ background: "linear-gradient(180deg, #32323200 50%, #32323288 100%)" }}
        ></div>
        {/* Dark Overlay */}
        <div className="bottom-[20px] absolute flex justify-between items-center px-[20px] w-full z-20">
          <div>
            <h2 className="font-bold text-[24px] text-text_white_primary">{title}</h2>
            <h3 className="text-[12px] text-text_white_secondary">{subtitle}</h3>
          </div>
        </div>
      </div>
      {window.innerWidth >= 640 && desc && (
        <div className="absolute w-1/2 h-full flex flex-col justify-around">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-lg text-border_dark">{desc}</p>
          <button
            onClick={action}
            className="rounded-[15px] w-48 h-[50px] font-semibold text-lg border-2 text-primary_main border-primary_main active:bg-primary_main active:text-white"
          >
            Contact
          </button>
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
  desc: PropTypes.string,
  action: PropTypes.func,
};

export default Card;
