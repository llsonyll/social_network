import React from 'react'


//iconos
import {BsGoogle} from 'react-icons/bs'
import {AiFillFacebook} from 'react-icons/ai'
import {AiOutlineTwitter} from 'react-icons/ai'

//componentes 
import {Link} from 'react-router-dom'

//Hooks
import { useState } from 'react'
//Dispatch
import {useDispatch} from 'react-redux'
import { loginAction } from '../../redux/actions/authActions'

const Signin = () => {
	const [input , setInput] = useState({
		email: '',
		password :''
	})

	let errores = {}

  // llamo al dispatch	
	let dispatch = useDispatch()

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

	//Login
	function handleLogin(){
		dispatch(loginAction(input))
	}

  return (
        <>
				<div className='input_container'>
				
					<div className='email_container'>
						<label htmlFor=''>Email</label>
						<input type='text' name='email' id='' placeholder='Email' onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}/>
						{
						errores.email ?  <p className='err_sign'>{errores.email}</p> : null
						}
					</div>
					<div className='password_container'>
						<label htmlFor=''>Password</label>
						<input type='password' name='password' id='' placeholder='Password' onChange={(e) => {setInput({...input , [e.target.name] : e.target.value})}}/>
						{
						errores.password ?  <p className='err_sign'>{errores.password}</p> : null
						}
					</div>
					<div className='checkbox_container'>
						<div className='remember_container'>
							<input type="checkbox" name="" id="" /> 
							<span>Remember me</span>
						</div>
						<Link to=''>Forgot your password?</Link>
					</div>
					<button className='on' type='button' disabled={errores.email||errores.password} onClick={handleLogin}>
						Sign in
					</button>
					<div className='orcontinue'>
						<div className='line'></div>
						<div className='text_line'>Or continue with</div>
						<div className='line'></div>
					</div>
					<div className='social_buttons'>
						<button>
							<BsGoogle/>
						</button>
						<button>
							<AiFillFacebook/>
						</button>
						<button>
							<AiOutlineTwitter/>
						</button>
					</div>
			</div>
		</>
  )
}

export default Signin