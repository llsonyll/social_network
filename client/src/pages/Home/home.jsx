import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";
import { dummyFriendPost } from "../../data/dummyPostFriend";

import FriendPostTile from "../../components/FriendPostTile";
import HomePostCard from "../../components/HomePostCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHomePosts, getUserFollowings } from "../../redux/actions/userActions";
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingSpinner from "../../components/LoadingSpinner";


const Home = () => {
  // let {following} = useSelector(state => state..loggedUser)
  
  let {homePostsData , control} = useSelector((state) => state.user);
  let {userFollowings} = useSelector((state) => state.user);
  
  const homePosts = homePostsData;
  const userId = useSelector((state) => state.auth.loggedUser._id);
  const dispatch = useDispatch();
  let page = 0;
  let pages = '';
  
  useEffect(() => {
    userId ? dispatch(getHomePosts(userId, parseInt(page))) : null;
    
  }, [userId]);
  
  useEffect(() => {
    dispatch(getUserFollowings(userId))
  }, [])
  

  useEffect(() => {

    pages = homePosts[homePosts.length - 1] 

  }, [homePosts])
  
  const handlePage = () => {
    page === 0 ? (page = 1) : null;
    if (homePosts.length === page * 20) {
      //si la cantidad de post es igual a pagina + 20
      // console.log("hay q traer mas posts")
      dispatch(getHomePosts(userId, parseInt(page)));
      page++;
      console.log(control);
    }

  };
  return (
    <div
      className="flex-1 flex px-4 md:pl-80 md:pr-5 pt-3 md:pt-9 gap-8 bg-[#2e2e2e] relative "
      id="contenedor_home"
    >
      <div
        className="fixed left-0 top-16 h-screen w-72 bg-stone-800 hidden md:flex  p-6 flex-col items-center overflow-auto"
        id="contenedor_friends"
      >
        <div id='title_friend_Postile' className="text-white font-normal text-xl mb-4 uppercase tracking-wide">
          <h1> - Following -</h1>
        </div>
        {
        userFollowings ?
        userFollowings.map((friend) => (
          <FriendPostTile className="friends" img={friend.profilePicture} username={friend.username} key={friend._id} userId={friend._id}/>
        )) : <p>...</p>
        }
      </div>
      <InfiniteScroll dataLength={homePosts.length} hasMore={control} next={handlePage} loader={<LoadingSpinner/>}>
          <div className="flex-1 flex flex-col gap-5 h-full">
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
                        page = {page}
                        profilePicture = {p.userId.profilePicture}
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
