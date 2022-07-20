import React from 'react'

//logo
import Logo from '../../../assets/LogoSN.png'

//iconos
import {BsGoogle} from 'react-icons/bs'
import {AiFillFacebook} from 'react-icons/ai'
import {AiOutlineTwitter} from 'react-icons/ai'

//componentes 
import {Link} from 'react-router-dom'


const Signin = () => {
  return (
        <>
				<div className='input_container'>
				
					<div className='email_container'>
						<label htmlFor=''>Email</label>
						<input type='text' name='' id='' placeholder='Email'/>
					</div>
					<div className='password_container'>
						<label htmlFor=''>Password</label>
						<input type='password' name='' id='' placeholder='Password'/>
					</div>
					<div className='checkbox_container'>
						<div className='remember_container'>
							<input type="checkbox" name="" id="" /> 
							<span>Remember me</span>
						</div>
						<Link to=''>Forgot your password?</Link>
					</div>
					<button className='on' type='submit'>
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