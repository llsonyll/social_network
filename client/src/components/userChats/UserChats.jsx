import React from 'react'
import Avatar from '../Avatar'
import './userChats.css'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
//iconos
import {AiOutlineSearch} from 'react-icons/ai'

const UserChats = () => {


    const[searchChat , setSearchChat] = useState('')

    const ArrayPrueba = [
        {
            fullname: 'Harold Tenorio',
            username: 'Haaaar',
            content: 'gedfjwehdgfweghbwekj',
            id: 231123
        } ,
        {
            fullname: 'Harold Tenorio',
            username: 'Haaaar',
            content: 'gedfjwehdgfweghbwekj',
            id:12312312
        } ,
        {
            fullname: 'Harold Tenorio',
            username: 'Haaaar',
            content: 'gedfjwehdgfweghbwekj',
            id:42386423
        }
    ]
  return (
    <div className='chats__user-father'>
        <div className='search__container'>
            <AiOutlineSearch/>
            <input type="text" onChange={(e) => setSearchChat(e.target.value)}/>
        </div>
        <div id='chats-user__container'>
            {
                ArrayPrueba ? 
                ArrayPrueba.map((friend) => {
                    return(
                        <Link to={`/home/messages/${friend.id}`}>
                            <div className='friend-contact'>
                                <div className='friend-contact__avatar'>
                                    <Avatar/>
                                </div>
                                <div className='friend-contact__info'>
                                    <span>{friend.fullname}</span>
                                    <p>{friend.username}</p>
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