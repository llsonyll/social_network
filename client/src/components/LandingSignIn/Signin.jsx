import React from "react";

import cookie from "js-cookie";
// Icons
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";

// Components
import { Link } from "react-router-dom";

// Hooks
import { useState, useEffect } from "react";

// Dispatch
import { useDispatch } from "react-redux";
import { loginAction } from "../../redux/actions/authActions";


if(cookie.get("token")){
	localStorage.setItem("token",cookie.get("token"))
	cookie.remove("token",{path:"",domain:`.socialn.me`});
  cookie.remove("token",{path:"",domain:`www.socialn.me`});
};

const Signin = ({ setForm }) => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [rememberMe, setRememberMe] = useState(false);
  const handleRememberMeChange = (e) => setRememberMe(e.target.checked);

  let dispatch = useDispatch();

  // Validación de email
  useEffect(() => {
    if (input.email === "") {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email no valid",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }, [input.email]);

  // Validación de Password
  useEffect(() => {
    if (input.password === "") {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    } else if (!/^.{6,25}$/i.test(input.password)) {
      setErrors((prev) => ({
        ...prev,
        password: "The password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }, [input.password]);

  function handleLogin(e) {
    e.preventDefault();
    if (!input.email && !input.password) return;
    if (rememberMe) {
      const storeInfo = {
        email: input.email,
        remember: rememberMe,
      };
      localStorage.setItem("login", JSON.stringify(storeInfo));
    } else {
      localStorage.removeItem("login");
    }

    dispatch(loginAction({ ...input, rememberMe }));
  }

  useEffect(() => {
    const storeInfo = JSON.parse(localStorage.getItem("login"));
    if (storeInfo) {
      setInput({
        ...input,
        email: storeInfo.email,
      });

      setRememberMe(storeInfo.remember);
    }
  }, []);

  return (
    <form onSubmit={handleLogin}>
      <div className="input_container">
        <div className="email_container">
          <label>Email</label>
          <input
            autoComplete="off"
            type="text"
            name="email"
            placeholder="Email"
            value={input.email}
            maxLength='50'
            onChange={(e) => {
              setInput({ ...input, [e.target.name]: e.target.value });
            }}
          />
          {errors.email ? <p className="err_sign">{errors.email}</p> : null}
        </div>
        <div className="password_container">
          <label>Password</label>
          <input
            autoComplete="off"
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            maxLength='20'
            onChange={(e) => {
              setInput({ ...input, [e.target.name]: e.target.value });
            }}
          />
          {errors.password ? (
            <p className="err_sign">{errors.password}</p>
          ) : null}
        </div>
        <div className="checkbox_container mt-5">
          <div className="remember_container">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <span> Remember me </span>
          </div>
          <button
            type="button"
            className="opacity-75 hover:opacity-100 hover:font-semibold"
            onClick={() => setForm("recovery")}
          >
            Forgot your password?
          </button>
        </div>
        <input
          className="on disabled:opacity-75 mt-3"
          type="submit"
          disabled={errors.email || errors.password}
          value="Enviar"
        />

        <div className="orcontinue">
          <div className="line"></div>
          <div className="text_line">Or continue with</div>
          <div className="line"></div>
        </div>
        <div className="social_buttons">
        <a href='https://back.socialn.me/auth/loginGoogle'>
						  <BsGoogle/>
					  </a>
						<a href='https://back.socialn.me/auth/loginFacebook'>
							<AiFillFacebook/>
						</a>
						{/* <a href='http://localhost:3001/auth/loginGithub'>
							<AiOutlineTwitter/>
						</a> */}
        </div>
      </div>
    </form>
  );
};

export default Signin;
