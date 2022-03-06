import data from "../data.json";
import { Person } from "../components/Person";

export const Members = ({ link }) => {
  const people = data.PEOPLE[link].map((elem, index) => <Person key={index} person={elem} index={index}></Person>);

  return (
    <div className="members">
      <h3 className="members__heading">{link}</h3>
      {people}
    </div>
  );
};
