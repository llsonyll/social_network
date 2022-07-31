import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'

import './Notifications.css'

let arrDatos = [
    {
        username: 'pepo',
        notifyContent: 'te envio un mensaje'
    },
    {
        username: 'pepo',
        notifyContent: 'te envio un mensaje'
    },
    {
        username: 'pepo',
        notifyContent: 'te envio un mensaje'
    },
   
]

const Notifications = () => {
  return (
    <div className='notifications-father_container'> 
        <div className='notifications_container'>
            {
                arrDatos ? 
                arrDatos.map((user) => {
                    return(
                        <div className='notify_container'>
                            <div className='notify-avatar_container'>
                                <Link to=''>
                                    <Avatar imgUrl={user.profilePicture} size="xl" />
                                </Link>
                            </div>                      
                            <div className='notify-info_container'>
                                <Link to=''>
                                    <span>{user.username}</span>
                                </Link>
                                <p>{user.username} {user.notifyContent}</p>
                            </div>
                        </div>
                    )
                }) : null 
            }
        </div>
    </div>
  )
}

export default Notifications