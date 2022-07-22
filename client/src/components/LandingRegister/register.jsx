import React from "react";

//iconos
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import {AiFillCheckCircle} from 'react-icons/ai'
import {FaTimesCircle} from 'react-icons/fa'

//Hooks
import { useState } from "react";
import { useDispatch } from "react-redux";
//Redux register Action
import { registerAction } from "../../redux/actions/authActions";


const Register = () => {

  const [input , setInput] = useState({
    fullname:'' , lastname:'',
    username:'',
    email: '',
    password :''
  })

  let dispatch = useDispatch()

  let errores = {}
  //validacion de nombre
  if (input.fullname === '') {
    errores.fullname = 'Name is required'
  } else if(!/^[a-zA-ZÀ-ÿ\s]{3,10}$/i.test(input.fullname)) {
    errores.fullname = 'Name no valited'
  }
  //validacion de Lastname
  if (input.lastname === '') {
    errores.lastname = 'Last name is required'
  } else if(!/^[a-zA-ZÀ-ÿ\s]{2,10}$/i.test(input.lastname)) {
    errores.lastname = 'Last name no valited'
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

  //validacion de Username
  if (input.username === '') {
    errores.username = 'Username is required'
  } else if(!/^.{4,15}$/i.test(input.username)) {
    errores.username = 'The username must be at least 4 characters'
  } else if(input.username.length > 13){
    errores.username = 'The username cannot be more than 13 characters'
  }

  //Register
	function handleRegister(){
		dispatch(registerAction({
      firstname: input.fullname,
      lastname: input.lastname,
      password: input.password,
      email: input.email,
      username: input.username
    }))
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
        <div className="fullName_container">
          
            <input type="text" name="username" id="" placeholder="Username" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}         />
              { 
                !errores.username && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.username ? <p>{errores.username}</p> : null
            }
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
        <button className="on" type="button" disabled={errores.fullname || errores.lastname|| errores.email || errores.password ||errores.username} onClick={handleRegister}>
          Create account
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
