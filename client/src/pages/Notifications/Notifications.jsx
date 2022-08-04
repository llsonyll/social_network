import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import { setSeenNotifications } from '../../redux/actions/notificationActions'

import './Notifications.css'


const Notifications = () => {
    const notifications = useSelector(store => store.notification.notifications)
    const loggedUser = useSelector(store => store.auth.loggedUser)
    let dispatch = useDispatch()

    useEffect(()=>{
        return (()=> {
            dispatch(setSeenNotifications(loggedUser._id))
        })
    }, [])

  return (
    <div className='notifications-father_container'> 
        <div className='notifications_container'>
            {
                notifications ? 
                notifications.map((notification) => {
                    let link ;
                    if (notification.type === 'like' || notification.type === 'comment'){
                        link = `/home/post/${notification.refId}`
                    }else if(notification.type === 'follow'){
                        link = `/home/profile/${notification.refId}`
                    }else if(notification.type === 'message'){
                        link = `/home/messages/${notification.refId}`
                    }
                    return(
                        <Link to={link}>
                        <div className='notify_container'>
                            <div className='notify-avatar_container'>
                                <Link to={`/home/profile/${notification.from._id}`}>
                                    <Avatar imgUrl={notification.from.profilePicture} size="xl" />
                                </Link>
                            </div>
                            <div className='notify-info_container'>
                                <Link to={`/home/profile/${notification.from._id}`}>
                                    <span>{notification.from.username}</span>
                                </Link>
                                <p>{notification.content}</p>
                            </div>  
                        </div>
                        </Link>
                    )
                }) : null 
            }
        </div>
    </div>
  )
}

export default Notifications