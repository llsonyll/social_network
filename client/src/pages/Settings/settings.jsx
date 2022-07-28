import React,{useEffect} from 'react'
import {Link} from 'react-router-dom'
import './settings.css'
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import {createNewReview, getAllReviewes} from '../../redux/actions/reviewAction'

function settings() {

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(5)

    useEffect(() => {
        dispatch(getAllReviewes())
    }, [])
    

    const _id = useSelector(state => state.auth.loggedUser._id)
    const userData = useSelector((state) => state.user.userProfileData);


   // const arrOfReviews = useSelector(state => state.review.allreviewes)
    const dispatch = useDispatch()

    const handleSendReview =(e) => {
        e.preventDefault()
        setReview(e.target.value)
    }
    const handleSelectStars=(e)=>{
        e.preventDefault()
        setStars(e.target.value)
    }
    const handleSubmitReview = async (e) => {
        e.preventDefault()
        console.log('send review button clicked');
 
        if (review.length > 10 && review.length < 60 && stars !== 0) {
             dispatch(createNewReview (_id, {
                description:  review,
                stars: stars
            }))

        } else {
            alert('You can only have 1 review, the review should be between 10 and 50 characters long and you should select a star number for the app. If you want to change your review, delete the previous one first.')
        }
    }
    const handleEditReview = async (e) => {

    }
    const handleDeleteReview = async (e) => {

    }

    


  return (
    <div className='settings-container'>


    <div className='settings'>    
        <div className='g-settings boldtext'>General Settings</div>
            <div className='changepass boldtext'>Change password</div>
            <div className='oldpass'>Old password</div>
            <input className='oldpassinput'></input>
            <div className='newpass'>New password</div>
            <input className='newpassinput'></input>
            <div className='confirmpass'>Confirm new password</div>
            <input className='confirmpassinput'></input>
            <div className='premiumacc boldtext'>Make account premium</div>
            <div className='premiumtext'>With premium you'll get access to make your profile private and to see the dislikes in your posts.</div>
            <div className='privateacc boldtext'>Make account private</div>
            <div className='privatetext'>With premium you'll get access to make your profile private and to see the dislikes in your posts.</div>
            <button className='changepassbutton greenbutton'>Change password</button>
            <Link to={`/home/premium/${_id}`} className='buypremiumbutton'>
                <button className='buypremiumbutton greenbutton'>Buy premium</button>
            </Link>
            <button className='makeprivate greenbutton'>Make private</button>
            <div className='review boldtext' >Review the app</div>
            <div className='currentreviewtext'>Current review</div>
            <div className='currentreview'>You havent revieved the app</div>
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
            <button className='editreviewbutton greenbutton'
                    onClick={e => handleEditReview(e) }
            >Edit review</button>
             <button className='deletereviewbutton redbutton'
                    onClick={e => handleDeleteReview(e) }
            >Delete review</button>
            
            <button className='deleteaccount redbutton'>Delete account forever</button>

        </div>
    </div>
  )
}

export default settings