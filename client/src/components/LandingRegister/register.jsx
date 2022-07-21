import React from "react";

//iconos
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";

const Register = () => {
  return (
    <>
      <div className="input_container">
        <div className="register_buttons">
          <div className="fullName_container">
            <label htmlFor="">Name</label>
            <input type="text" name="" id="" placeholder="Name" />
          </div>
          <div className="lastName_container">
            <label htmlFor="">Last name</label>
            <input type="text" name="" id="" placeholder="Last name" />
          </div>
        </div>
        <div className="email_container">
          <label htmlFor="">Email</label>
          <input type="text" name="" id="" placeholder="example@example.com" />
        </div>
        <div className="password_container">
          <label htmlFor="">Password</label>
          <input type="password" name="" id="" placeholder="Password" />
        </div>
        <button className="on" type="submit">
          Create acount
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
    </>
  );
};

export default Register;
