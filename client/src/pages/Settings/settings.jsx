import React,{useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './settings.css'
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import {createNewReview, getAllReviewes, deleteReview, modifyReview} from '../../redux/actions/reviewAction'
import { changePassword, getUserProfile, deleteUser} from '../../redux/actions/userActions'
import { privacityChange } from '../../redux/actions/premiumAction'
import { errorAlerts, goodAlerts } from "../../utils/SweetAlertTypes/SweetAlerts";
import { logOutUser } from "../../redux/reducers/authReducer.slice";
function settings() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(5)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const _id = useSelector(state => state.auth.loggedUser._id)
    //console.log(_id);
    const userData = useSelector((state) => state.user.userProfileData);
    //console.log(userData);
    const arrOfReviews = useSelector(state => state.review.allReviewes)
    //busco el id del user entre el arr de todos los reviews
    let userReview = arrOfReviews.find(r => r.userId._id === _id)
    //console.log(userReview);

    useEffect(() => {
        dispatch(getAllReviewes());
        dispatch(getUserProfile(_id))
    }, [_id])//Se deja el id aqui, porque en la primera renderizada le llega undefined al segundo dispatch... 
    const handleSendReview =(e) => {
        e.preventDefault()
        setReview(e.target.value)
    }
    const handleSelectStars=(e)=>{
        e.preventDefault()
        setStars(e.target.value)
    }
    const handleSubmitReview = (e) => {
        e.preventDefault()
        console.log('send review button clicked');
        if (!userReview && review.length > 5 && review.length < 70 && stars > 0) {
             dispatch(createNewReview (_id, {
                description:  review,
                stars: parseInt(stars)
            }))
            setTimeout(() => {
                dispatch(getAllReviewes())
              }, "500")
            
        } else if (userReview) {
            errorAlerts('You already have a review, edit it or delete it to change it')
        } 
        else {
            errorAlerts('The review should be between 10 and 50 characters long.')
        }
    }
    const handleEditReview =  (e) => {
        e.preventDefault(e)
        if (review.length > 10 && review.length < 70) {
            dispatch(modifyReview (_id, userReview._id, {
               description:  review,
               stars: parseInt(stars)
           }))
           setTimeout(() => {
            dispatch(getAllReviewes())
        }, "500")

       } else {
        errorAlerts('The review should be between 10 and 50 characters long. If you want to edit your review, write a different one and fill all the inputs again, then click "Edit review".')
       } 
    }
    const handleDeleteReview =  (e) => {
        e.preventDefault(e)
        dispatch(deleteReview(_id, userReview._id))
        setTimeout(() => {
            dispatch(getAllReviewes())
        }, "500")
        goodAlerts('Review deleted')
    }
    let reviewRenderer =()=>{
        if (userReview){
            return <div className='currentreview'>  {userReview.stars}★{' '}{userReview.description} </div>
        }
        if (!userReview){
            return (
                setTimeout(() => {
                    <div className='currentreview'>You havent revieved the app</div>
                }, "500")
    
            )
    }
    }  
    let handleChangeOldPass =( e ) =>{
        e.preventDefault() 
        setOldPassword(e.target.value)
    }
    let handleChangeNewPass =( e ) =>{
        e.preventDefault() 
        setNewPassword(e.target.value)
    }
    let handleChangeConfirmPass =( e ) =>{
        e.preventDefault() 
        setConfirmPassword(e.target.value)
    }
    let handleSubmitToUpdatePassword = ( e ) =>{
        e.preventDefault() 
        if ( oldPassword.length > 6 && newPassword  === confirmPassword && newPassword.length > 6  && confirmPassword.length > 6) {
            dispatch(changePassword(oldPassword, newPassword, _id))
            goodAlerts('Your password changed')
        }
        else {
            errorAlerts('Your password should have more than 6 characters. Fill all the password inputs with correct data before submitting.')
        }
    }

    let handleMakePrivate = (e) => {
        e.preventDefault() 
        if (userData.isPremium === true && userData.isPrivate === false) {
            dispatch(privacityChange(_id));
            //console.log('se envio make private action')
            goodAlerts('Your profile is private now!!!') 
            navigate(`/home/profile/${_id}`, { replace: true })
        }
        if (userData.isPremium === true && userData.isPrivate === true) {
            dispatch(privacityChange(_id));
            //console.log('se envio make private action')
            goodAlerts('Your profile is public now!!!') 
            navigate(`/home/profile/${_id}`, { replace: true })
        }
        if (userData.isPremium === false) {
            errorAlerts('You are not premium yet')
            navigate(`/home/premium/${_id}`, { replace: true })
        }
    }


let handleDeleteUser = (e) =>{
    e.preventDefault()
    dispatch(deleteUser(_id))
    goodAlerts('You successfully deleted your account, see you next time <3')
    dispatch(logOutUser())
    navigate(`/`)
}

  return (
    <div className='settings-container'>


    <div className='settings'>    
        <div className='g-settings boldtext'>General Settings</div>
            <div className='changepass boldtext'>Change password</div>
                <div className='oldpass'>Old password</div>
                <input className='oldpassinput' onChange={e=> handleChangeOldPass(e)}></input>
                <div className='newpass'>New password</div>
                <input className='newpassinput' onChange={e=> handleChangeNewPass(e)}></input>
                <div className='confirmpass'>Confirm new password</div>
                <input className='confirmpassinput' onChange={e=> handleChangeConfirmPass(e)}></input>
            <div className='premiumacc boldtext'>Make account premium</div>
            <div className='premiumtext'>With premium you'll get access to make your profile private and to see the dislikes in your posts.</div>
            <div className='privateacc boldtext'>Make account private</div>
            <div className='privatetext'>With premium you'll get access to make your profile private and to see the dislikes in your posts.</div>
            <button className='changepassbutton greenbutton'

            onClick={e => handleSubmitToUpdatePassword(e)}>Change password</button>

            <Link to={`/home/premium/${_id}`} className='buypremiumbutton'>
                <button className='buypremiumbutton greenbutton'>Buy premium</button>
            </Link>
            <button className='makeprivate greenbutton' onClick={e => handleMakePrivate(e)}>{userData.isPrivate === false ? 'Make private' :'Make public'} </button>
            <div className='review boldtext' >Review the app</div>
            <div className='currentreviewtext'>Current review</div>
            {reviewRenderer()}


            <div className='newreview'>New review</div>
            <input className='newreviewinput'
                    onChange={e => handleSendReview(e)}></input>
            <div className='stars'>Stars</div>
            <select className='selectstars' size='1' onChange={ e => handleSelectStars(e) }> \
            <option className='boldtext'  value={"Pick a number"}>Pick a number</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            </select>

            <button className='reviewbutton greenbutton'
                    onClick={e => handleSubmitReview(e) }
            >Send review</button>
              {userReview ? <button className='editreviewbutton greenbutton'
                        onClick={e => handleEditReview(e) }
                >Edit review</button> : null
            }
             { userReview ? <button className='deletereviewbutton redbutton'
                    onClick={e => handleDeleteReview(e) }
            >Delete current review</button>
            :
            null}
            <button className='deleteaccount redbutton' onClick={handleDeleteUser}>Delete account forever</button>

        </div>
    </div>
  )
}

export default settings