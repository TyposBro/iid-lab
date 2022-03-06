import PEOPLE from "../people.json";
import { Person } from "../components/Person";

export const Members = ({ link }) => {
  const people = PEOPLE[link].map((elem, index) => <Person key={index} person={elem} index={index}></Person>);

  return (
    <div className="members">
      <h3 className="members__heading">{link}</h3>

      {people}
    </div>
  );
};
