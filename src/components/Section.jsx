export const Section = () => {
  return (
    <div className="section">
      <div className="section__logo-wrap">
        <img src="img/logo.jpg" alt="" className="section__logo" />
      </div>
      <ul className="section__list">
        <li className="section__item section__active">Director</li>
        <li className="section__item">PhD</li>
        <li className="section__item">Masters</li>
        <li className="section__item">Interns</li>
        <li className="section__item">Alumni</li>
      </ul>
    </div>
  );
};
