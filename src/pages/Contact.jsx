import { FaMapMarkerAlt } from "react-icons/fa";
import { BsTelephoneFill } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

export const Contact = () => {
  return (
    <div className="contact">
      <div className="contact__row1">
        <h2 className="contact__heading">Contact us</h2>
        <p className="contact__text">If you have any inquires, please contact us via following email or telephone number. Also, feel free to visit our lab!</p>
      </div>
      <div className="contact__row2">
        <div className="contact__option contact__option--adress">
          <FaMapMarkerAlt className="contact__icon contact__icon--map" />
          <div className="contact__sub">Adress</div>
          <p className="contact__paragraph">#904 Room, 104 Building, UNIST, 50-gil, Eonyang-eup, Ulju-gun, Ulsan, S.Korea</p>
        </div>
        <div className="contact__option contact__option--phone">
          <BsTelephoneFill className="contact__icon contact__icon--phone" />
          <div className="contact__sub">Telephone</div>
          <p className="contact__paragraph">+82-52-217-2714</p>
        </div>
        <div className="contact__option contact__option--email">
          <AiOutlineMail className="contact__icon contact__icon--email" />
          <div className="contact__sub">Email</div>
          <p className="contact__paragraph">kmyung@unist.ac.kr</p>
        </div>
      </div>
      <div className="contact__logo-box">
        <img src="/img/logo-mini.jpg" alt="" className="contact__logo" />
        <img src="/img/unist.jpg" alt="" className="contact__logo" />
      </div>
    </div>
  );
};
