import data from "../data.json";
import { Person } from "../components/Person";

export const Members = () => {
  const people = data.PEOPLE["PhD"].map((e) => <Person person={e}></Person>);

  return (
    <div className="members">
      <h3 className="members__heading">director</h3>
      {people}
    </div>
  );
};
