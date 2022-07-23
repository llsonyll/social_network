import './App.css'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import DashBoard from './layout/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoggedUserInfo } from './redux/actions/authActions'

function App() {
	const dispatch = useDispatch()

	const loggedUser = useSelector((state) => state.auth.loggedUser)

	useEffect(() => {
		if (localStorage.getItem('token') && !loggedUser._id) {
			dispatch(getLoggedUserInfo())
		}
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Landing />} />
				<Route path='/home' element={<DashBoard />}>
					<Route index element={<Home />} />
					<Route path='profile:id' element={<Profile />} />
					<Route path='messages' element={<Messages />} />
					<Route path='post/:id' element={<PostDetail />} />
				</Route>
				<Route path='/team' element={<Landing />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
