import React from 'react'
import Avatar from '../Avatar'
import './userChats.css'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
//iconos
import {AiOutlineSearch} from 'react-icons/ai'

const UserChats = () => {

    let loggedUser = useSelector(store => store.auth.loggedUser)
    let chats = useSelector(store => store.chat.allChats)
    const[searchChat , setSearchChat] = useState('')

    let getIndex = (array) => {
        if(array[0]._id === loggedUser._id){
            return 1
        }else{
            return 0
        }
    }


  return (
    <div className='chats__user-father'>
        <div className='search__container'>
            <AiOutlineSearch/>
            <input type="text" onChange={(e) => setSearchChat(e.target.value)}/>
        </div>
        <div id='chats-user__container'>
            {
                chats.length ? 
                chats.map((chat) => {
                    return(
                        <Link to={`/home/messages/${chat.users[getIndex(chat.users)]._id}`}>
                            <div className='friend-contact'>
                                <div className='friend-contact__avatar'>
                                    <Avatar imgUrl={chat.users[getIndex(chat.users)].profilePicture}/>
                                </div>
                                <div className='friend-contact__info'>
                                    <span>{chat.users[getIndex(chat.users)].username}</span>
                                </div>
                            </div>
                        </Link>
                    )
                }) :  <span className='no_friends'>No tienes conversaciones:(</span>
            } 
        </div>
    </div>
  )
}

export default UserChats