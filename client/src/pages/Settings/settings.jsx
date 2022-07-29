import React,{useEffect} from 'react'
import {Link} from 'react-router-dom'
import './settings.css'
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import {createNewReview, getAllReviewes, deleteReview, modifyReview} from '../../redux/actions/reviewAction'

function settings() {
    const dispatch = useDispatch()

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(5)

    const _id = useSelector(state => state.auth.loggedUser._id)
    const userData = useSelector((state) => state.user.userProfileData);
    const arrOfReviews = useSelector(state => state.review.allReviewes)
    //busco el id del user entre el arr de todos los reviews
    let userReview = arrOfReviews.find(r => r.userId._id === _id)
    console.log(userReview);

    useEffect(() => {
        dispatch(getAllReviewes())
    }, [])

    

    // const _id = useSelector(state => state.auth.loggedUser._id)
    // const userData = useSelector((state) => state.user.userProfileData);


   // const arrOfReviews = useSelector(state => state.review.allreviewes)
    // const dispatch = useDispatch()


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
        if (!userReview && review.length > 10 && review.length < 70 ) {
             dispatch(createNewReview (_id, {
                description:  review,
                stars: parseInt(stars)
            }))
            setTimeout(() => {
                dispatch(getAllReviewes())
              }, "500")
            
        } else if (userReview && review.length > 10 && review.length < 70) {
            alert('You already have a review, edit it or delete it to change it')
        } 
        else {
            alert('You can only have 1 review, the review should be between 10 and 50 characters long and you should select a star number for the app. If you want to edit your review, fill the inputs again and click on the button "Edit review". Or, you can delete your review too.')
        }
    }
    const handleEditReview = async (e) => {
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
           alert('You can only have 1 review, the review should be between 10 and 50 characters long and you should select a star number for the app. If you want to edit your review, fill all the inputs again and click on the button "Edit review".')
       } 
    }
    const handleDeleteReview = async (e) => {
        e.preventDefault(e)
        dispatch(deleteReview(_id, userReview._id))
        setTimeout(() => {
            dispatch(getAllReviewes())
        }, "500")
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
            <button className='deleteaccount redbutton'>Delete account forever</button>

        </div>
    </div>
  )
}

export default settings