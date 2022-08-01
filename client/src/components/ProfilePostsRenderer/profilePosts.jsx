import { FaComment, FaHeart, FaExclamation } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import Avatar from '../Avatar'
import { AiOutlineMore } from "react-icons/ai";
import { ImHeartBroken } from "react-icons/im";
import { Link } from 'react-router-dom'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { newDislikeUserProfile, newLikeUserProfile, makeReport } from '../../redux/actions/userActions'
import Swal from 'sweetalert2';
import EditPost from '../EditPost.jsx/editPost';


const ProfilePosts = (props) => {
	const { userId, postNumber, fullname, timeAgo, content, commentsLength, likesLength, likes,dislikes , multimedia } = props
	const [editPost, setEditPost] = useState(false)

	const { _id } = useSelector(state => state.auth.loggedUser);
  	const dispatch = useDispatch();

	let showEditComponent = () => {
		setEditPost(!editPost)
	}

	const handleLike = () => {
       dispatch(newLikeUserProfile(postNumber, _id));
	}
	const handleDislike = () => {
		dispatch(newDislikeUserProfile(postNumber,_id));
	}
	const loggedUser = useSelector(state => state.auth.loggedUser)
	const posts = useSelector(state => state.user.userProfileData.posts);
	let index = posts.findIndex(post => post._id === postNumber);
	
	let renderHeartIcon = () => {
		if (!posts[index].likes.find( like => like._id === _id)) {
			return <FaHeart />
		}else{
			return (
				<IconContext.Provider value={{ color: 'red', className: 'global-heart-class-name' }}>
					<div>
						<FaHeart />
					</div>
				</IconContext.Provider>
			)
		}
	}
	let renderHeartBrokenIcon = () => {
    if (!posts[index].dislikes.find( dislike => dislike._id === _id)) {
      console.log('Entra blanco');
      return <ImHeartBroken />
    }else{
      console.log('Entra rojo');
      return (
        <IconContext.Provider value={{ color: "#9400D3", className: 'global-heart-class-name' }}>
          <div>
            <ImHeartBroken />
          </div>
        </IconContext.Provider>
      )
    }
  }
  	let renderEditPost = () => {
		if(editPost){
			return <EditPost userId={userId} postNumber={postNumber} content={content} showEditComponent={showEditComponent}/>
		}}

	return (
		<Fragment key={postNumber}>
			<div className='profile-posts-component md:p-7 p-3 md:flex  w-70  max-w-screen-lg  text-white'>
				<div className='user-post__info'>
					<Link to={`/home/profile/${userId}`}>
						{props.profilePicture? <Avatar imgUrl={props.profilePicture} size='xl'/> :<Avatar size='xl' />}
					</Link>
					<div className='user-post-info__detalle'>
						<Link to={`/home/profile/${userId}`} className='profile-posts-component-outside-div'>
							<div className=''>{fullname ? fullname : 'Dummy username'}</div>
						</Link>
						<div className='opacity-50'>{timeAgo ? timeAgo : '3hr'}</div>
					</div>


          {
          loggedUser._id  === userId &&
          <button 
          className="user-post-icon_more"
          onClick={showEditComponent}
          >
            <AiOutlineMore />
          </button>
          }
		{loggedUser._id  === userId && renderEditPost()}

				</div>
				<Link to={`/home/post/${postNumber}`}>
				<div className='user-post-profile__content flex-1 pl-2 md:pl-4'>
					
						<div className=''>
							{content
								? content
								: null}
						</div>
						
				</div>
				<div>
								{multimedia? <img src={multimedia} alt=''/> : null}
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
						{posts && renderHeartIcon()}
						{posts && posts[index].likes.length }
					</button>
					<button
                className="flex items-center gap-1"
                onClick={handleDislike}
              >
                  {posts && renderHeartBrokenIcon()}
                {posts && posts[index].dislikes.length }
          </button>
							
		  <button
            className="flex items-center gap-1"
            onClick={
				() => {
					Swal.fire({
					  background: "#4c4d4c",
					  color: "white",
					  title: 'Submit your Report',
					  input: 'textarea',
					  inputAttributes: {
						autocapitalize: 'off'
					  },
					  showCancelButton: true,
					  confirmButtonText: 'Submit',
					  showLoaderOnConfirm: true,
					  preConfirm: (login) => {
						dispatch(makeReport(_id, props.postNumber, {reason: login, reported: 'post'})) 
					  },
					  allowOutsideClick: () => !Swal.isLoading()
					})
			}}
          >
            <FaExclamation />
            {/* {post && renderHeartBrokenIcon()} */}
          </button>

				</div>
			</div>
		</Fragment>
	)
}

export default ProfilePosts
