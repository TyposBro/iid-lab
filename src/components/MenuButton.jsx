import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const MenuButton = () => {
  const navigate = useNavigate();
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
              About IIDL
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
          <li className="nav__item" onClick={() => handleNavigation("/team")}>
            <a href="#team" className="nav__link">
              Team
            </a>
          </li>
          <li className="nav__item" onClick={() => handleNavigation("/")}>
            <a href="#news" className="nav__link">
              Home
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MenuButton;
