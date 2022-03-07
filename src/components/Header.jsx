import { Link } from "react-router-dom";
export const Header = () => {
  return (
    <nav className="header">
      <img className="header__logo" src="/img/logo.jpg" alt="" />
      <ul className="header__list">
        <li className="header__item">
          <Link to="/home" className="header__link">
            Home
          </Link>
        </li>
        <li className="header__item">
          <Link to="/people" className="header__link">
            People
          </Link>
        </li>
        <li className="header__item">
          <Link to="/publications" className="header__link">
            Publications
          </Link>
        </li>
        <li className="header__item">
          <Link to="/projects" className="header__link">
            Projects
          </Link>
        </li>
        <li className="header__item">
          <Link to="/achievements" className="header__link">
            Achiements
          </Link>
        </li>
        <li className="header__item">
          <Link to="/news" className="header__link">
            News
          </Link>
        </li>
        <div className="header__placeholder"></div>
        <li className="header__item">
          <Link to="/contact" className="header__link">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};
