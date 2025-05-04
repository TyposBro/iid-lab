import { useLocation, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import MenuButton from "./MenuButton";

import Logo from "../assets/navbar_logo.svg";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between px-[30px] py-[25px] bg-white fixed z-20 w-full ">
      <img
        src={Logo}
        alt="IIDL Logo"
        className="h-[20px] w-[100px] active:scale-95 cursor-pointer"
        onClick={() => navigate("/")}
      />
      {window.innerWidth <= 768 ? (
        <MenuButton navigate={navigate} />
      ) : (
        <DesktopMenu navigate={navigate} />
      )}
    </div>
  );
};

export default Navbar;

const DesktopMenu = ({ navigate }) => {
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location?.pathname.includes(path) ? "text-primary_main" : "";
  };

  return (
    <nav className="flex flex-row gap-[20px]">
      <div
        className={`cursor-pointer ${isActive("/about")}`}
        onClick={() => handleNavigation("/about")}
      >
        About IID Lab
      </div>
      <div
        className={`cursor-pointer ${isActive("/team")}`}
        onClick={() => handleNavigation("/team")}
      >
        Team
      </div>
      <div
        className={`cursor-pointer ${isActive("/projects")}`}
        onClick={() => handleNavigation("/projects")}
      >
        Projects
      </div>
      <div
        className={`cursor-pointer ${isActive("/publications")}`}
        onClick={() => handleNavigation("/publications")}
      >
        Publications
      </div>
      <div
        className={`cursor-pointer ${isActive("/news")}`}
        onClick={() => handleNavigation("/news")}
      >
        News
      </div>
      <div
        className={`cursor-pointer ${isActive("/gallery")}`}
        onClick={() => handleNavigation("/gallery")}
      >
        Gallery
      </div>
      <div
        className={`cursor-pointer ${isActive("/admin")}`}
        onClick={() => handleNavigation("/admin")}
      >
        Admin
      </div>
    </nav>
  );
};

DesktopMenu.propTypes = {
  navigate: PropTypes.func.isRequired,
};
