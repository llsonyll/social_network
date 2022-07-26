import React from "react";

//iconos
import { BsGoogle } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import {AiFillCheckCircle} from 'react-icons/ai'


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
  } else if(/[\W\d\s]/.test(input.fullname)) {
    errores.fullname = 'Name no valited'
  }else if(input.fullname.length < 3 || input.fullname.length > 25) {
    errores.fullname = 'Name can be between 3 and 25 characters'
  }
  //validacion de Lastname
  if (input.lastname === '') {
    errores.lastname = 'Last name is required'
  } else if(/[\W\d\s]/.test(input.lastname)) {
    errores.lastname = 'Last name no valited'
  }else if(input.lastname.length < 3 || input.lastname.length > 25) {
    errores.lastname = 'Surname can be between 3 and 25 characters'
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
  } else if(/[\s]/.test(input.username)) {
    errores.username = 'Username no valited'
  } else if(input.username.length < 3||input.username.length > 15){
    errores.username = 'Username cannot be more than 15 characters'
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
          
            <input autoComplete='off' type="text" name="fullname"  placeholder="Name" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}         />
              { 
                !errores.fullname && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.fullname ? <p>{errores.fullname}</p> : null
            }
          </div>
          <div className="lastName_container">
            
            <input autoComplete='off' type="text" name="lastname"  placeholder="Last name" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}  />
            { 
                !errores.lastname && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.lastname ?  <p>{errores.lastname}</p> : null
            }
          </div>
        </div>
        <div className="fullName_container">
          
            <input autoComplete='off' type="text" name="username"  placeholder="Username" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}         />
              { 
                !errores.username && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.username ? <p>{errores.username}</p> : null
            }
          </div>
        <div className="email_container">
        
          <input autoComplete='off' type="text" name="email"  placeholder="example@example.com" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}  />
            { 
                !errores.email && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.email ? <p>{errores.email}</p> : null
            }
        </div>
        <div className="password_container">
        
          <input autoComplete='off' type="password" name="password" placeholder="Password" onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}  />
          { 
                !errores.password && <span><AiFillCheckCircle className="icon_ok"/> </span>
              }
            {
              errores.password ?  <p>{errores.password}</p> : null
            }
        </div>
        <button className="on" type="button"   disabled={errores.fullname || errores.lastname|| errores.email || errores.password ||errores.username} onClick={handleRegister}>
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
