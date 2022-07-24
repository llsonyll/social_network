import Friends from "./Cards/Friends";
import Post from "./Cards/Post";
import "./home.css";
import { dummyFriendPost } from "../../data/dummyPostFriend";

import FriendPostTile from "../../components/FriendPostTile";
import HomePostCard from "../../components/HomePostCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHomePosts } from "../../redux/actions/userActions";

const Home = () => {
  let homePosts = useSelector((state) => state.user.homePostsData);
  const userId = useSelector((state) => state.auth.loggedUser._id);
  const dispatch = useDispatch();
  let page = 0;

  useEffect(() => {
    userId ? dispatch(getHomePosts(userId, parseInt(page))) : null;
  }, [userId]);

  const handlePage = () => {
    page === 0 ? (page = 1) : null;
    if (homePosts.length === page * 20) {
      //si la cantidad de post es igual a pagina + 20
      // console.log("hay q traer mas posts")
      dispatch(getHomePosts(userId, parseInt(page)));
      page++;
    }
    console.log("entra al handle");
  };

  return (
    <div className="flex-1 flex px-3 pt-3 md:px-11 md:pt-9 gap-8 bg-[#2e2e2e]">
      <div className="bg-stone-800 hidden md:flex basis-1/5 p-6 flex-col items-center rounded-md mb-3 md:mb-11">
        <div className="text-white font-normal text-xl mb-4"> Following </div>
        {dummyFriendPost.map((tile) => (
          <FriendPostTile tile={tile} key={tile.postId} />
        ))}
      </div>
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
                    dislikes={p.dislikes}
                    userId={p.userId._id}
                    username={p.userId.username}
                    page = {page}
                  />
                );
              })
            : null //que devuelva mensaje o componente de que no hay posts
        }

        {homePosts.length === 20 ? (
          <button className="btn" onClick={handlePage}>
            VIEW MORE TEST
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
