import "./landing.css";
import { Link } from "react-router-dom";

//Logo
import Logo from "../../../assets/LogoSN.png";

//iconos
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";

const Landing = () => {
  return (
    <div className="landing_container">
      <div className="wrap_toggle">
        <input id="toggle" type="checkbox" name="" />
        <label for="toggle" className="switch" htmlFor="toggle"></label>
        <div className="text_toggle">
          <p>Sign in</p>
          <img src={Logo} alt="" />
          <p className="register_text">Register</p>
        </div>
      </div>
      <form action="">
        <div className="logo">
          <img src={Logo} alt="" />
          <h1>Sign in now</h1>
        </div>
        <div className="input_container">
          <div className="buttons_container">
            <button>Sign in</button>
            <button>Register</button>
          </div>
          <div className="email_container">
            <label htmlFor="">Email</label>
            <input type="text" name="" id="" placeholder="Email" />
          </div>
          <div className="password_container">
            <label htmlFor="">Password</label>
            <input type="password" name="" id="" placeholder="Password" />
          </div>
          <div className="checkbox_container">
            <div className="remember_container">
              <input type="checkbox" name="" id="" />
              <span>Remember me</span>
            </div>
            <Link to="">Forgot your password?</Link>
          </div>
          <button className="on" type="submit">
            Sign in
          </button>
          <div className="orcontinue">
            <div className="line"></div>
            <div className="text_line">Or continue with</div>
            <div className="line"></div>
          </div>
          <div className="social_buttons">
            <button>
              <BsGoogle />
            </button>
            <button>
              <AiFillFacebook />
            </button>
            <button>
              <AiOutlineTwitter />
            </button>
          </div>
        </div>
      </form>
      <div className="sn_review">
        <div className="star">
          <AiFillStar />
          <span>5</span>
        </div>
        <div>
          <h3>Sundar Pichai</h3>
          <p>
            "This is the app that I've found to create long lasting
            relationships"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
