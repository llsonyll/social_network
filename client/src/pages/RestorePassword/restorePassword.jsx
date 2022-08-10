import React, { useEffect } from 'react'
import { useState } from 'react'
import  logo from '../../../assets/LogoSN.png'
import { errorAlerts, goodAlerts } from '../../utils/SweetAlertTypes/SweetAlerts'
import Cookie from 'js-cookie'
import { useDispatch } from 'react-redux'
import { restoredNewPassword } from '../../redux/actions/userActions'

function RestorePassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [tokenRestore, setTokenRestore] = useState(false); 
    const [ closeTime, setCloseTime ] = useState(0);

    const dispatch = useDispatch();
    
    let timer = () => setTimeout(()=>{
            setCloseTime(closeTime - 1)
         },1000)
    ;

    let  windowsClose = () => setTimeout(()=>{
            window.close("http://localhost:3000/");
        },30000)
    ;

    useEffect(()=>{
       if(Cookie.get("restorePassword")){
        setTokenRestore(Cookie.get("restorePassword"));
        Cookie.remove("restorePassword",{path:"",domain:`.socialn.me`});
        Cookie.remove("restorePassword",{path:"",domain:`www.socialn.me`});
       }else{
         console.log('no hay restoreToken')
       }
       return () => {
        clearTimeout(windowsClose)
        clearTimeout(timer)
       }
    },[])


     useEffect(()=>{
         if(closeTime){
           timer();
         }else{
            console.log(timer);
           clearTimeout(timer);
         }
     },[closeTime])


    const handlePasswordChange = (e) => {
        e.preventDefault()
        setPassword(e.target.value)
    }
    const handleConfirmPasswordChange = (e) => {
        e.preventDefault()
        setConfirmPassword(e.target.value)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        if (password !== confirmPassword) {
            errorAlerts("Passwords are not equal.")
        }
        if (password.length <= 6 || confirmPassword.length <= 6) {
            errorAlerts("Your password can't have less than 6 characters.")
        }
        if (password.length > 6 && confirmPassword.length > 6 && password === confirmPassword && tokenRestore) {
            //despachar accion para cambiar password
            goodAlerts("Your password changed. You can verify your new password in your email. This window will close in 30 seconds.")
            dispatch( restoredNewPassword(tokenRestore,password));
            setCloseTime(30);
            windowsClose(); 
        }
    }
    console.log(closeTime);
  return (
    <div>
    <div className='h-screen w-auto mt-0 sm:p-24 px-0 pb-32  bg-[#212121] '>
    <div className='text-gray-200 flex flex-col items-center'>
    {
      closeTime ? <div className='text-9xl font-extrabold mb-36'>{closeTime}</div> :
      <>         
      <img className='w-48 h-20 center mt-0' src={logo} alt='aaaaaaaa'></img>
                    <div className='text-xl mt-5 mb-10'>Restore your password</div>
                        <input onChange={(e)=>handlePasswordChange(e)} className='focus:ring-indigo-500 max-w-md focus:border-indigo-500 h-12 py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full mb-5 mx-3' maxLength='20' placeholder="Type new password"></input>
                        <input onChange={(e)=>handleConfirmPasswordChange(e)} className='focus:ring-indigo-500 max-w-md focus:border-indigo-500 h-12 py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full' maxLength='20' placeholder="Confirm new password"></input>
                    <div></div>
                <button  onClick={(e)=>handleSubmit(e)} className='bg-[#4E864C] mt-10 rounded-md  w-40 mr-3 p-3 pl-3 pr-3 ml-3'>Change password</button>
                </>
    }
        </div>
    </div>
    </div>
  )
}

export default RestorePassword
