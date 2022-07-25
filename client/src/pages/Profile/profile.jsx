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
import { getUserProfile } from "../../redux/actions/userActions";
import LoadingSpinner from "../../components/LoadingSpinner";
import Avatar from "../../components/Avatar";
import { clearProfileData } from "../../redux/reducers/userReducer.slice";

const Profile = () => {
  const params = useParams();
  const [firstname, setFirstname] = useState(false);
  const [username, setUsername] = useState(false);
  const [biography, setBiography] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(false);
  const userLogged = useSelector((state) => state.auth.loggedUser._id);
  const userData = useSelector((state) => state.user.userProfileData);
  const dispatch = useDispatch();

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
    await dispatch(getUserProfile(params.id));
    setLoading(false);
  };

  //traigo la info del perfil en el q estoy (didMount)
  useEffect(() => {
    handleGetUserProfile();
    return () => dispatch(clearProfileData());
  }, [params.id]);

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
              content={p.content}
              profilePicture={p.userId.profilePicture}
            />
          </Fragment>
        );
      });
    }
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
                {user?.profilePicture ? (
                  <Avatar imgUrl={user.profilePicture} size="xxl" />
                ) : (
                  <Avatar size="xxl" />
                )}
              </div>
              <div className="shadow-box">
                <div className="user_description">
                  <div className="user-firstname">
                    <div className="info_container">
                      <span className="span-info">Full name</span>
                      <p>{`${user.firstname + " " + user.lastname}`}</p>
                    </div>
                    <div className="button_container">
                      {params.id === userLogged ? (
                        <button
                          onClick={() => {
                            setFirstname(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="user-username">
                    <div className="info_container">
                      <span className="span-info">Username</span>
                      {"@" + user.username}
                    </div>
                    <div className="button_container">
                      {params.id === userLogged ? (
                        <button
                          onClick={() => {
                            setUsername(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="user-followers">
                    <div className="info_container">
                      <span className="span-info">Followers</span>
                      {user._id ? user.followers.length : null}
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
                    <div className="button_container">
                      {params.id === userLogged ? (
                        <button
                          onClick={() => {
                            setBiography(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      ) : null}
                    </div>
                  </div>
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
      {/* {image === true && <EditLastname renderChangeRenderComponents={renderChangeRenderComponents} user={user} />} */}
      {/* Espacio para mapear 20 objetos con el componente renderizador de los posts y los 20 posts que le pido a la db */}
    </>
  );
};

export default Profile;
