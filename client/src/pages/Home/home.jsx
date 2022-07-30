import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";
import { dummyFriendPost } from "../../data/dummyPostFriend";

import FriendPostTile from "../../components/FriendPostTile";
import HomePostCard from "../../components/HomePostCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHomePosts } from "../../redux/actions/userActions";
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingSpinner from "../../components/LoadingSpinner";

const Home = () => {
  let {homePostsData , control} = useSelector((state) => state.user);
  const userId = useSelector((state) => state.auth.loggedUser._id);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0)
  const [pageFalse, setPageFalse] = useState(0)
  const [controlScroll ,setControlScroll ]= useState(true)
  const homePosts = homePostsData;
  const getControl = control

  useEffect(() => {
    userId ? dispatch(getHomePosts(userId, parseInt(page), "true")) : null;

  }, [userId]);
  

  useEffect(() => {
    if(getControl === "true") {
    dispatch(getHomePosts(userId, parseInt(page), "true"));
    console.log("se despacho la accion",page)
    } else if(getControl === "false"){

        console.log("GETCONTROL ES FALSE", )

        dispatch(getHomePosts(userId, parseInt(pageFalse), "false"));
        setPageFalse(pageFalse+1)
    }
    if(getControl === "") setControlScroll(false)
  }, [page, getControl])
  
  const handlePage = () => {
    page === 0 ? setPage(1) : null;
    if(getControl === ""){
      setControlScroll(false)
      console.log('TIENE QUE PASAR A FALSE LOCOOOOOOOOO')
    }
    if (homePosts.length === page * 10 || homePosts.length === (page * 10) + 10 || getControl === "false")  {
      //si la cantidad de post es igual a pagina + 20
      console.log("hay q traer mas posts")
      getControl === "true" ? setPage(page+1) : setPage(page-1)
    }
  } 
  return (
    <div
      className="flex-1 flex px-4 md:pl-80 md:pr-5 pt-3 md:pt-9 gap-8 bg-[#2e2e2e] relative "
      id="contenedor_home"
    >
      <div
        className="fixed left-0 top-16 h-screen w-72 bg-stone-800 hidden md:flex  p-6 flex-col items-center overflow-auto"
        id="contenedor_friends"
      >
        <div className="text-white font-normal text-xl mb-4 uppercase tracking-wide">
          Following
        </div>
        {/* {dummyFriendPost.map((tile) => (
          <FriendPostTile className="friends" tile={tile} key={tile.postId} />
        ))} */}
      </div>
      <InfiniteScroll dataLength={homePosts.length} hasMore={controlScroll} next={handlePage} loader={<LoadingSpinner/>}>
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
