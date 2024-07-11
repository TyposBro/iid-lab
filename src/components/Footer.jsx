import Arrow from "../assets/footer_arrow.svg";
import Email from "../assets/footer_email.svg";
import Location from "../assets/footer_location.svg";
import Logo from "../assets/footer_logo.svg";

export const Footer = () => {
  return (
    <footer className="p-[30px] bg-[#231F20] grid grid-cols-2 grid-rows-2 gap-y-16 font-regular">
      {/* CTA */}
      <div className="flex flex-col gap-4">
        <h1 className="text-white font-special text-[40px] leading-[72px] font-light">
          Contact <span className="text-[#25AAE1]">Us</span>
        </h1>
        <p className="text-[#ffffff66] font-normal text-[18px]  leading-[22px]">
          If you have any inquires, please contact us via following email or telephone number. Also,
          feel free to visit our lab!
        </p>
      </div>

      {/* LOGO */}
      <div>
        <img src={Logo} alt="Logo" className="" />
      </div>

      {/* ADDRESS */}
      <div className="flex flex-col"></div>

      {/* ARROW */}
      <div></div>
    </footer>
  );
};

export default Footer;
