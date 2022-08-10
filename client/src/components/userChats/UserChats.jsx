import React from 'react'
import Avatar from '../Avatar'
import './userChats.css'
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
//iconos
import {AiOutlineSearch} from 'react-icons/ai'
import { useEffect } from 'react'
import { getChats } from '../../redux/actions/chatActions'
import { clearSearchedChats } from '../../redux/reducers/chatReducer'
import LoadingSpinner from '../LoadingSpinner'

const UserChats = ({setMostrarMenu}) => {

    let loggedUser = useSelector(store => store.auth.loggedUser)
    let chats = useSelector(store => store.chat.allChats)
    let searchedChats = useSelector(store => store.chat.searchedChats)
    let dispatch = useDispatch()
    const[searchChat , setSearchChat] = useState('')
    const [searching, setSearching] = useState(false)

    useEffect(()=> {
        let search = async() => {
            setSearching(true)
            await dispatch(getChats(loggedUser._id, searchChat))
            setSearching(false)
        }
        if(searchChat){
            search()
        }
    }, [searchChat])

    useEffect(()=>{
        if(!searchChat && searchedChats.length){
            dispatch(clearSearchedChats())
        }
    }, [searchChat, searchedChats])

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
                searchedChats.length ?
                searchedChats.map((chat) => {
                    return(
                        <Link to={`/home/messages/${chat.users[getIndex(chat.users)]._id}`} onClick={() => setMostrarMenu(false)}>
                            <div className='friend-contact relative items-center'>
                                <div className='friend-contact__avatar '>
                                    <Avatar  size= 'l'imgUrl={chat.users[getIndex(chat.users)].profilePicture}/>
                                        {unseenMessagesCounter(chat.messages)?<span className='chats-user_number absolute right-3'> {unseenMessagesCounter(chat.messages)}  </span>: null}
                                </div>
                                <div className='friend-contact__info '>
                                    <span>{chat.users[getIndex(chat.users)].username}</span>
                                </div>
                            </div>
                        </Link>
                    )
                }): 
                searchChat && searching? 
                <LoadingSpinner/>:
                searchChat && !searching?
                <span className='no_friends'>No chats Found</span>:
                chats.length ? 
                chats.map((chat) => {
                    return(
                        <Link to={`/home/messages/${chat.users[getIndex(chat.users)]._id}`} onClick={() => setMostrarMenu(false)}>
                            <div className='friend-contact relative items-center'>
                                <div className='friend-contact__avatar '>
                                    <Avatar  size= 'l'imgUrl={chat.users[getIndex(chat.users)].profilePicture}/>
                                        {unseenMessagesCounter(chat.messages)?<span className='chats-user_number absolute right-3'> {unseenMessagesCounter(chat.messages)}  </span>: null}
                                </div>
                                <div className='friend-contact__info '>
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