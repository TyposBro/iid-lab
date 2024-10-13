import { useRef } from "react";
import PropTypes from "prop-types";

export const MenuButton = ({ navigate }) => {
  const ref = useRef(null);

  const handleNavigation = (path) => {
    navigate(path);
    ref.current.checked = false;
  };

  return (
    <>
      <input
        ref={ref}
        type="checkbox"
        name="navigation"
        id="nav-toggle"
        className="nav__checkbox"
      />
      <label htmlFor="nav-toggle" className="nav__btn">
        <span className="nav__icon"> &nbsp; </span>
      </label>

      <div className="nav__background">&nbsp;</div>

      <nav className="nav__container">
        <ul className="nav__list">
          <li className="nav__item" onClick={() => handleNavigation("/about")}>
            <a href="#about" className="nav__link">
              About IID Lab
            </a>
          </li>
          <li className="nav__item" onClick={() => handleNavigation("/team")}>
            <a href="#team" className="nav__link">
              Team
            </a>
          </li>
          <li className="nav__item" onClick={() => handleNavigation("/projects")}>
            <a href="#projects" className="nav__link">
              Projects
            </a>
          </li>
          <li className="nav__item" onClick={() => handleNavigation("/publications")}>
            <a href="#publications" className="nav__link">
              Publications
            </a>
          </li>
          <li className="nav__item" onClick={() => handleNavigation("/news")}>
            <a href="#news" className="nav__link">
              News
            </a>
          </li>
          <li className="nav__item" onClick={() => handleNavigation("/gallery")}>
            <a href="#gallery" className="nav__link">
              Gallery
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MenuButton;

MenuButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};
