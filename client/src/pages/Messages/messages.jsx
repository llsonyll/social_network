import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useSound from "use-sound";
import { socket } from "../../App";
import UserChats from "../../components/userChats/UserChats";
import UserConversation from "../../components/userConversation/UserConversation";
import { getChats } from "../../redux/actions/chatActions";
import { addMessage, addUnseenMessage, clearChats } from "../../redux/reducers/chatReducer";
import mySound from '../../../assets/message.mp3'
import "./messages.css";



const Messages = () => {

  let dispatch = useDispatch()
  let loggedUser = useSelector(store => store.auth.loggedUser)
  let params = useParams()
  const chatInfo = useSelector(store => store.chat.chatDetails)
  const chats = useSelector(store => store.chat.allChats)
  const [mostrarMenu, setMostrarMenu] = useState(false)
  let [playMessageSound] = useSound(mySound)

  useEffect(()=> {
    socket.on('privMessage', (content, _id, chatId) => {
      if(chatInfo._id === chatId){
        dispatch(addMessage({
          content,
          from: _id
        }))
      }else{
        dispatch(addUnseenMessage())
        dispatch(getChats(loggedUser._id))
        playMessageSound()
      }
    })
    return(() => socket.off('privMessage'))
  }, [chatInfo])

  useEffect(()=> {
    dispatch(getChats(loggedUser._id))

    return (() => dispatch(clearChats()))
  }, [loggedUser])


  return (
    <div className="messages__father">
      <div className="messages_container">
      
          <UserChats setMostrarMenu={setMostrarMenu}/>
          {params.id? <UserConversation mostrarMenu={mostrarMenu} setmostrarMenu={setMostrarMenu}/> :null}
        
      </div>
    </div>
  );
};

export default Messages;
