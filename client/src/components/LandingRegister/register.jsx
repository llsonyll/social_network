import React from "react";

//iconos
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";

//Hooks
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

//Redux register Action
import { registerAction } from "../../redux/actions/authActions";
import { Link } from "react-router-dom";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  let dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    //validacion de nombre
    if (input.fullname === "") {
      setErrors((prev) => ({
        ...prev,
        fullname: "Name is required",
      }));
    } else if (/[\W\d\s]/.test(input.fullname)) {
      setErrors((prev) => ({
        ...prev,
        fullname: "Name no validated",
      }));
    } else if (input.fullname.length < 3 || input.fullname.length > 25) {
      setErrors((prev) => ({
        ...prev,
        fullname: "Name can be between 3 and 25 characters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        fullname: "",
      }));
    }
  }, [input.fullname]);

  useEffect(() => {
    //validacion de Lastname
    if (input.lastname === "") {
      setErrors((prev) => ({
        ...prev,
        lastname: "Last name is required",
      }));
    } else if (/[\W\d\s]/.test(input.lastname)) {
      setErrors((prev) => ({
        ...prev,
        lastname: "Last name no validated",
      }));
    } else if (input.lastname.length < 3 || input.lastname.length > 25) {
      setErrors((prev) => ({
        ...prev,
        lastname: "Surname can be between 3 and 25 characters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lastname: "",
      }));
    }
  }, [input.lastname]);

  useEffect(() => {
    // validacion de email
    if (input.email === "") {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email no validated",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }, [input.email]);

  useEffect(() => {
    //validacion de Password
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

  useEffect(() => {
    //validacion de Username
    if (input.username === "") {
      setErrors((prev) => ({
        ...prev,
        username: "Username is required",
      }));
    } else if (/[\s]/.test(input.username)) {
      setErrors((prev) => ({
        ...prev,
        username: "Username no validated",
      }));
    } else if (input.username.length < 3 || input.username.length > 15) {
      setErrors((prev) => ({
        ...prev,
        username: "Username cannot be more than 15 characters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        username: "",
      }));
    }
  }, [input.username]);

  //Register
  function handleRegister(e) {
    e.preventDefault();
    const { fullname, lastname, password, email, username } = input;
    if (!fullname || !lastname || !password || !email || !username) return;
    if (
      errors.fullname ||
      errors.lastname ||
      errors.email ||
      errors.password ||
      errors.username
    )
      return;

    dispatch(
      registerAction({
        firstname: fullname,
        lastname: lastname,
        password: password,
        email: email,
        username: username,
      })
    );
  }

  return (
    <form onSubmit={handleRegister}>
      <div className="input_container">
        <div className="register_buttons">
          <div className="fullName_container">
            <input
              autoComplete="off"
              type="text"
              name="fullname"
              placeholder="Name"
              value={input.fullname}
              onChange={(e) => {
                setInput({ ...input, [e.target.name]: e.target.value });
              }}
            />
            {!errors.fullname && (
              <span>
                <AiFillCheckCircle className="icon_ok" />{" "}
              </span>
            )}
            {errors.fullname ? <p>{errors.fullname}</p> : null}
          </div>
          <div className="lastName_container">
            <input
              autoComplete="off"
              type="text"
              name="lastname"
              placeholder="Last name"
              value={input.lastname}
              onChange={(e) => {
                setInput({ ...input, [e.target.name]: e.target.value });
              }}
            />
            {!errors.lastname && (
              <span>
                <AiFillCheckCircle className="icon_ok" />{" "}
              </span>
            )}
            {errors.lastname ? <p>{errors.lastname}</p> : null}
          </div>
        </div>
        <div className="fullName_container">
          <input
            autoComplete="off"
            type="text"
            name="username"
            placeholder="Username"
            value={input.username}
            onChange={(e) => {
              setInput({ ...input, [e.target.name]: e.target.value });
            }}
          />
          {!errors.username && (
            <span>
              <AiFillCheckCircle className="icon_ok" />{" "}
            </span>
          )}
          {errors.username ? <p>{errors.username}</p> : null}
        </div>
        <div className="email_container">
          <input
            autoComplete="off"
            type="text"
            name="email"
            placeholder="example@example.com"
            value={input.email}
            onChange={(e) => {
              setInput({ ...input, [e.target.name]: e.target.value });
            }}
          />
          {!errors.email && (
            <span>
              <AiFillCheckCircle className="icon_ok" />{" "}
            </span>
          )}
          {errors.email ? <p>{errors.email}</p> : null}
        </div>
        <div className="password_container">
          <input
            autoComplete="off"
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={(e) => {
              setInput({ ...input, [e.target.name]: e.target.value });
            }}
          />
          {!errors.password && (
            <span>
              <AiFillCheckCircle className="icon_ok" />{" "}
            </span>
          )}
          {errors.password ? <p>{errors.password}</p> : null}
        </div>
        <input
          className="on disabled:opacity-75 mt-6 md:mt-4"
          type="submit"
          disabled={
            errors.fullname ||
            errors.lastname ||
            errors.email ||
            errors.password ||
            errors.username
          }
          onClick={handleRegister}
          value="Create account"
        />
        <div className="orcontinue">
          <div className="line"></div>
          <div className="text_line">Or continue with</div>
          <div className="line"></div>
        </div>
        <div className="social_buttons">
          <Link to=''>
          <button>
            <BsGoogle />
          </button>
          </Link>
          <Link to=''>
          <button>
            <AiFillFacebook />
          </button>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Register;
