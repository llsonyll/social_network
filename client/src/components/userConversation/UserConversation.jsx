import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../Avatar'
import './UserConversation.css' 
import Mensajes from '../Mensajes/Mensajes'
import { Link } from 'react-router-dom'

//iconos
import {AiOutlineSend, AiOutlinePhone} from 'react-icons/ai'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getChatInfo, getChats, sendMessage, setSeenMessages } from '../../redux/actions/chatActions'
import { addMessage, clearChatInfo, orderChats } from '../../redux/reducers/chatReducer'
import { socket } from '../../App'
import { AiOutlineMore } from "react-icons/ai";

const UserConversation = ({mostrarMenu, setmostrarMenu}) => {

    const [text, setText] = useState('')
    let dispatch = useDispatch()
    const params = useParams()
    const loggedUser = useSelector(store => store.auth.loggedUser)
    const chatInfo = useSelector(store => store.chat.chatDetails)
    const chats = useSelector(store => store.chat.allChats)

    let getIndex = (array) => {
      if(array[0]._id === loggedUser._id){
          return 1
      }else{
          return 0
      }
    }

    useEffect(()=>{
      if(loggedUser._id && params.id){
        dispatch(getChatInfo(loggedUser._id, params.id))
      }
      return (()=> dispatch(clearChatInfo()))
    },[loggedUser, params])

    useEffect(()=>{
      if(chatInfo._id){
        dispatch(setSeenMessages(loggedUser._id, chatInfo._id))
        dispatch(getChats(loggedUser._id))
      }
    },[chatInfo._id])

    let handleClick = (e) =>{
      e.preventDefault()
      if(chatInfo.users[0]._id !== chatInfo.users[1]._id){
        dispatch(sendMessage(text, loggedUser._id, chatInfo._id, chatInfo.users[getIndex(chatInfo.users)]._id))
      }else{
        dispatch(sendMessage(text, loggedUser._id, chatInfo._id))
      }
      if(chatInfo._id !== chats[0]._id){
        dispatch(orderChats(chatInfo._id))
      }

      setText('')
    }

    const handleCall = () =>{
      socket.emit('call', chatInfo.users[getIndex(chatInfo.users)]._id, loggedUser._id, loggedUser.username, loggedUser.profilePicture) 
    }

  return (
    chatInfo._id? <div className='userconversation__container'>
        <div className='header_conversation'>
           <Link to={`/home/profile/${chatInfo.users[getIndex(chatInfo.users)]._id}`}>
            <Avatar size='l' imgUrl={chatInfo.users[getIndex(chatInfo.users)].profilePicture}/>
           </Link>
           <Link to={`/home/profile/${chatInfo.users[getIndex(chatInfo.users)]._id}`}>
            <span>{chatInfo.users[getIndex(chatInfo.users)].username}</span>
           </Link>

           <button type='button' onClick={handleCall} > <AiOutlinePhone /> </button>
           <button className='more_chat' onClick={()=> setmostrarMenu((state) => !state)}><AiOutlineMore /></button> 
           {
            mostrarMenu === true ?
            <ul className='more_chat_options'>
              <li>Delete conversation</li>
              <li>Report user</li>
            </ul> : null
           }
        </div>
            <Mensajes id={loggedUser._id} messages={chatInfo.messages}/>
        <form className='input_conversation__container' onSubmit={handleClick}>
            <input value={text} type="text" onChange={(e) => setText( e.target.value ) } placeholder='Write a message here'
            maxLength='2000'/>
            <button type="submit" disabled={text === ''}>
                <AiOutlineSend />
            </button>
        </form>
    </div>: null
  )
}

export default UserConversation