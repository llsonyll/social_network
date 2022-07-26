import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
// import Premium from './pages/Premium';
import DashBoard from "./layout/Dashboard";
import Settings from "./pages/Settings";
import Administrator from "./pages/Admin";
import RestorePassword from "./pages/RestorePassword";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUserInfo } from "./redux/actions/authActions";
import { removeLoggedUser } from "./redux/reducers/authReducer.slice";
import { addMessage, addUnseenMessage } from "./redux/reducers/chatReducer";
import Draggable from "react-draggable";
import PremiumComponent from "./pages/Premium/PremiumComponent";

//IMPORTS PARA SOCKET IO
import io from "socket.io-client";
// export const socket = io("http://localhost:3001");
export const socket = io("https://back.socialn.me");
//export const socket = io("https://www.dream-team-api.social");
 

let peer;
let call;
import { Peer } from "peerjs";

import { useRef, useState } from "react";
//SOUND ON MESSAGES IMPORTS

import useSound from 'use-sound';
import mySound from '../assets/message.mp3';

// Icons
import { FiPhoneMissed } from "react-icons/fi";
import { AiOutlineAudioMuted, AiOutlineVideoCamera } from "react-icons/ai";
import IncomingCall from "./components/IncomingCall/IncomingCall";

//iconos
import Notifications from "./pages/Notifications/Notifications";
import { getNotifications } from "./redux/actions/notificationActions";
import { addNotification } from "./redux/reducers/notificationReducer.slice";
import { getUnseenMessagesAmount } from "./redux/actions/chatActions";
import restorePassword from "./pages/RestorePassword/restorePassword";

