export const Header = () => {
  return (
    <nav className="header">
      <ul className="header__list">
        <li className="header__item">
          <a href="/home" className="header__link">
            Home
          </a>
        </li>
        <li className="header__item">
          <a href="/people" className="header__link">
            People
          </a>
        </li>
        <li className="header__item">
          <a href="/publications" className="header__link">
            Publications
          </a>
        </li>
        <li className="header__item">
          <a href="/projects" className="header__link">
            Projects
          </a>
        </li>
        <li className="header__item">
          <a href="/achievements" className="header__link">
            Achiements
          </a>
        </li>
        <li className="header__item">
          <a href="/news" className="header__link">
            News
          </a>
        </li>
        <div className="header__placeholder"></div>
        <li className="header__item">
          <a href="/contact" className="header__link">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};
