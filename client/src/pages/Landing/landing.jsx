import "./landing.css";
import PasswordRecovery from "../../components/PasswordRecovery";
import { useState } from "react";
import {useDispatch, useSelector } from 'react-redux'
import { getAllReviewes } from '../../redux/actions/reviewAction'
//iconos
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
//logo
import Logo from "../../../assets/LogoSN.png";
//componentes
import Register from "../../components/LandingRegister";
import Signin from "../../components/LandingSignIn";
//elementos html


const Landing = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((store) => store.auth.loggedUser);
  const arrOfReviews = useSelector(state => state.review.allReviewes);
  const navigate = useNavigate();

  const [form, setForm] = useState("Sign in");
  //const [reviewToShow, setReviewToShow] = useState();
  

  useEffect(() => {
      dispatch(getAllReviewes())
  }, [])

 useEffect(() => {
    if (loggedUser._id) {
      navigate("/home");
    }
  }, [loggedUser]);
  

  const handleChangeCheck = () => {
    if (form === "Sign in") {
      setForm("Register");
    }
    if (form === "Register") {
      setForm("Sign in");
    }
  };
  


  let showReviews = ( ) =>{
      let arrOfReviewsToShow = arrOfReviews?.filter(r => r.stars >= 4 )
      //console.log(arrOfReviewsToShow);
      let reviewObj = arrOfReviewsToShow[Math.floor(Math.random()*arrOfReviewsToShow.length)]
      if (!reviewObj || reviewObj === undefined) {
        dispatch(getAllReviewes())
      }
      return (
      <div className="sn_review">
      <div className="star">
        <AiFillStar />
        <span>{reviewObj.stars}</span>
      </div>
      <div>
        <h3>{ reviewObj.userId.firstname +' '+ reviewObj.userId.lastname}</h3>
        <p>
          {reviewObj.description}
        </p>
      </div>
    </div>
      )
  }



  return (
    <div className="landing_container">
      {form === "recovery" ? (
        <PasswordRecovery goBack={() => setForm("Sign in")} />
      ) : (
        <>
          <div className="wrap_toggle">
            <input id="toggle" type="checkbox" onClick={handleChangeCheck} />
            <label className="switch" htmlFor="toggle"></label>
            <div className="text_toggle">
              <p
                className={form === "Sign in" ? "text-white" : "text-gray-500"}
              >
                Sign in
              </p>
              <img src={Logo} alt="" />
              <p
                className={form === "Sign in" ? "text-gray-500" : "text-white"}
              >
                Sign up
              </p>
            </div>
          </div>

      {/* Componente de Sign in / Register  */}
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
        {form === "Sign in" ? <Signin setForm={setForm}/> : <Register />}
      </div>
            { arrOfReviews.length > 0 ?  showReviews() :null }

    </div>
  );
};

export default Landing;
