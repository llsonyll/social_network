import { FaComment, FaHeart } from 'react-icons/fa'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'
import { Fragment } from 'react'

const ProfilePosts = (props) => {
	const { userId, postNumber, fullname, timeAgo, content, commentsLength, likesLength } = props

	return (
		<Fragment key={postNumber}>
			<div className='profile-posts-component md:p-9 p-3 md:flex  w-70  max-w-screen-lg  text-white'>
				<Link to={`/home/profile/${userId}`}>
					<Avatar imgUrl='https://japanpowered.com/media/images//goku.png' size='xl' />
				</Link>
				<div className='flex-1 pl-2 md:pl-4'>
					<Link to={`/home/profile/${userId}`} className='profile-posts-component-outside-div'>
						<div className=''>{fullname ? fullname : 'Dummy username'}</div>
					</Link>
					<div className='opacity-50'>{timeAgo ? timeAgo : '3hr'}</div>
					<Link to={`/home/post/${postNumber}`}>
						<div className=''>
							{content
								? content
								: 'PRUEBA est ea anim magna culpa non fugiat reprehenderit. Do anim laboris Lorem pariatur mollit tempor cupidatat aliqua in do. Reprehenderit sit consectetur irure et velit.'}
						</div>
					</Link>
				</div>

				<div className='actions flex gap-3 justify-end mt-2 md:mt-4 text-lg'>
					<button className='flex items-center gap-1'>
						<FaComment />
						{commentsLength}
					</button>

					<button className='flex items-center gap-1'>
						<FaHeart />
						{likesLength}
					</button>
				</div>
			</div>
		</Fragment>
	)
}

export default ProfilePosts
