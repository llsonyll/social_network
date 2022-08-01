import "./profile.css";
import { UsersDummy } from "../../data/20UsersDummy";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import EditFullname from "../../components/EditFullname";
import EditUsername from "../../components/EditUsername";
import EditBiography from "../../components/EditBiography";
import ProfilePosts from "../../components/ProfilePostsRenderer";
import { mockPost } from "../../data/20DummyPosts";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { acceptFollowRequest, cancelFollowRequest, getUserProfile, makeReport, modifyUser } from "../../redux/actions/userActions";
import { followOrUnfollowUser } from "../../redux/actions/userActions";
import LoadingSpinner from "../../components/LoadingSpinner";
import Avatar from "../../components/Avatar";
import { clearProfileData } from "../../redux/reducers/userReducer.slice";
import { Link } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

import {AiFillCloseCircle} from 'react-icons/ai'
import { getLoggedUserInfo } from "../../redux/actions/authActions";

//iconos
import {AiFillSetting} from 'react-icons/ai'
import { FaExclamation } from "react-icons/fa";


const Profile = () => {

  
  const params = useParams();
  const [firstname, setFirstname] = useState(false);
  const [username, setUsername] = useState(false);
  const [biography, setBiography] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(false);
  const userLoggedId = useSelector((state) => state.auth.loggedUser._id);
  const usersFollowing = useSelector(
    (state) => state.user.userProfileData.followers
  );
  const userData = useSelector((state) => state.user.userProfileData);
  const dispatch = useDispatch();
  const [changeProfilePicture, setChangeProfilePicture] = useState('')
  const hiddenImageInput = useRef()

  const renderChangeRenderComponents = (nameOfTheComponentToRender) => {
    if (nameOfTheComponentToRender === "fullname") {
      setFirstname(false);
    }
    if (nameOfTheComponentToRender === "username") {
      setUsername(false);
    }
    if (nameOfTheComponentToRender === "biography") {
      setBiography(false);
    }
    if (nameOfTheComponentToRender === "image") {
      setImage(false);
    }
  };

  const handleGetUserProfile = async () => {
    setLoading(true);
    dispatch(getUserProfile(params.id));
    setLoading(false);
  };

  //traigo la info del perfil en el q estoy (didMount)
  useEffect(() => {
    handleGetUserProfile();
    return () => dispatch(clearProfileData());
  }, [params.id]);

  //COMIENZO DE FUNCION DE SUBIDAS DE FOTO DE PERFIL
  const uploadPicture = async(file) =>{
    let formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'h0tqwdio')
    let res = await axios.post('https://api.cloudinary.com/v1_1/pischetz/image/upload', formData)
    return res.data.secure_url
  }

  const handleChangePicture = () =>{
    hiddenImageInput.current.click()
  }

  const handleChange = async (event) =>{
    const fileUploaded = event.target.files[0]
    let picture = await uploadPicture(fileUploaded)
    console.log(picture)
    setChangeProfilePicture(picture)
  }

  const cancelChangePicture = () => {
    setChangeProfilePicture('')
  }

  const handleSavePicture = () => {
    dispatch(modifyUser(userLoggedId, {profilePicture: changeProfilePicture}))
    dispatch(getLoggedUserInfo())
    setChangeProfilePicture('')
  }


  function getTimeOfCreation(date) {
    let now = new Date().getTime();
    let created = new Date(date).getTime();
    const minutes = (now - created) / 60000;
    if (minutes <= 1) return "1 minute ago";
    if (minutes < 60) return `${Math.round(minutes)} minutes ago`;
    if (minutes / 60 <= 1.5) return "1 hour ago";
    if (minutes / 60 > 24 && minutes / 60 <= 36) return "1 day ago";
    if (minutes / 60 > 36) return `${Math.round(minutes / (60 * 24))} days ago`;
    return `${Math.round(minutes / 60)} hours ago`;
  }

  let user = userData;
  //console.log(user);
  let userPosts = user.posts;

  let renderer = () => {
    if (userPosts.length > 0) {
      return userPosts.map((p) => {
        return (
          <Fragment key={p.postNumber}>
            <ProfilePosts
              userId={p.userId._id}
              postNumber={p._id}
              fullname={`${user.firstname + " " + user.lastname}`}
              timeAgo={getTimeOfCreation(p.createdAt)}
              commentsLength={p.commentsId.length}
              likesLength={p.likes.length}
              likes={p.likes}
              dislikes={p.dislikes}
              content={p.content}
              profilePicture={p.userId.profilePicture}
              multimedia={p.multimedia}
            />
          </Fragment>
        );
      });
    }
  };

  const followRenderer = () => {
    return usersFollowing.includes(userLoggedId) ? (
      <Fragment key={Math.random()}>Unfollow</Fragment>
    ) : (user.followRequest.length && (user.followRequest?.includes(userLoggedId) || (user.followRequest?.map(u => u._id?.includes(userLoggedId))))) ? (
      <Fragment key={Math.random()}>Pending</Fragment>
    ) : (
      <Fragment key={Math.random()}>Follow</Fragment>
    );
  };

  return (
    <>
      <div className="p-container">
        <div className="profile-container">
          {loading ? (
            <div className="w-full h-full flex justify-center items-center pt-5">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="img-container">
                {/* <img
              className='profile-img'
              src='https://japanpowered.com/media/images//goku.png'
              alt='Profile Picture'>
            </img> */}
                <div className="imgChange_container">
                    {user?.profilePicture ? (
                      <>
                      <Avatar imgUrl={changeProfilePicture? changeProfilePicture: user.profilePicture} size="xxl" />
                      <input type={'file'} ref={hiddenImageInput} onChange={handleChange} accept="image/*" style={{display:"none"}}/>
                      {changeProfilePicture 
                      ? 
                      <button className=" button_changephoto" 
                      onClick={handleSavePicture}
                      type="button">
                        Save &#10004;
                      </button>
                      : 
                      null}
                      {changeProfilePicture 
                      ? 
                      <button className=" button_changephoto_cancel" 
                      type="button"
                      onClick={cancelChangePicture}>
                      <AiFillCloseCircle/>
                      </button>
                      : 
                      null}
                      </>
                    ) : (
                      <Avatar size="xxl" />
                    )}
                    {params.id === userLoggedId ? (
                      <p id="Text" onClick={handleChangePicture}>Change Photo</p>
                    ) : null}
                </div>
                    {params.id === userLoggedId && (
                    <Link to='/home/settings'>
                    <button className="settingButton">
                      <AiFillSetting/>       
                    </button>
                    </Link>          
                    ) }
              </div>
              <div className="shadow-box">
                <div className="user_description">
                  <div className="user-firstname">
                    <div className="info_container">
                      <span className="span-info">Full name</span>
                      <p>{`${user.firstname + " " + user.lastname}`}</p>
                    </div>
                    {params.id === userLoggedId ? (
                      <div className="button_container">
                        <button
                          onClick={() => {
                            setFirstname(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="user-username">
                    <div className="info_container">
                      <span className="span-info">Username</span>
                      {"@" + user.username}
                    </div>
                    {params.id === userLoggedId ? (
                      <div className="button_container">
                        <button
                          onClick={() => {
                            setUsername(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="user-followers">
                    <div className="info_container">
                      <span className="span-info">Followers</span>
                      {user.followers ? user.followers.length : null}
                    </div>
                  </div>
                  <div className="user-following">
                    <div className="info_container">
                      <span className="span-info">Following</span>
                      {user._id ? user.following.length : null}
                    </div>
                  </div>

                  <div className="user-biography">
                    <div className="info_container">
                      <span className="span-info">Biography</span>
                      {user.biography ? user.biography : "No bio yet"}
                    </div>
                    {params.id === userLoggedId ? (
                      <div className="button_container">
                        <button
                          onClick={() => {
                            setBiography(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div>
                  {params.id === userLoggedId ? 
                    user.followRequest ? (
                      <div className="button_container">
                        {
                          user.followRequest.map(r => {
                            return <div key={r._id}>
                              <img src={r.profilePicture} className='img-follow-request'/>
                              <p className="username-follow-request">{r.username}</p>
                              <button
                                onClick={() => {
                                  dispatch(cancelFollowRequest(user._id, r._id));
                                }}
                                type="button"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  dispatch(acceptFollowRequest(user._id, r._id));
                                }}
                                type="button"
                              >
                                Acept
                              </button>
                            </div>
                          })
                        }
                      </div>
                    ) : null : null}
                  </div>
                  <div className="user-mess">
                    <div className="info_container">
                      <span className="span-info">Send Message </span>
                    </div>
                    <div className="button_container">
                      <Link to={`/home/messages/${params.id}`}>
                        <button>Send Now</button>
                      </Link>
                    </div>
                  </div>
                  {userLoggedId !== userData._id ? (
                    <div className="user-follow">
                      <div className="info_container"></div>
                      <div className="button_container">
                        <button
                          className="button_container"
                          onClick={() => {
                            dispatch(
                              followOrUnfollowUser(userLoggedId, userData._id)
                            );
                          }}
                          type="button"
                        >
                          {userData.followers && followRenderer()}
                        </button>
                      </div>
                      
            <button
            className=""
            onClick={() => {
              dispatch(makeReport(userLoggedId, params.id, {reason /*crear input */ , reported: 'user'})) // reported toma valores 'post', 'comment' y 'user'
            }}
          >
            <FaExclamation /> Report user
            {/* {post && renderHeartBrokenIcon()} */}
          </button>

                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
        <hr />
        <div id="Profile-posts__container">{user._id ? renderer() : null}</div>
      </div>
      {firstname === true && (
        <EditFullname
          renderChangeRenderComponents={renderChangeRenderComponents}
          user={user}
        />
      )}
      {username === true && (
        <EditUsername
          renderChangeRenderComponents={renderChangeRenderComponents}
          user={user}
        />
      )}
      {biography === true && (
        <EditBiography
          renderChangeRenderComponents={renderChangeRenderComponents}
          user={user}
        />
      )}

    </>
  );
};

export default Profile;
