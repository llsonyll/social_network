import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";
import { dummyFriendPost } from "../../data/dummyPostFriend";

import FriendPostTile from "../../components/FriendPostTile";
import HomePostCard from "../../components/HomePostCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getHomePosts,
  getUserFollowings,
} from "../../redux/actions/userActions";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../../components/LoadingSpinner";
import { clearHomePosts } from "../../redux/reducers/userReducer.slice";
import {AiOutlineSearch} from 'react-icons/ai'
const Home = () => {
  let { homePostsData } = useSelector((state) => state.user);
  const getControl = useSelector((state) => state.user.control);
  let { userFollowings } = useSelector((state) => state.user);
  const homePosts = homePostsData;
  const userId = useSelector((state) => state.auth.loggedUser._id);
  const dispatch = useDispatch();
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [pageFalse, setPageFalse] = useState(0);

  useEffect(() => {
    if (userId && getControl !== "") {
      var time
      clearTimeout(time)  
      time = setTimeout(() => {
        dispatch(getHomePosts(userId, parseInt(page), "true"));
      })
      
    }
    dispatch(getUserFollowings(userId));
    return () => dispatch(clearHomePosts());
  }, [userId]);

  useEffect(() => {
    if (getControl === "true") {
      dispatch(getHomePosts(userId, parseInt(page), "true"));
      // console.log(page)
    } else if (getControl === "false") {
      // if(page > 0 ) setPageFalse(0)
      console.log("GETCONTROL ES FALSE");

      dispatch(getHomePosts(userId, parseInt(pageFalse), "false"));
      setPageFalse(pageFalse + 1);
    }
    if (getControl === "") setControl(false);
  }, [page, getControl]);

  const handlePage = () => {
    if (getControl === "") {
      setControl(false);
    } else {
    }
    page === 0 ? setPage(1) : null;
    console.log("HANDLE PAGE");
    if (
      homePosts.length === page * 10 ||
      homePosts.length === page * 10 + 10 ||
      getControl === "false"
    ) {
      getControl === "true" ? setPage(page + 1) : setPage(page - 1);
    }
  };
  const handleFollowing = (value) => {
    dispatch(getUserFollowings(userId, value))
    console.log("TRAER SEGUIDOS HOME")
  }
  return (
    <div
      className="flex-1 flex px-4 md:pl-80 md:pr-5 pt-3 md:pt-9 gap-8 bg-[#2e2e2e] relative "
      id="contenedor_home"
    >
      <div
        className="fixed left-0 top-0 h-screen w-72 bg-stone-800 hidden md:flex  p-6 flex-col items-center overflow-auto pt-20"
        id="contenedor_friends"
        >
        <div
          id="title_friend_Postile"
          className="text-white font-normal text-xl mb-4 uppercase tracking-wide "
          >
          <h1> - Following -</h1>
          <div className="input-friends_container">
            <AiOutlineSearch className="icon-home-search"/>
            <input type="text" placeholder="Your friend" onChange={(e) => handleFollowing(e.target.value)}/>
          </div>
        </div>  
            {
              userFollowings ? (
              userFollowings.map((friend) => (
                <FriendPostTile
                className="friends"
                img={friend.profilePicture}
                username={friend.username}
                key={friend._id}
                userId={friend._id}
                isConnected={friend.isConnected}
                />
                ))
                ) 
                : (
                  <p>...</p>
                  )
            }
      </div>
      <InfiniteScroll
        dataLength={homePosts.length}
        hasMore={control}
        next={handlePage}
        loader={<LoadingSpinner />}
        >
        <div className="flex-1 flex flex-col gap-5 h-full items-center">
        <div className="contenedorFriends-responsive_container">
          {userFollowings ? (
            userFollowings.map((friend) => (
              <FriendPostTile
              className="friends"
              img={friend.profilePicture}
              username={friend.username}
              key={friend._id}
              userId={friend._id}
              />
              ))
              ) : (
                <p>...</p>
                )}  
        </div>
          {
            homePosts.length > 0
              ? homePosts.map((p) => {
                  return (
                    <HomePostCard
                      key={p._id}
                      postId={p._id}
                      content={p.content}
                      date={p.createdAt}
                      likes={p.likes}
                      multimedia={p.multimedia}
                      dislikes={p.dislikes}
                      commentsId={p.commentsId}
                      userId={p.userId._id}
                      username={p.userId.username}
                      // followRequest={p.userId?.followRequest}
                      page={page}
                      profilePicture={p.userId.profilePicture}
                    />
                  );
                })
              : null //que devuelva mensaje o componente de que no hay posts
          }
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
