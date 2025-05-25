// {PATH_TO_THE_PROJECT}/src/components/ProjectCard.jsx
import PropTypes from "prop-types";

export const ProjectCard = ({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  projectYear,
  projectAuthors, // Can be a string of comma-separated authors
  awardName, // For awards, awardName might be the main title
  link,
  onLinkClick, // Optional: if you want a custom click handler instead of direct link
  buttonText = "Learn More",
  cardBgColor = "bg-transparent",
  borderColor = "border-[#282828f2]",
  primaryTextColor = "text-text_white_primary",
  secondaryTextColor = "text-text_white_primary",
  buttonBorderColor = "border-primary_main",
  buttonTextColor = "text-primary_main",
  imageHeight = "h-60", // Default image height
  customClasses = "", // For additional styling like width for horizontal scroll
}) => {
  const handleButtonClick = () => {
    if (onLinkClick) {
      onLinkClick();
    } else if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  // Determine display title and subtitle (useful for awards where awardName is primary)
  const displayTitle = awardName || title;
  const displaySubtitle = awardName ? title : subtitle; // If awardName is the title, original title becomes subtitle

  return (
    <div className={`relative ${customClasses}`}>
      {imageSrc && (
        <img
          className={`absolute rounded-t-3xl w-full ${imageHeight} object-cover z-0`}
          src={imageSrc}
          alt={imageAlt || displayTitle}
        />
      )}
      {/* Main card structure */}
      <div
        className={`w-full h-full rounded-3xl flex flex-col justify-between ${borderColor} border ${cardBgColor}`}
      >
        {/* Spacer div, same height as image, allows content to sit below image */}
        <div className={`w-full ${imageHeight} shrink-0`} />

        {/* Text Content Area */}
        <div className="w-full flex flex-col gap-1 px-5 pt-4 flex-grow">
          <div className="flex items-center justify-between">
            {displayTitle && (
              <h2 className={`font-bold text-base sm:text-xl lg:text-2xl ${primaryTextColor}`}>
                {displayTitle}
              </h2>
            )}
            {projectYear && (
              <p className={`text-xs mt-1 ${secondaryTextColor}`}>Year: {projectYear}</p>
            )}
          </div>

          {displaySubtitle && (
            <h3 className={`text-sm ${secondaryTextColor}`}>{displaySubtitle}</h3>
          )}

          {projectAuthors && (
            <p className={`text-xs mt-1 ${secondaryTextColor}`}>{projectAuthors}</p>
          )}
        </div>

        {/* Button aligned to the bottom right by parent's items-end and self margin */}
        {(link || onLinkClick) && (
          <div className="w-full flex justify-end">
            {" "}
            {/* Wrapper to align button right */}
            <button
              onClick={handleButtonClick}
              className={`mb-5 mr-5 mt-4 px-4 py-2 border-2 rounded-md font-semibold text-sm ${buttonBorderColor} ${buttonTextColor}`}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  projectYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  projectAuthors: PropTypes.string,
  awardName: PropTypes.string,
  link: PropTypes.string,
  onLinkClick: PropTypes.func,
  buttonText: PropTypes.string,
  cardBgColor: PropTypes.string,
  borderColor: PropTypes.string,
  primaryTextColor: PropTypes.string,
  secondaryTextColor: PropTypes.string,
  buttonBorderColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  imageHeight: PropTypes.string,
  customClasses: PropTypes.string,
};
