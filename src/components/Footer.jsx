import {
  down_right_dark_arrow,
  footer_email,
  footer_location,
  footer_logo,
  footer_phone,
} from "../assets/";

export const Footer = () => {
  return (
    <footer className="w-full h-fit flex flex-col justify-center items-center gap-[80px] bg-text_black_primary relative p-[30px] font-regular">
      <div className="flex flex-row justify-between items-center gap-[20px]">
        <div className="flex flex-col items-start gap-[10px]">
          <img src={down_right_dark_arrow} className="w-[66px] h-[66px]" />
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
          <img src={footer_location} className="w-6 h-6" />
          <p className="text-sm">
            #904 Room, 104 Building, UNIST, 50-gil, Eonyang-eup, Ulju-gun, Ulsan, S.Korea
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <img src={footer_phone} className="w-6 h-6" />
          <p className="text-sm">+82-52-217-2714</p>
        </div>
        <div className="flex items-center gap-[10px] ">
          <img src={footer_email} className="w-6 h-6" />
          <p className="text-sm">kmyung@unist.ac.kr</p>
        </div>
      </div>
      <img src={footer_logo} alt="" />
    </footer>
  );
};

export default Footer;
