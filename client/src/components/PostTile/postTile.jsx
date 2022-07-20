import Avatar from "../Avatar";

import { FaHeart } from "react-icons/fa";

const PostTile = () => {
  const handleLikePost = () => {
    console.log("Like Post");
  };

  return (
    <>
      <div className="flex ">
        <Avatar imgUrl="https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg" />
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="userInfo mb-3">
            <div className="text-white font-medium">Username</div>
            <div className="text-white opacity-50 text-xs">3hr</div>
          </div>
          <div className="text-white font-light text-base">
            Duis excepteur qui dolor anim non sit cillum velit sint deserunt.
            Consequat fugiat minim tempor nulla sunt ipsum incididunt enim ipsum
            minim nulla elit magna. Aute amet exercitation incididunt pariatur
            aliquip laborum culpa consectetur proident elit anim sint anim. Anim
            anim ut laborum laborum dolore. Officia nisi reprehenderit excepteur
            nisi. Esse tempor occaecat occaecat ex quis.
          </div>
          <div className="actions flex gap-3 items-center justify-end mt-2 text-white">
            <a href="#" className="opacity-50 text-sm font-light">
              Comment
            </a>
            <div className="flex items-center  gap-1">
              <button onClick={handleLikePost}>
                <FaHeart />
              </button>
              12
            </div>
          </div>

          <div className="comments"></div>
        </div>
      </div>
    </>
  );
};

export default PostTile;
