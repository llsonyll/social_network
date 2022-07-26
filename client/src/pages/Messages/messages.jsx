import UserChats from "../../components/userChats/UserChats";
import UserConversation from "../../components/userConversation/UserConversation";

import "./messages.css";



const Messages = () => {
  return (
    <div className="messages_container">
      <UserChats/>
      <UserConversation/>
    </div>
  );
};

export default Messages;
