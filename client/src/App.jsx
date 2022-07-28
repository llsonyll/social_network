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

function App() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();
  const loggedUser = useSelector((state) => state.auth.loggedUser);
  

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
      socket.emit('logged', loggedUser._id, socket.id)
    }
    return (() => socket.off('logged'))
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



	return (
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
	)
}

export default App;
