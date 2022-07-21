import React from "react";

//iconos
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import {AiFillCheckCircle} from 'react-icons/ai'
import {FaTimesCircle} from 'react-icons/fa'

//Hooks
import { useState } from "react";


const Register = () => {

  const [input , setInput] = useState({
    fullname:'' , lastname:'',
    email: '',
    password :''
  })


  let errores = {}
  //validacion de nombre
  if (input.fullname === '') {
    errores.fullname = 'Name is required'
  } else if(!/^[a-zA-ZÀ-ÿ\s]{3,10}$/i.test(input.fullname)) {
    errores.fullname = 'Name novalited'
  }
  //validacion de Lastname
  if (input.lastname === '') {
    errores.lastname = 'Lastname is required'
  } else if(!/^[a-zA-ZÀ-ÿ\s]{2,10}$/i.test(input.lastname)) {
    errores.lastname = 'Lastname novalited'
  }
  // validacion de email
  if (input.email === '') {
    errores.email = 'Email is required'
  }
  else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input.email)) {
    errores.email = 'Email no valited'
  }
  //validacion de Password
  if (input.password === '') {
    errores.password = 'Password is required'
  } else if(!/^.{6,25}$/i.test(input.password)) {
    errores.password = 'The password must be at least 6 characters'
  }

  return (
    <>
      <div className="input_container">
        <div className="register_buttons">
          <div className="fullName_container">
          
            <input type="text" name="fullname" id="" placeholder="Name" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}         />
              { 
                !errores.fullname && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.fullname ? <p>{errores.fullname}</p> : null
            }
          </div>
          <div className="lastName_container">
            
            <input type="text" name="lastname" id="" placeholder="Last name" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}  />
            { 
                !errores.lastname && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.lastname ?  <p>{errores.lastname}</p> : null
            }
          </div>
        </div>
        <div className="email_container">
        
          <input type="text" name="email" id="" placeholder="example@example.com" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}  />
            { 
                !errores.email && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.email ? <p>{errores.email}</p> : null
            }
        </div>
        <div className="password_container">
        
          <input type="password" name="password" id="" placeholder="Password" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}  />
          { 
                !errores.password && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.password ?  <p>{errores.password}</p> : null
            }
        </div>
        <button className="on" type="submit" disabled={errores.fullname || errores.lastname|| errores.email || errores.password}>
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
