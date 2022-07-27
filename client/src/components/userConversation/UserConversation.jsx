import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../Avatar'
import './UserConversation.css' 
import Mensajes from '../Mensajes/Mensajes'

//iconos
import {AiOutlineSend} from 'react-icons/ai'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getChatInfo, sendMessage } from '../../redux/actions/chatActions'
import { addMessage, clearChatInfo } from '../../redux/reducers/chatReducer'


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
      if(loggedUser._id && params.id){
        dispatch(getChatInfo(loggedUser._id, params.id))
      }
      return (()=> dispatch(clearChatInfo()))
    },[loggedUser, params])

    let handleClick = () =>{
      dispatch(sendMessage(text, loggedUser._id, chatInfo._id))
    }

  return (
    chatInfo._id? <div className='userconversation__container'>
        <div className='header_conversation'>
            <Avatar imgUrl={chatInfo.users[getIndex(chatInfo.users)].profilePicture}/>
           <span>{chatInfo.users[getIndex(chatInfo.users)].username}</span> 
        </div>
            <Mensajes/>
        <div className='input_conversation__container' >
            <input type="text" onChange={(e) => setText( e.target.value ) }/>
            <button type="button" disabled={text === ''} onClick={handleClick}>
                <AiOutlineSend />
            </button>
        </div>
    </div>: null
  )
}

export default UserConversation