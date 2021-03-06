import { Section } from "./Section";
export const Person = ({ person, index }) => {
  const className = index % 2 ? "person--bg person" : "person";
  return (
    <div className={className}>
      <div className="person__img-box">
        <img src={person.img} alt="" className="person__img" />
      </div>
      <div className="person__info">
        <h3 className="person__name">{person.name}</h3>
        <h4 className="person__detail">{person.title}</h4>
        <h4 className="person__detail">{person.email} </h4>
        <h4 className="person__detail">{person.phone}</h4>
      </div>
      <div className="person__bio">
        {person.bio}

        {/* <button className="person__more">check for more</button> */}
      </div>
      {!index && <Section />}
    </div>
  );
};
