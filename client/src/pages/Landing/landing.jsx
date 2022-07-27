import "./landing.css";

//componentes
import Register from "../../components/LandingRegister";
import Signin from "../../components/LandingSignIn";

import { useState } from "react";

//logo
import Logo from "../../../assets/LogoSN.png";
//iconos
import { AiFillStar } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//elementos html
const Landing = () => {
  const loggedUser = useSelector((store) => store.auth.loggedUser);
  const navigate = useNavigate();

  const [form, setForm] = useState("Sign in");

  const handleChangeCheck = () => {
    if (form === "Sign in") {
      setForm("Register");
    }
    if (form === "Register") {
      setForm("Sign in");
    }
  };

  useEffect(() => {
    if (loggedUser._id) {
      navigate("/home");
    }
  }, [loggedUser]);

  return (
    <div className="landing_container">
      <div className="wrap_toggle">
        <input id="toggle" type="checkbox" onClick={handleChangeCheck} />
        <label className="switch" htmlFor="toggle"></label>
        <div className="text_toggle">
          <p className={form === "Sign in" ? "text-white" : "text-gray-500"}>
            Sign in
          </p>
          <img src={Logo} alt="" />
          <p className={form === "Sign in" ? "text-gray-500" : "text-white"}>
            Sign up
          </p>
        </div>
      </div>

      <div className="form">
        <div className="buttons_container">
          <button
            className={form === "Sign in" ? "bg-[#416b3f]" : "bg-[#363636]"}
            type="button"
            onClick={() => setForm("Sign in")}
          >
            Sign in
          </button>
          <button
            className={form === "Sign in" ? "bg-[#363636]" : "bg-[#416b3f]"}
            type="button"
            onClick={() => setForm("Register")}
          >
            Sign up
          </button>
        </div>
        <div className="logo">
          <img src={Logo} alt="Social Network Logo" />
          <h1>
            <i>Social Network</i>
          </h1>
        </div>
        {form === "Sign in" ? <Signin /> : <Register />}
      </div>

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
