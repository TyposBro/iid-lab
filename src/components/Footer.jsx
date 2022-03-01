import { FaMapMarkerAlt } from "react-icons/fa";
import { BsTelephoneFill, BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
export const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__sections footer__sections--iid">
        <h3 className="footer__sections-header">IID Lab</h3>
        <ul className="footer__list">
          <li className="footer__item">
            <a href="/intro" className="footer__link">
              Introduction
            </a>
          </li>
          <li className="footer__item">
            <a href="/tracks" className="footer__link">
              Research Tracks
            </a>
          </li>
          <li className="footer__item">
            <a href="/about" className="footer__link">
              About us
            </a>
          </li>
          <li className="footer__item">
            <a href="/news" className="footer__link">
              News
            </a>
          </li>
        </ul>
      </div>
      <div className="footer__sections footer__sections--social">
        <h3 className="footer__sections-header">Social</h3>
        <ul className="footer__list">
          <li className="footer__item">
            <BsFacebook className="footer__icon footer__icon--fb" />
            <a href="/fb" className="footer__link">
              Facebook
            </a>
          </li>
          <li className="footer__item">
            <BsInstagram className="footer__icon footer__icon--instagram" />

            <a href="/insta" className="footer__link">
              Instagram
            </a>
          </li>
          <li className="footer__item">
            <BsYoutube className="footer__icon footer__icon--youtube" />

            <a href="/yt" className="footer__link">
              YouTube
            </a>
          </li>
        </ul>
      </div>
      <div className="footer__sections footer__sections--work">
        <h3 className="footer__sections-header">Our Work</h3>
        <ul className="footer__list">
          <li className="footer__item">
            <a href="/yt" className="footer__link">
              Projects
            </a>
          </li>
          <li className="footer__item">
            <a href="/yt" className="footer__link">
              Publications
            </a>
          </li>
        </ul>
      </div>
      <div className="footer__sections footer__sections--achievemnts">
        <h3 className="footer__sections-header">Achievements</h3>
        <ul className="footer__list">
          <li className="footer__item">
            <a href="/yt" className="footer__link">
              Awards
            </a>
          </li>
          <li className="footer__item">
            <a href="/yt" className="footer__link">
              Intellectual Propetry
            </a>
          </li>
          <li className="footer__item">
            <a href="/yt" className="footer__link">
              Design&Enterpreneurship
            </a>
          </li>
        </ul>
      </div>
      <div className="footer__sections footer__sections--contact">
        <h3 className="footer__sections-header">Contact Us</h3>
        <ul className="footer__list">
          <li className="footer__item">
            <FaMapMarkerAlt className="footer__icon footer__icon--location" />
            <span href="/yt" className="footer__link">
              UNIST, 50-gil, Eonyang-eup, Ulju-gun, Ulsan, S.Korea
            </span>
          </li>
          <li className="footer__item">
            <BsTelephoneFill className="footer__icon footer__icon--phone" />
            <span href="/yt" className="footer__link">
              +82-52-217-2714
            </span>
          </li>
          <li className="footer__item">
            <AiOutlineMail className="footer__icon footer__icon--email" />
            <span href="/yt" className="footer__link">
              info@iidl.unist.ac.kr
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
