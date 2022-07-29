import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Premium from './pages/Premium';
import DashBoard from "./layout/Dashboard";
import Settings from "./pages/Settings";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUserInfo } from "./redux/actions/authActions";
import { removeLoggedUser } from "./redux/reducers/authReducer.slice";

//IMPORTS PARA SOCKET IO
import io from 'socket.io-client';
import { addMessage } from "./redux/reducers/chatReducer";
export const socket = io('http://localhost:3001');

//IMPORTS PARA LLAMADAS

import { Peer } from "peerjs"
import { useRef } from "react";
import { createElement } from "react";
import { useState } from "react";


function App() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();
  const loggedUser = useSelector((state) => state.auth.loggedUser);
  const remoteVideoRef = useRef()
  const localVideoRef = useRef()
  const [myVideo, setMyVideo] = useState()
  const [otherVideo, setOtherVideo] = useState()

  const handleCanPlayRemote = () => {
    remoteVideoRef.current.play();
  }
  const handleCanPlayLocal = () => {
    localVideoRef.current.play();
  }



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

  //SOCKET useEffect TO REPORT A LOGGED USER
  useEffect(() => {
    if(loggedUser._id){
		let {_id} = loggedUser
		let id = _id
		const peer = new Peer(id)
		const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		peer.on('open', function (id) { console.log( 'I got My peer ID:' + id, peer) })
		console.log(peer)
      	socket.emit('logged', loggedUser._id, socket.id)
		socket.on('call',(_id) => {
			
					getUserMedia(
					{ video: true, audio: true }, function(stream){
					console.log(stream)
					const call = peer.call(_id, stream);
					console.log(call)
					setMyVideo(stream)
					call.on("stream", function(remoteStream){
						setOtherVideo(remoteStream)
						// Show stream in some <video> element.
					});
				},
				(err) => {
					console.error("Failed to get local stream", err);
				},)
		})
		peer.on("call", (call) => {
			console.log(peer.id)
			console.log('algo')
			getUserMedia(
				{ video: true, audio: true },
				(stream) => {
					call.answer(stream); // Answer the call with an A/V stream.
					setMyVideo(stream)
					call.on("stream", (remoteStream) => {
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
  }, [loggedUser])

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
			remoteVideoRef.current.onloadedmetadata = function(e) {videos.current.play()}
		}
	},[otherVideo])

	useEffect(()=>{
		if(myVideo){
			localVideoRef.current.srcObject = myVideo
			localVideoRef.current.onloadedmetadata = function(e) {videos.current.play()}
		}
	},[myVideo])


	return (
			<>
			<div>
				<video ref={remoteVideoRef} autoPlay muted/>
				<video ref={localVideoRef}  autoPlay muted/>
			</div>
			<Routes>
				<Route path='/' element={<Landing />} />
				<Route path='/home' element={<DashBoard />}>
					<Route index element={<Home />} />
					<Route path='profile/:id' element={<Profile />} />
						<Route path="messages">
						<Route index element={<Messages />} />
						<Route path=":id" element={<Messages />} />
						</Route>	
					<Route path='post/:id' element={<PostDetail />} />
					<Route path='premium/:id' element={<Premium />} />
				</Route>
				<Route path='/settings' element={<Settings />} />
			</Routes>
			</>
	)
}

export default App;
