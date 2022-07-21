import './profile.css'
import { UsersDummy } from '../../data/20UsersDummy'

const Profile = () => {
	let user = UsersDummy[0]

	return (
		<>
			<div className='p-container'>
				<div className='profile-container'>
					<div className='shadow-box'></div>
					<img
						className='profile-img'
						src='https://japanpowered.com/media/images//goku.png'
						alt='Profile Picture'></img>
					<button className='buttonsito'>Settings</button>
					<div className='user-firstname'> {user.firstname} </div>
					<div className='user-username'> {user.username} </div>
					<div className='user-followers'> Followers: {user.followers.length} </div>
					<div className='user-following'> Following: {user.following.length} </div>
					<p className='user-biography'> {user.biography}</p>
				</div>
			</div>

			{/* Espacio para mapear 20 objetos con el componente renderizador de los posts y los 20 posts que le pido a la db */}
		</>
	)
}

export default Profile
