import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../Avatar'
import './UserConversation.css' 
import Mensajes from '../Mensajes/Mensajes'

//iconos
import {AiOutlineSend, AiOutlinePhone} from 'react-icons/ai'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getChatInfo, sendMessage } from '../../redux/actions/chatActions'
import { addMessage, clearChatInfo } from '../../redux/reducers/chatReducer'
import { socket } from '../../App'


const UserConversation = () => {

    const [text, setText] = useState('')
    let dispatch = useDispatch()
    const params = useParams()
    const loggedUser = useSelector(store => store.auth.loggedUser)
    const chatInfo = useSelector(store => store.chat.chatDetails)

    let getIndex = (array) => {
      if(array[0]._id === loggedUser._id){
          return 1
      }else{
          return 0
      }
    }


    useEffect(()=>{
      if(loggedUser._id && params.id && !chatInfo._id){
        dispatch(getChatInfo(loggedUser._id, params.id))
      }
      return (()=> dispatch(clearChatInfo()))
    },[loggedUser, params])

    let handleClick = (e) =>{
      e.preventDefault()
      dispatch(sendMessage(text, loggedUser._id, chatInfo._id))
    
      if(chatInfo.users[0]._id !== chatInfo.users[1]._id){
        socket.emit('privMessage', text, chatInfo.users[getIndex(chatInfo.users)]._id, loggedUser._id, chatInfo._id)
        socket.off('privMessage')
      }
      setText('')
    }

    const handleCall = () =>{
      socket.emit('call', chatInfo.users[getIndex(chatInfo.users)]._id, loggedUser._id) 
    }

  return (
    chatInfo._id? <div className='userconversation__container'>
        <div className='header_conversation'>
            <Avatar size='m' imgUrl={chatInfo.users[getIndex(chatInfo.users)].profilePicture}/>
           <span>{chatInfo.users[getIndex(chatInfo.users)].username}</span>
           <button type='button' onClick={handleCall} > <AiOutlinePhone /> </button> 
        </div>
            <Mensajes id={loggedUser._id} messages={chatInfo.messages}/>
        <form className='input_conversation__container' onSubmit={handleClick}>
            <input value={text} type="text" onChange={(e) => setText( e.target.value ) }/>
            <button type="submit" disabled={text === ''}>
                <AiOutlineSend />
            </button>
        </form>
    </div>: null
  )
}

export default UserConversation