import { Members } from "../components/Members";
import { Section } from "../components/Section";

export const People = () => {
  return (
    <div className="people">
      <div className="people__img-box">
        <img className="people__img" src="img/team.jpg" alt="" />
      </div>
      <div className="people__content">
        <Members />
        <Section />
      </div>
    </div>
  );
};
