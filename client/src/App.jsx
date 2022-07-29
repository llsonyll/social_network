import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
// import Premium from './pages/Premium';
import DashBoard from "./layout/Dashboard";
import Settings from "./pages/Settings";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUserInfo } from "./redux/actions/authActions";
import { removeLoggedUser } from "./redux/reducers/authReducer.slice";
import Draggable from 'react-draggable'
import PremiumComponent from "./pages/Premium/PremiumComponent";
//IMPORTS PARA SOCKET IO
import io from 'socket.io-client';
import { addMessage } from "./redux/reducers/chatReducer";
export const socket = io('http://localhost:3001');
let peer;
let call;

//IMPORTS PARA LLAMADAS

import { Peer } from "peerjs"
import { useRef } from "react";
import { createElement } from "react";
import { useState } from "react";

//iconos
import {FiPhoneMissed} from 'react-icons/fi'
import {AiOutlineAudioMuted} from 'react-icons/ai'
function App() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();
  const loggedUser = useSelector((state) => state.auth.loggedUser);
  const remoteVideoRef = useRef()
  const localVideoRef = useRef()
  const [actualyLogged, setActuallyLogged] = useState()
  const [myVideo, setMyVideo] = useState()
  const [otherVideo, setOtherVideo] = useState()
  const [onCall, setOnCall] = useState(false)




  useEffect(() => {
    if (localStorage.getItem("token") && !loggedUser._id) {
      dispatch(getLoggedUserInfo());
    }
  }, []);


  useEffect(() => {
    // if (!localStorage.getItem("token") && location.pathname !== "/") {
    //   dispatch(removeLoggedUser());
    //   console.log("removeLoggedUser");
    //   navigate("/");
    // }
  }, [location]);

  //SOCKET useEffect TO REPORT A LOGGED USER, AND HANDLE CALLS
  useEffect(() => {
	if(loggedUser._id){
		setActuallyLogged(loggedUser._id)
	}
  },[loggedUser])


  useEffect(() => {
    if(actualyLogged){
		peer = new Peer(actualyLogged)
		const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		peer.on('open', function (id) { console.log( 'I got My peer ID:' + id, peer) })
		console.log(peer)
      	socket.emit('logged', actualyLogged, socket.id)
		socket.on('call',(_id) => {
					setOnCall(true)
					getUserMedia(
					{ video: true, audio: true }, function(stream){
					call = peer.call(_id, stream);
					console.log(call)
					setMyVideo(stream)
					call.on('close', () => {
						console.log('me cerraron unu 2')
						setMyVideo('')
						setOnCall(false)
						call.close()
					})
					call.on("stream", function(remoteStream){
						setOtherVideo(remoteStream)
						// Show stream in some <video> element.
					});
				},
				(err) => {
					console.error("Failed to get local stream", err);
				},)
		})
		peer.on("call", (calling) => {
			setOnCall(true)
			console.log(onCall);
			call = calling
			getUserMedia(
				{ video: true, audio: true },
				(stream) => {
					calling.answer(stream); // Answer the call with an A/V stream.
					setMyVideo(stream)
					calling.on('close', () => {
						setMyVideo('')
						setOnCall(false)
						calling.close()
					})
					calling.on("stream", (remoteStream) => {
						setOtherVideo(remoteStream)
						// Show stream in some <video> element.
					});
				},
				(err) => {
					console.error("Failed to get local stream", err);
				},
			);
		});
    }
    return (() => {
		socket.off('logged')
		socket.off('call')
	})
  }, [actualyLogged])

  //SOCKET useEFFECT TO LISTEN MESSAGES
  useEffect(() => {
    if(!location.pathname.includes('messages')){
      console.log('hola?')
      socket.on('privMessage', (content, _id, chatId) =>{
          console.log('Escucho mensajes pero no los agrego')  
      })
    }
    return (()=> socket.off('privMessage'))
  }, [location])


  	useEffect(() => {
		if(otherVideo){
			remoteVideoRef.current.srcObject = otherVideo
			remoteVideoRef.current.onloadedmetadata = function(e) {remoteVideoRef.current.play()}
		}
	},[otherVideo])

	useEffect(()=>{
		if(myVideo){
			localVideoRef.current.srcObject = myVideo
			localVideoRef.current.onloadedmetadata = function(e) {localVideoRef.current.play()}
		}
		console.log('holaaaa')
	},[myVideo])

	const handleCloseChat = () => {
		// myVideo.getVideoTracks().forEach(track => track.enabled = !track.enabled)
		myVideo.getVideoTracks().forEach(track => track.stop())
		myVideo.getAudioTracks().forEach(track => track.stop())
	}

	const handleStopCamera = () => {
		myVideo.getVideoTracks().forEach(track => track.enabled = !track.enabled)

	}

	function handleMuteMic() {
		myVideo.getAudioTracks().forEach(track => track.enabled = !track.enabled)
	}

	return (
			<>
			
			{
				onCall ?
			<Draggable bounds='parent'>
				<div id="video_container">
					<div className="user_videos_container">
					<video ref={remoteVideoRef} autoPlay muted/>
					<video ref={localVideoRef}  autoPlay />

					</div>
					<div className="buttons_video_container">
						<button onClick={handleCloseChat}> <FiPhoneMissed/> </button>
						<button onClick={handleMuteMic}><AiOutlineAudioMuted />  </button>
					</div>
				</div>
			</Draggable> : null

			}	
			
			<Routes>
				<Route path='/' element={<Landing />} />
				<Route path='/home' element={<DashBoard />}>
				  <Route path='settings' element={<Settings />} />
					<Route index element={<Home />} />
					<Route path='profile/:id' element={<Profile />} />
				    <Route path='premium/:id' element={<PremiumComponent/>} />
						<Route path="messages">
              <Route index element={<Messages />} />
              <Route path=":id" element={<Messages />} />
						</Route>	
					<Route path='post/:id' element={<PostDetail />} />
				</Route>
			</Routes>
			</>
	)
}

export default App;
