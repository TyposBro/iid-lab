import MenuButton from "./MenuButton";

import Logo from "../assets/navbar_logo.svg";

export const Navbar = () => {
  return (
    <div className="flex flex-row justify-between px-[30px] py-[25px] bg-white fixed z-10 w-dvw">
      <img src={Logo} alt="IIDL Logo" className="h-[20px] w-[100px]" />
      <MenuButton />
    </div>
  );
};

export default Navbar;
