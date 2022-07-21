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

						<div className='img-container'>
							{/* <img
								className='profile-img'
								src='https://japanpowered.com/media/images//goku.png'
								alt='Profile Picture'>
							</img> */}
							<div className='img_profile'>
								<div className='info'>
									<p>Change Image</p>
								</div>
							</div>
						</div>
						<div className='shadow-box'>
							<div className='user_description'>
								<div className='user-firstname'>
									<div className="info_container">
										<span className='span-info'>Full name</span>
										<p>
										 {user.firstname} 
										</p>
									</div>
									<div className="button_container">
										<button type='button'>
										Edit
										</button>
									</div>
								</div>
								<div className='user-username'> 
									<div className="info_container">
										<span className='span-info'>Username</span>
										{user.username} 
									</div>
									<div className="button_container">
										<button type='button'>
										Edit
										</button>
									</div>
								</div>
								<div className='user-followers'>
									<div className="info_container">
										<span className='span-info'>Followers</span> 
										{user.followers.length} 
									</div>
								</div>
								<div className='user-following'>
									<div className="info_container">
										<span className='span-info'>Following</span>
										{user.following.length}
									</div>
								</div>
								
								<div className='user-biography'>
									<div className="info_container">
										<span className='span-info'>biography</span>
										{user.biography}
									</div>
									<div className="button_container">
										<button type='button'>Edit</button>
									</div>
								</div>
							</div>
						</div>

				</div>
				{showingSettings === true && <Settings setShowingSettingsToFalse={setShowingSettingsToFalse} />}
			</div>

			{/* Espacio para mapear 20 objetos con el componente renderizador de los posts y los 20 posts que le pido a la db */}
		</>
	)
}

export default Profile
