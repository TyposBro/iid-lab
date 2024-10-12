import { useNavigate } from "react-router-dom";

import MenuButton from "./MenuButton";

import Logo from "../assets/navbar_logo.svg";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between px-[30px] py-[25px] bg-white fixed z-10 w-full">
      <img
        src={Logo}
        alt="IIDL Logo"
        className="h-[20px] w-[100px] active:scale-95 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <MenuButton navigate={navigate} />
    </div>
  );
};

export default Navbar;
