import { useNavigate } from "react-router-dom";
import MenuButton from "@/components/MenuButton";
import Logo from "@/assets/navbar_logo.svg";

const AdminNav = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between px-[30px] py-[25px] bg-white fixed z-10 w-full max-w-5xl">
      <img
        src={Logo}
        alt="IIDL Logo"
        className="h-[20px] w-[100px] active:scale-95 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <MenuButton navigate={navigate} defaultChecked={true} />
    </div>
  );
};

export default AdminNav;
