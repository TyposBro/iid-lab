export const MenuButton = () => {
  return (
    <>
      <input type="checkbox" name="navigation" id="nav-toggle" className="nav__checkbox" />
      <label htmlFor="nav-toggle" className="nav__btn">
        <span className="nav__icon"> &nbsp; </span>
      </label>

      <div className="nav__background">&nbsp;</div>

      <nav className="nav__container">
        <ul className="nav__list">
          <li className="nav__item">
            <a href="#contact" className="nav__link">
              About IIDL
            </a>
          </li>
          <li className="nav__item">
            <a href="#projects" className="nav__link">
              Projects
            </a>
          </li>
          <li className="nav__item">
            <a href="#bublications" className="nav__link">
              Publications
            </a>
          </li>
          <li className="nav__item">
            <a href="#team" className="nav__link">
              Team
            </a>
          </li>
          <li className="nav__item">
            <a href="#news" className="nav__link">
              News
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MenuButton;
