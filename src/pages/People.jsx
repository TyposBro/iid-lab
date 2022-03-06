import { Person } from "../components/Person";
export const People = () => {
  return (
    <div className="people">
      <div className="people__img-box">
        <img className="people__img" src="img/team.jpg" alt="" />
      </div>
      <div className="people__content">
        <Person className="people__person"></Person>
        <div className="section">
          <div className="section__logo-wrap">
            <img src="img/logo.jpg" alt="" className="section__logo" />
          </div>
          <ul className="section__list">
            <li className="section__item section_active">Director</li>
            <li className="section__item">PhD</li>
            <li className="section__item">Masters</li>
            <li className="section__item">Interns</li>
            <li className="section__item">Alumni</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
