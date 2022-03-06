import { CustomLink } from "./CustomLink";
import data from "../data.json";

export const Section = () => {
  const members = Object.keys(data.PEOPLE);

  return (
    <div className="section">
      <div className="section__logo-wrap">
        <img src="/img/logo.jpg" alt="" className="section__logo" />
      </div>
      <ul className="section__list">
        {members.map((m) => (
          <li key={m} className="section__item">
            <CustomLink to={m}>{m}</CustomLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
