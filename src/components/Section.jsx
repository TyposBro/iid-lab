import { CustomLink } from "./CustomLink";
import PEOPLE from "../people.json";

export const Section = () => {
  const members = Object.keys(PEOPLE);

  return (
    <div className="section">
      <div className="section__logo-wrap">
        <img src="/img/logo.jpg" alt="" className="section__logo" />
      </div>
      <ul className="section__list">
        {members.map((m) => (
          <CustomLink key={m} className="section__item" to={m}>
            {m}
          </CustomLink>
        ))}
      </ul>
    </div>
  );
};
