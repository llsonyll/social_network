import { FaComment, FaHeart } from 'react-icons/fa'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'

const ProfilePosts = ({ postNumber, fullname, timeAgo, description, comments, likes }) => {
	{
		/* <Link to={`post/${postNumber}`} className='bg-stone-800 w-full rounded-md md:p-6 p-3 flex text-white'> */
	}
	{
		/* </Link> */
	}
	return (
		<>
			<div className='flex items-center justify-center md:p-9 p-3 md:flex bg-black w-70  max-w-screen-lg  text-white'>
				<Avatar imgUrl='https://japanpowered.com/media/images//goku.png' size='xl' />
				<div className='flex-1 pl-2 md:pl-4'>
					<div className=''>{fullname ? fullname : 'Dummy username'}</div>
					<div className='opacity-50'>{timeAgo ? timeAgo : '3hr'}</div>

					<div className=''>
						{description
							? description
							: 'Mollit magna est ea anim magna culpa non fugiat reprehenderit. Do anim laboris Lorem pariatur mollit tempor cupidatat aliqua in do. Reprehenderit sit consectetur irure et velit.'}
					</div>

					<div className='actions flex gap-3 justify-end mt-2 md:mt-4 text-lg'>
						<button className='flex items-center gap-1'>
							<FaComment />
							{comments}
						</button>

						<button className='flex items-center gap-1'>
							<FaHeart />
							{likes}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProfilePosts
