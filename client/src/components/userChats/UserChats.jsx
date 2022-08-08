import React from 'react'
import Avatar from '../Avatar'
import './userChats.css'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
//iconos
import {AiOutlineSearch} from 'react-icons/ai'

const UserChats = ({setMostrarMenu}) => {

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

    let unseenMessagesCounter = (messages) => {
        let returnUnseen = 0
        messages.forEach(message => {
            if(message.from !== loggedUser._id && message.seen === false){
                returnUnseen++
            }
        })
        return returnUnseen
    }


  return (
    <div className='chats__user-father'>
        <div className='search__container'>
            <AiOutlineSearch/>
            <input type="text" onChange={(e) => setSearchChat(e.target.value)} 
            maxLength='20'/>
        </div>
        <div id='chats-user__container'>
            {
                chats.length ? 
                chats.map((chat) => {
                    return(
                        <Link to={`/home/messages/${chat.users[getIndex(chat.users)]._id}`} onClick={() => setMostrarMenu(false)}>
                            <div className='friend-contact'>
                                <div className='friend-contact__avatar'>
                                    <Avatar  size= 'l'imgUrl={chat.users[getIndex(chat.users)].profilePicture}/>
                                    {unseenMessagesCounter(chat.messages)? unseenMessagesCounter(chat.messages): null}
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