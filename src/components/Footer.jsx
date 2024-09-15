import {
  Down_right_dark_arrow,
  Footer_email,
  Footer_location,
  Footer_logo,
  Footer_phone,
} from "assets/";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="relative flex flex-col justify-center items-center gap-[80px] bg-text_black_primary p-[30px] w-full h-fit"
    >
      <div className="flex flex-row justify-between items-center gap-[20px]">
        <div className="flex flex-col items-start gap-[10px]">
          <Down_right_dark_arrow className="w-[66px] h-[66px]" />
          <h1 className="font-light text-[64px] text-text_white_primary leading-[72px]">
            Contact <span className="text-primary_main">Us</span>
          </h1>
          <p className="text-[12px] text-text_white_tertiary">
            If you have any inquires, please contact us via following email or telephone number. We
            would also be thrilled to have you visit our lab!
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-[10px] text-text_white_secondary">
        <a
          className="flex items-center gap-[10px]"
          href="https://map.naver.com/p/search/UNIST/place/16601096?c=18.34,0,0,0,dh"
          target="_blank"
          rel="noreferrer"
        >
          <Footer_location className="w-6 h-6" />
          <p className="text-sm">
            #904 Room, 104 Building, UNIST, 50-gil, Eonyang-eup, Ulju-gun, Ulsan, S.Korea
          </p>
        </a>
        <div className="flex items-center gap-[10px]">
          <Footer_phone className="w-6 h-6" />
          <a className="text-sm" href="tel:+82-52-217-2714">
            +82-52-217-2714
          </a>
        </div>
        <div className="flex items-center gap-[10px]">
          <Footer_email className="w-6 h-6" />
          <a className="text-sm" href="mailto:kmyung@unist.ac.kr">
            kmyung@unist.ac.kr
          </a>
        </div>
      </div>
      <Footer_logo alt="" />
    </footer>
  );
};

export default Footer;
