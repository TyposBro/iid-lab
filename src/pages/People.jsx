import { Outlet } from "react-router-dom";

export const People = () => {
  return (
    <div className="people">
      <div className="people__img-box">
        <img className="people__img" src="img/team.jpg" alt="" />
      </div>

      <div className="people__content">
        <Outlet />
      </div>
    </div>
  );
};
