import { Person } from "../components/Person";
import data from "../data.json";
export const People = () => {
  const people = data.PEOPLE.PhD.map((e) => <Person person={e}></Person>);
  return (
    <div className="people">
      <div className="people__img-box">
        <img className="people__img" src="img/team.jpg" alt="" />
      </div>
      <div className="people__content">
        <div className="people__list">
          <h3 className="people__heading">director</h3>
          {people}
        </div>
        {/* <Person person={data.PEOPLE.Prof[0]}></Person> */}
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
      </div>
    </div>
  );
};
