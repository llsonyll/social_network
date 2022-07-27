import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserChats from "../../components/userChats/UserChats";
import UserConversation from "../../components/userConversation/UserConversation";
import { getChats } from "../../redux/actions/chatActions";
import { clearChats } from "../../redux/reducers/chatReducer";

import "./messages.css";



const Messages = () => {

  let dispatch = useDispatch()
  let loggedUser = useSelector(store => store.auth.loggedUser)

  useEffect(()=> {
    dispatch(getChats(loggedUser._id))

    return (() => dispatch(clearChats()))
  }, [loggedUser])


  return (
    <div className="messages_container">
      <UserChats/>
      <UserConversation/>
    </div>
  );
};

export default Messages;
