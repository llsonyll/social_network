import './profile.css'
import { UsersDummy } from '../../data/20UsersDummy'
import { useState } from 'react'
import Settings from '../../components/ProfileSettings'
import settingsLogo from '../../../assets/settings.png'

const Profile = () => {
	const [showingSettings, setSshowingSettings] = useState(false)

	let user = UsersDummy[0]

	const renderSettings = () => {
		if (showingSettings === true) {
			return <Settings />
		}
	}

	const setShowingSettingsToFalse = () => {
		setSshowingSettings(false)
	}

	return (
		<>
			<div className='p-container'>
				<div className='profile-container'>
					<div className='shadow-box'></div>
					<img
						className='profile-img'
						src='https://japanpowered.com/media/images//goku.png'
						alt='Profile Picture'></img>
					<img
						className='profile-buttonsito'
						src={settingsLogo}
						alt='Settings Picture'
						onClick={() => setSshowingSettings(true)}></img>
					<div className='user-firstname'> {user.firstname} </div>
					<div className='user-username'> {user.username} </div>
					<div className='user-followers'> Followers: {user.followers.length} </div>
					<div className='user-following'> Following: {user.following.length} </div>
					<p className='user-biography text-center'> {user.biography}</p>
				</div>
				{showingSettings === true && <Settings setShowingSettingsToFalse={setShowingSettingsToFalse} />}
			</div>

			{/* Espacio para mapear 20 objetos con el componente renderizador de los posts y los 20 posts que le pido a la db */}
		</>
	)
}

export default Profile
