import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'
import './UserConversation.css' 
//iconos
import {AiOutlineSend} from 'react-icons/ai'
import { useState } from 'react'


const UserConversation = () => {

    const [text, setText] = useState('')
    console.log(text);
  return (
    <div className='userconversation__container'>
        <div className='header_conversation'>
            <Avatar/>
           <span>Hellou</span> 
        </div>
        <div >
            <input type="text" onChange={(e) => setText( e.target.value ) }/>
            <button type="button" disabled={text === ''}>
                <AiOutlineSend />
            </button>
        </div>
    </div>
  )
}

export default UserConversation