import { FaComment, FaHeart } from 'react-icons/fa'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newDislikeUserProfile, newLikeUserProfile } from '../../redux/actions/userActions'

const ProfilePosts = (props) => {
	const { userId, postNumber, fullname, timeAgo, content, commentsLength, likesLength } = props
  
	const { _id } = useSelector(state => state.auth.loggedUser);
  const dispatch = useDispatch();

	const handleLike = () => {
       dispatch(newLikeUserProfile(postNumber,_id));
	}

	const handleDislike = () => {
       dispatch(newDislikeUserProfile(postNumber,_id));
	}

	return (
		<Fragment key={postNumber}>
			<div className='profile-posts-component md:p-7 p-3 md:flex  w-70  max-w-screen-lg  text-white'>
				<div className='user-post__info'>
					<Link to={`/home/profile/${userId}`}>
						<Avatar imgUrl='https://japanpowered.com/media/images//goku.png' size='xl' />
					</Link>
					<div className='user-post-info__detalle'>
						<Link to={`/home/profile/${userId}`} className='profile-posts-component-outside-div'>
							<div className=''>{fullname ? fullname : 'Dummy username'}</div>
						</Link>
						<div className='opacity-50'>{timeAgo ? timeAgo : '3hr'}</div>
					</div>
				</div>
				<Link to={`/home/post/${postNumber}`}>
				<div className='user-post-profile__content flex-1 pl-2 md:pl-4'>
					
						<div className=''>
							{content
								? content
								: 'PRUEBA est ea anim magna culpa non fugiat reprehenderit. Do anim laboris Lorem pariatur mollit tempor cupidatat aliqua in do. Reprehenderit sit consectetur irure et velit.'}
						</div>
					
				</div>
				</Link>
				<div className='actions flex gap-3 justify-end mt-2 md:mt-4 text-lg'>
					<button className='flex items-center gap-1'>
						<FaComment />
						{commentsLength}
					</button>

					<button className='flex items-center gap-1'
					 onClick = {handleLike}
					>
						<FaHeart />
						{likesLength}
					</button>
				</div>
			</div>
		</Fragment>
	)
}

export default ProfilePosts
