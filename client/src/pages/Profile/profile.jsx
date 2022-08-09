import "./profile.css";

import { Fragment, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";

// Components
import EditFullname from "../../components/EditFullname";
import EditUsername from "../../components/EditUsername";
import EditBiography from "../../components/EditBiography";
import ProfilePosts from "../../components/ProfilePostsRenderer";
import LoadingSpinner from "../../components/LoadingSpinner";
import Avatar from "../../components/Avatar";
import ListOfUsersRenderer from "../../components/ListOfUsersRenderer";
import ListOfUsersRendererWithButtons from "../../components/ListOfUsersRendererWithButtons";

// Actions
import {
  acceptFollowRequest,
  cancelFollowRequest,
  getUserProfile,
  modifyUser,
} from "../../redux/actions/userActions";
import { makeReport } from "../../redux/actions/reportActions";
import { followOrUnfollowUser } from "../../redux/actions/userActions";
import { getLoggedUserInfo } from "../../redux/actions/authActions";
import {
  clearAll,
  listFollowing,
  listFollowers,
} from "../../redux/actions/listOfUsersRendererActions";
import { clearProfileData } from "../../redux/reducers/userReducer.slice";
import axios from "axios";

// import Multiselect from "multiselect-react-dropdown";

//iconos
import {
  AiFillSetting,
  AiFillCloseCircle,
  AiFillMessage,
  AiFillEdit,
} from "react-icons/ai";
import { FaExclamation, FaFirstOrderAlt } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import Swal from "sweetalert2";
import { postNotification } from "../../redux/actions/notificationActions";
import { MdModeEditOutline } from "react-icons/md";

import useFilters from "../../composables/filters";

const Profile = () => {
  const params = useParams();
  const [firstname, setFirstname] = useState(false);
  const [username, setUsername] = useState(false);
  const [biography, setBiography] = useState(false);
  const [showFollowRequests, setShowFollowRequests] = useState(false);
  const userLoggedId = useSelector((state) => state.auth.loggedUser._id);
  // const loggedUser = useSelector((state) => state.auth.loggedUser);
  // const error = useSelector((state) => state.user.errorProfile);
  const loading = useSelector((state) => state.user.loadingProfile);
  const usersFollowing = useSelector(
    (state) => state.user.userProfileData.followers
  );
  const { isPremium } = useSelector((state) => state.user.userProfileData);

  const {
    _id,
    posts,
    isPrivate,
    followers,
    following,
    followRequest,
    firstname: userFirstName,
    lastname: userLastName,
    profilePicture,
    coverPicture,
    biography: userBiography,
    username: userUsername,
    isConnected,
  } = useSelector((state) => state.user.userProfileData);

  const dispatch = useDispatch();
  const [changeProfilePicture, setChangeProfilePicture] = useState("");
  const [changeCover, setChangeCover] = useState("");
  const hiddenImageInput = useRef();
  const coverImageInput = useRef();

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

  //traigo la info del perfil en el q estoy (didMount)
  useEffect(() => {
    dispatch(getUserProfile(params.id));
    return () => dispatch(clearProfileData());
  }, [params.id]);

  //COMIENZO DE FUNCION DE SUBIDAS DE FOTO DE PERFIL
  const uploadPicture = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "h0tqwdio");
    let res = await axios.post(
      "https://api.cloudinary.com/v1_1/pischetz/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const handleChangePicture = () => {
    hiddenImageInput.current.click();
  };
  const handleChangeCover = () => {
    coverImageInput.current.click();
  };

  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];
    let picture = await uploadPicture(fileUploaded);
    console.log(picture);
    setChangeProfilePicture(picture);
  };
  const handleChangeCoverCd = async (event) => {
    const fileUploaded = event.target.files[0];
    let picture = await uploadPicture(fileUploaded);
    console.log(picture);
    setChangeCover(picture);
  };

  const cancelChangePicture = () => {
    setChangeProfilePicture("");
  };
  const cancelChangeCover = () => {
    setChangeCover("");
  };

  const handleSavePicture = () => {
    dispatch(
      modifyUser(userLoggedId, { profilePicture: changeProfilePicture })
    );
    dispatch(getLoggedUserInfo());
    setChangeProfilePicture("");
  };

  const handleSaveCover = () => {
    dispatch(modifyUser(userLoggedId, { coverPicture: changeCover }));
    dispatch(getLoggedUserInfo());
    setChangeCover("");
  };

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

  const {
    currentContent,
    restoreContent,
    setCurrentContent,
    handleMultimediaFilter,
    handleDatePublishedFilter,
    handleLikesFilter,
    handleCommentsFilter,
  } = useFilters(posts);

  useEffect(() => {
    setCurrentContent(posts);
  }, [posts]);

  const [withMultimedia, setWithMultimedia] = useState(false);
  const [datePublishedAsc, setDatePublishedAsc] = useState(false);
  const [likesAsc, setLikesAsc] = useState(false);
  const [commentsQtyAsc, setCommentsQtyAsc] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (!filtersActive) {
      setWithMultimedia(false);
      setDatePublishedAsc(false);
      setLikesAsc(false);
      setCommentsQtyAsc(false);
    }

    restoreContent();
  }, [filtersActive]);

  useEffect(() => {
    handleMultimediaFilter(withMultimedia);
  }, [withMultimedia]);

  useEffect(() => {
    handleDatePublishedFilter(datePublishedAsc);
  }, [datePublishedAsc]);

  useEffect(() => {
    handleLikesFilter(likesAsc);
  }, [likesAsc]);

  useEffect(() => {
    handleCommentsFilter(commentsQtyAsc);
  }, [commentsQtyAsc]);

  const filters = () => {
    return (
      <div className="bg-[#202225] flex md:flex-row flex-col justify-center items-center p-4 md:gap-8 gap-4 text-white font-semibold md:text-base text-xs">
        <div className="flex flex-row-reverse gap-1">
          <label htmlFor="">
            {filtersActive ? "Reset Filters" : "Use filters"}
          </label>
          <input
            type="checkbox"
            checked={filtersActive}
            onChange={(e) => setFiltersActive(e.target.checked)}
          />
        </div>
        <div
          className={`flex flex-row-reverse gap-1 ${
            filtersActive ? "" : "opacity-75"
          }`}
        >
          <label htmlFor="">
            {!withMultimedia ? "With Multimedia" : "No Multimedia"}
          </label>
          <input
            type="checkbox"
            checked={withMultimedia}
            onChange={(e) => setWithMultimedia(e.target.checked)}
            disabled={!filtersActive}
          />
        </div>
        <div
          className={`flex flex-row-reverse gap-1 ${
            filtersActive ? "" : "opacity-75"
          }`}
        >
          <label htmlFor="">
            {!datePublishedAsc ? "Most recent" : "Most older"}
          </label>
          <input
            type="checkbox"
            checked={datePublishedAsc}
            onChange={(e) => setDatePublishedAsc(e.target.checked)}
            disabled={!filtersActive || likesAsc || commentsQtyAsc}
          />
        </div>
        <div
          className={`flex flex-row-reverse gap-1 ${
            filtersActive ? "" : "opacity-75"
          }`}
        >
          <label htmlFor=""> {likesAsc ? "Most likes" : "Least likes"} </label>
          <input
            type="checkbox"
            checked={likesAsc}
            onChange={(e) => setLikesAsc(e.target.checked)}
            disabled={!filtersActive || datePublishedAsc || commentsQtyAsc}
          />
        </div>
        <div
          className={`flex flex-row-reverse gap-1 ${
            filtersActive ? "" : "opacity-75"
          }`}
        >
          <label htmlFor="">
            {commentsQtyAsc ? "Most comments" : "Least commented"}
          </label>
          <input
            type="checkbox"
            checked={commentsQtyAsc}
            onChange={(e) => setCommentsQtyAsc(e.target.checked)}
            disabled={!filtersActive || datePublishedAsc || likesAsc}
          />
        </div>
      </div>
    );
  };

  let renderer = () => {
    if (currentContent && currentContent.length > 0) {
      return (
        <>
          {filters()}
          {currentContent.map((p) => {
            return (
              <Fragment key={p._id}>
                <ProfilePosts
                  userId={p.userId._id}
                  postNumber={p._id}
                  fullname={`${userFirstName + " " + userLastName}`}
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
          })}
        </>
      );
    }
  };

  const followRenderer = () => {
    return usersFollowing.includes(userLoggedId) ? (
      <Fragment key={Math.random()}>Unfollow</Fragment>
    ) : followRequest.length && followRequest?.includes(userLoggedId) ? (
      <Fragment key={Math.random()}>Pending</Fragment>
    ) : (
      <Fragment key={Math.random()}>Follow</Fragment>
    );
  };

  const renderFollowers = () => {
    setShowFollowers(!showFollowers);
    dispatch(listFollowers(_id));
  };

  const renderFollowing = () => {
    setShowFollowing(!showFollowing);
    dispatch(listFollowing(_id));
  };

  const handleClose = () => {
    showFollowers !== false && setShowFollowers(false);
    showFollowing !== false && setShowFollowing(false);
    showFollowRequests !== false && setShowFollowRequests(false);
    dispatch(clearAll());
  };

  const handleClickOnMostrarPendientes = (e) => {
    e.preventDefault();
    setShowFollowRequests(!showFollowRequests);
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
              <div className={`img-container`}>
                {(isPremium === true && coverPicture) || changeCover ? (
                  <img
                    className="w-full h-full rounded-md"
                    src={changeCover ? changeCover : coverPicture}
                  />
                ) : null}
                {changeCover !== "" ? (
                  <button
                    type="button"
                    className="absolute left-1
                  bg-green-600 rounded-md text-white p-1 bottom-1"
                    onClick={handleSaveCover}
                  >
                    Save &#10004;
                  </button>
                ) : null}
                {changeCover !== "" ? (
                  <button
                    className="absolute left-1 bg-red-600 text-white p-1 rounded-md top-1"
                    type="button"
                    onClick={cancelChangeCover}
                  >
                    Cancel X
                  </button>
                ) : null}
                <input
                  type={"file"}
                  ref={coverImageInput}
                  onChange={handleChangeCoverCd}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {/* ${isPremium && bg-[url(img)]} */}
                {/* <img
              className='profile-img'
              src='https://japanpowered.com/media/images//goku.png'
              alt='Profile Picture'>
            </img> */}
                {isPremium === true && _id === userLoggedId ? (
                  <button
                    onClick={handleChangeCover}
                    className="transition-all bg-green-600 absolute right-1 bottom-1 text-white p-1 rounded-md hover:bg-green-800"
                  >
                    <MdModeEditOutline />
                  </button>
                ) : null}
                <div className="imgChange_container">
                  {profilePicture ? (
                    <>
                      <Avatar
                        imgUrl={
                          changeProfilePicture
                            ? changeProfilePicture
                            : profilePicture
                        }
                        size="xxl"
                      />
                      <input
                        type={"file"}
                        ref={hiddenImageInput}
                        onChange={handleChange}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      {changeProfilePicture ? (
                        <button
                          className=" button_changephoto"
                          onClick={handleSavePicture}
                          type="button"
                        >
                          Save &#10004;
                        </button>
                      ) : null}
                      {changeProfilePicture ? (
                        <button
                          className=" button_changephoto_cancel"
                          type="button"
                          onClick={cancelChangePicture}
                        >
                          <AiFillCloseCircle />
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <Avatar size="xxl" />
                  )}
                  {params.id === userLoggedId ? (
                    <p id="Text" onClick={handleChangePicture}>
                      Change Photo
                    </p>
                  ) : null}
                </div>
                {params.id === userLoggedId && (
                  <Link to="/home/settings">
                    <button className="settingButton">
                      <AiFillSetting />
                    </button>
                  </Link>
                )}
              </div>
              <div className="shadow-box">
                <div className="user_description">
                  <div className="user-firstname justify-between">
                    <div className="info_container">
                      <span className="span-info">Full name</span>
                      <p>
                        {`${userFirstName + " " + userLastName}`}{" "}
                        {isPremium ? "(Premium)" : null}
                      </p>
                    </div>
                    {params.id === userLoggedId ? (
                      <button
                        className="bg-green-600 hover:bg-green-700 my-2 flex items-center justify-center gap-1 font-semibold"
                        onClick={() => {
                          setFirstname(true);
                        }}
                        type="button"
                      >
                        <AiFillEdit />
                        Edit
                      </button>
                    ) : null}
                  </div>
                  <div className="user-username justify-between">
                    <div className="info_container">
                      <span className="span-info">Username</span>
                      <Fragment>
                        <div className="username_conected">
                          {"@" + userUsername}
                          {isConnected && (
                            <FaFirstOrderAlt color="green" className="ml-2" />
                          )}
                        </div>
                      </Fragment>
                    </div>
                    {params.id === userLoggedId ? (
                      <button
                        className="bg-green-600 hover:bg-green-700 my-2 flex items-center justify-center gap-1 font-semibold"
                        onClick={() => {
                          setUsername(true);
                        }}
                        type="button"
                      >
                        <AiFillEdit />
                        Edit
                      </button>
                    ) : null}
                  </div>
                  <div className="user-followers">
                    <div className="info_container ">
                      <span className="span-info">Followers</span>

                      <section className="flex items-center">
                        {followers ? followers.length : 0}
                        <span
                          className="followingAndFollowersButton ml-1 text-lg"
                          onClick={renderFollowers}
                        >
                          <AiFillEye className="transition-all text-white hover:text-green-600" />
                        </span>
                      </section>
                    </div>
                  </div>
                  <div className="user-following">
                    <div className="info_container">
                      <span className="span-info">Following</span>
                      <section className="flex items-center">
                        {_id ? following.length : 0}
                        <span
                          className="followingAndFollowersButton ml-1 text-lg"
                          onClick={renderFollowing}
                        >
                          <AiFillEye className="transition-all text-white hover:text-green-600" />
                        </span>
                      </section>
                    </div>
                  </div>
                  <div className="user-biography justify-between">
                    <div className="info_container">
                      <span className="span-info">Biography</span>
                      {userBiography ?? "No biography added yet"}
                    </div>
                    {params.id === userLoggedId ? (
                      <button
                        className="bg-green-600 hover:bg-green-700 my-2 flex items-center justify-center gap-1 font-semibold"
                        onClick={() => {
                          setBiography(true);
                        }}
                        type="button"
                      >
                        <AiFillEdit />
                        Edit
                      </button>
                    ) : null}
                  </div>

                  {/* Boton que se renderiza cuando hay follow requests */}
                  {followRequest?.length > 0 && params.id === userLoggedId ? (
                    <button
                      className="bg-[#4E864C] rounded-md mr-3 p-1 pl-3 pr-3 ml-3"
                      onClick={handleClickOnMostrarPendientes}
                    >
                      {" "}
                      Follow Requests{" "}
                    </button>
                  ) : null}

                  <div className="my-4">
                    <Link
                      to={`/home/messages/${params.id}`}
                      className="flex gap-2 items-center m-none bg-blue-600 py-1 rounded-md justify-center hover:bg-blue-700 my-2 w-full font-semibold"
                    >
                      <AiFillMessage />
                      Send Now
                    </Link>

                    {userLoggedId !== _id ? (
                      <button
                        className="bg-green-600 py-1 rounded-md hover:bg-green-700 my-2 w-full font-semibold"
                        onClick={() => {
                          dispatch(followOrUnfollowUser(userLoggedId, _id));
                        }}
                        type="button"
                      >
                        {followers && followRenderer()}
                      </button>
                    ) : null}

                    {params.id != userLoggedId && (
                      <button
                        className="flex justify-center items-center gap-1 bg-red-600 py-1 rounded-md hover:bg-red-700 my-2 w-full font-semibold"
                        onClick={() => {
                          Swal.fire({
                            background: "#4c4d4c",
                            color: "white",
                            title: "Submit your Report",
                            input: "textarea",
                            inputAttributes: {
                              autocapitalize: "off",
                            },
                            showCancelButton: true,
                            confirmButtonText: "Submit",
                            showLoaderOnConfirm: true,
                            preConfirm: (login) => {
                              dispatch(
                                makeReport(userLoggedId, params.id, {
                                  reason: login,
                                  reported: "user",
                                })
                              );
                            },
                            allowOutsideClick: () => !Swal.isLoading(),
                          });
                        }}
                      >
                        <FaExclamation /> Report user
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {(isPrivate && usersFollowing?.includes(userLoggedId)) ||
        userLoggedId === params.id ||
        !isPrivate ? (
          <div id="Profile-posts__container">{_id ? renderer() : null}</div>
        ) : null}
      </div>
      {firstname === true && (
        <EditFullname
          renderChangeRenderComponents={renderChangeRenderComponents}
          user={username}
        />
      )}
      {username === true && (
        <EditUsername
          renderChangeRenderComponents={renderChangeRenderComponents}
          user={username}
        />
      )}
      {biography === true && (
        <EditBiography
          renderChangeRenderComponents={renderChangeRenderComponents}
          user={username}
        />
      )}
      {/* Renderizador de followers */}
      {showFollowing === true && (
        <ListOfUsersRenderer
          titleToRender={"following"}
          userId={_id}
          closeRenderFunction={handleClose}
        />
      )}
      {showFollowers === true && (
        <ListOfUsersRenderer
          titleToRender={"followers"}
          userId={_id}
          closeRenderFunction={handleClose}
        />
      )}
      {showFollowRequests === true && (
        <ListOfUsersRendererWithButtons
          arrayOfPeopleToRender={followRequest}
          titleToRender={"followRequests"}
          userId={_id}
          closeRenderFunction={handleClose}
        />
      )}
    </>
  );
};

export default Profile;
