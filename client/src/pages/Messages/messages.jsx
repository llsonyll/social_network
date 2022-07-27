import UserChats from "../../components/userChats/UserChats";
import UserConversation from "../../components/userConversation/UserConversation";

import "./messages.css";



const Messages = () => {
  return (
    <div className="messages__father">
      <div className="messages_container">
      
          <UserChats/>
          <UserConversation/>
        
      </div>
    </div>
  );
};

export default Messages;
