import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import DashBoard from "./layout/Dashboard";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUserInfo } from "./redux/actions/authActions";
import { removeLoggedUser } from "./redux/reducers/authReducer.slice";
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

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
				</Route>
				<Route path='/team' element={<Landing />} />
			</Routes>
	)
}

export default App;
