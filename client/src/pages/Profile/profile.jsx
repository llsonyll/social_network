import './profile.css'
import { UsersDummy } from '../../data/20UsersDummy'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import EditFullname from '../../components/EditFullname'
import EditUsername from '../../components/EditUsername'
import EditBiography from '../../components/EditBiography'
import ProfilePosts from '../../components/ProfilePostsRenderer'
import { mockPost } from '../../data/20DummyPosts'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getUserProfile } from '../../redux/actions/userActions'

const Profile = () => {
	const params = useParams()
	const [firstname, setFirstname] = useState(false)
	const [username, setUsername] = useState(false)
	const [biography, setBiography] = useState(false)
	const [image, setImage] = useState(false)
	const userData = useSelector((state) => state.user.userProfileData) 
	const userLogged = useSelector((state) => state.auth.loggedUser._id)
	const dispatch = useDispatch()

	const renderChangeRenderComponents = (nameOfTheComponentToRender) => {
		if (nameOfTheComponentToRender === 'firstname') {
			setFirstname(false)
		}
		if (nameOfTheComponentToRender === 'username') {
			setUsername(false)
		}
		if (nameOfTheComponentToRender === 'biography') {
			setBiography(false)
		}
		if (nameOfTheComponentToRender === 'image') {
			setImage(false)
		}
	}



	useEffect(() => {
		dispatch(getUserProfile(params.id))

	}, [ ])
	//traigo la info del perfil en el q estoy (didMount)

	let user = UsersDummy[0]
	let post = mockPost[0]
	let userPosts = {
		postNumber: 1,
		fullname: `${userData.firstname + ' ' + user.lastname}`,
		timeAgo: '9hr',
		description: post.content
			? post.content
			: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
		commentsLength: `${post.comments.length}`,
		likes: `${post.likes.length}`,
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
								<div className='info_container'>
									<span className='span-info'>Full name</span>
									<p>{`${user.firstname + ' ' + user.lastname}`}</p>
								</div>
								<div className='button_container'>
									{params.id === userLogged ? (
										<button
											onClick={() => {
												setFirstname(true)
											}}
											type='button'>
											Edit
										</button>
									) : null}
								</div>
							</div>
							<div className='user-username'>
								<div className='info_container'>
									<span className='span-info'>Username</span>
									{user.username}
								</div>
								<div className='button_container'>
									{params.id === params.id ? (
										<button
											onClick={() => {
												setUsername(true)
											}}
											type='button'>
											Edit
										</button>
									) : null}
								</div>
							</div>

							<div className='user-followers'>
								<div className='info_container'>
									<span className='span-info'>Followers</span>
									{user.followers.length}
								</div>
							</div>
							<div className='user-following'>
								<div className='info_container'>
									<span className='span-info'>Following</span>
									{user.following.length}
								</div>
							</div>

							<div className='user-biography'>
								<div className='info_container'>
									<span className='span-info'>Biography</span>
									{user.biography}
								</div>
								<div className='button_container'>
									{params.id === params.id ? (
										<button
											onClick={() => {
												setBiography(true)
											}}
											type='button'>
											Edit
										</button>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{firstname === true && (
				<EditFullname renderChangeRenderComponents={renderChangeRenderComponents} user={user} />
			)}
			{username === true && (
				<EditUsername renderChangeRenderComponents={renderChangeRenderComponents} user={user} />
			)}
			{biography === true && (
				<EditBiography renderChangeRenderComponents={renderChangeRenderComponents} user={user} />
			)}
			{/* {image === true && <EditLastname renderChangeRenderComponents={renderChangeRenderComponents} user={user} />} */}

			{/* Espacio para mapear 20 objetos con el componente renderizador de los posts y los 20 posts que le pido a la db */}

			<ProfilePosts userPosts={userPosts} />
		</>
	)
}

export default Profile
