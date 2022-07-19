import './App.css'
import Landing from './pages/landing'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Landing />} />
				<Route path='/home' element={<Landing />} />
				<Route path='/profile' element={<Landing />} />
				<Route path='/chat' element={<Landing />} />
				<Route path='/postDetailPage' element={<Landing />} />
				<Route path='/team' element={<Landing />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
