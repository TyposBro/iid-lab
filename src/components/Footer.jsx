import Arrow from "../assets/footer_arrow.svg";
import Email from "../assets/footer_email.svg";
import Location from "../assets/footer_location.svg";
import Logo from "../assets/footer_logo.svg";
import Phone from "../assets/footer_phone.svg";

export const Footer = () => {
  return (
    <footer className="w-full h-fit flex flex-col justify-center items-center gap-[80px] bg-text_black_primary relative p-[30px] font-regular">
      <div className="flex flex-row justify-between items-center gap-[20px]">
        <div className="flex flex-col items-start gap-[10px]">
          <img src={Arrow} className="w-[66px] h-[66px]" />
          <h1 className="text-[64px] leading-[72px] font-light text-text_white_primary font-special">
            Contact <span className="text-primary_main">Us</span>
          </h1>
          <p className="text-text_white_tertiary text-[12px] font-normal">
            If you have any inquires, please contact us via following email or telephone number. We
            would also be thrilled to have you visit our lab!
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-[10px] text-text_white_secondary">
        <div className="flex items-center gap-[10px]">
          <img src={Location} className="w-6 h-6" />
          <p className="text-sm">
            #904 Room, 104 Building, UNIST, 50-gil, Eonyang-eup, Ulju-gun, Ulsan, S.Korea
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <img src={Phone} className="w-6 h-6" />
          <p className="text-sm">+82-52-217-2714</p>
        </div>
        <div className="flex items-center gap-[10px] ">
          <img src={Email} className="w-6 h-6" />
          <p className="text-sm">kmyung@unist.ac.kr</p>
        </div>
      </div>
      <img src={Logo} alt="" />
    </footer>
  );
};

export default Footer;
