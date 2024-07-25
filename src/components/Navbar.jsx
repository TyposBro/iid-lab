import MenuButton from "./MenuButton";

import Logo from "../assets/navbar_logo.svg";

export const Navbar = () => {
  return (
    <div className="flex flex-row px-[30px] py-[25px] bg-background_light">
      <img src={Logo} alt="Google Logo" className="h-[20px] w-[100px]" />
      <MenuButton />
    </div>
  );
};

export default Navbar;