function App() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();
  const loggedUser = useSelector((state) => state.auth.loggedUser);
  const remoteVideoRef = useRef();
  const localVideoRef = useRef();
  const [actualyLogged, setActuallyLogged] = useState();
  const [myVideo, setMyVideo] = useState();
  const [otherVideo, setOtherVideo] = useState();
  const [onCall, setOnCall] = useState(false);
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [playMessageSound] = useSound(mySound)
  // console.log('SOY EL CONSOLE LOG DE AAAAAAAPPPP')
  

  useEffect(() => {
    if (localStorage.getItem("token") && !loggedUser._id) {
      dispatch(getLoggedUserInfo());
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token") && location.pathname  !== "/" && location.pathname != '/restore') {
      dispatch(removeLoggedUser());
      // console.log("removeLoggedUser");
      navigate("/");
    }
  }, [location]);

  //SOCKET useEffect TO REPORT A LOGGED USER, AND HANDLE CALLS, AND GET NOTIFICATIONS
  useEffect(() => {
    if (loggedUser._id) {
      setActuallyLogged(loggedUser._id);
      dispatch(getNotifications(loggedUser._id));
      dispatch(getUnseenMessagesAmount(loggedUser._id))
    } else {
      setActuallyLogged(loggedUser._id);
    }
  }, [loggedUser._id]);

  //'PRIMARY' USE EFFECT, LOGS THE USER IN AND CONTROL CALL AND ANSWER
  useEffect(() => {
    if (actualyLogged) {
      //CREATES A PEER AND GIVES THE USERID AS PEERID
      
      peer = new Peer(actualyLogged);
      
      //FUNCTION TO ACCESS TO CAMERA
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      peer.on("open", function (id) {
        
      });
      //EMITS AN LOGGED ACTION
      socket.emit("logged", actualyLogged, socket.id);
      //DETECTS WHEN SOMEONE CALLS YOU
      socket.on("call", (_id, username, profilePicture) => {
        //DISPLAYS THE VIDEOCALL
        setIncomingCalls([...incomingCalls, { _id, username, profilePicture }]);
      });
      //ANSWER THE CALL FUNCTION
      peer.on("call", (calling) => {
        //DISPLAYS
        setOnCall(true);
        call = calling;
        //GET CAMERA AND MIC
        getUserMedia(
          { video: true, audio: true },
          (stream) => {
            //ANSWERS CALL AND SHOWS BOTH MEDIAS
            calling.answer(stream);
            setMyVideo(stream);
            calling.on("close", () => {
              setOnCall(false);
            });
            calling.on("stream", (remoteStream) => {
              setOtherVideo(remoteStream);
              // Show stream in some <video> element.
            });
          },
          (err) => {
            console.error("Failed to get local stream", err);
          }
        );
      });
    } else {
      if (peer) {
        if (call) {
          if (call.open) {
            socket.emit("closeCall", call.peer);
            call.close();
          }
        }
        peer.destroy();
      }
    }
    return () => {
      socket.off("logged");
    };
  }, [actualyLogged]);

  //SOCKET useEFFECT TO LISTEN MESSAGES AND NOTIFICATIONS
  useEffect(() => {
	if(!location.pathname.includes('messages')){
		socket.on('privMessage', (content, _id, chatId) =>{
      // console.log('sonar sonido? xD', messageSound)
      dispatch(addUnseenMessage())
      playMessageSound()
      })
    }
    return (()=> {
		socket.off('privMessage')
	})
  }, [location])



  useEffect(() => {
    socket.on("notification", () => {
      dispatch(getNotifications(loggedUser._id));
    });
    return () => {
      socket.off("notification");
    };
  }, [loggedUser]);

  //SHOWS THE INCOMING VIDEO
  useEffect(() => {
    if (otherVideo) {
      remoteVideoRef.current.srcObject = otherVideo;
      remoteVideoRef.current.onloadedmetadata = function (e) {
        remoteVideoRef.current.play();
      };
    }
  }, [otherVideo]);

  //SHOWS LOCAL VIDEO AND LISTENS TO ENDING CALLS
  useEffect(() => {
    if (myVideo) {
      localVideoRef.current.srcObject = myVideo;
      localVideoRef.current.onloadedmetadata = function (e) {
        localVideoRef.current.play();
      };
      socket.on("closeCall", () => {
        console.log("aaaa?");
        console.log(myVideo, otherVideo);
        myVideo.getVideoTracks().forEach((track) => track.stop());
        myVideo.getAudioTracks().forEach((track) => track.stop());
        call.close();
      });
    }
  }, [myVideo]);

  //TURN OFF CAMERA AND MIC AND EMIT THE CLOSE CHAT ACTION
  const handleCloseChat = () => {
    myVideo.getVideoTracks().forEach((track) => track.stop());
    myVideo.getAudioTracks().forEach((track) => track.stop());
    socket.emit("closeCall", call.peer);
    call.close();
  };

  //STOP-PLAY CAMERA
  const handleStopCamera = () => {
    myVideo
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  };

  //STOP-PLAY MIC
  function handleMuteMic() {
    myVideo
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
  }

  function handeAcceptCall(_id) {
    if (call) {
      if (call.open) {
        socket.emit("closeCall", call.peer);
        call.close();
      }
    }
    setIncomingCalls(incomingCalls.filter((call) => call._id !== _id));
    setOnCall(true);
    const getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        //EXECUTE THE CALL
        call = peer.call(_id, stream);
        //DETECTS THE DISCONECCTION OF THE CALL AND STOP DISPLAY
        call.on("close", () => {
          setOnCall(false);
        });
        //ON ANSWER SHOWS BOTH VIDEOS
        call.on("stream", function (remoteStream) {
          setMyVideo(stream);
          setOtherVideo(remoteStream);
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      }
    );
  }

  function handleDenyCall(_id) {
    setIncomingCalls(incomingCalls.filter((call) => call._id !== _id));
  }

  return (
    <>
      {onCall ? (
        <Draggable bounds="parent" cancel='.btn'>
          <div id="video_container">
            <div className="user_videos_container">
              <video ref={remoteVideoRef} autoPlay />
              <video ref={localVideoRef} autoPlay muted />
            </div>
            <div className="buttons_video_container">
              <button onClick={handleCloseChat} className='btn'>
                <FiPhoneMissed />
              </button>
              <button onClick={handleStopCamera}className='btn'>
                <AiOutlineVideoCamera />
              </button>
              <button onClick={handleMuteMic}  className='btn'>
                <AiOutlineAudioMuted />
              </button>
            </div>
          </div>
        </Draggable>
      ) : null}
      {incomingCalls.length
        ? incomingCalls.map((call) => (
            <IncomingCall
              data={call}
              acceptCall={handeAcceptCall}
              denyCall={handleDenyCall}
            />
          ))
        : null}
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/home" element={<DashBoard />}>
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route index element={<Home />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="premium/:id" element={<PremiumComponent />} />
          <Route path="messages">
            <Route index element={<Messages />} />
            <Route path=":id" element={<Messages />} />
          </Route>
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="administrator" element={<Administrator />} />
        </Route>
          <Route path="/restore" element={<RestorePassword />} />
      </Routes>
    </>
  );
}

export default App;
