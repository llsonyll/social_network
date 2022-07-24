import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { createPost } from "../../redux/actions/postActions";
import Avatar from "../Avatar";

const NewPost = ({ showModal, setShowModal }) => {
  const [postInput, setPostInput] = useState("");
  const dispatch = useDispatch()
  const loggedUser = useSelector((store) => store.auth.loggedUser)
  const location = useLocation()

  const handleInputPost = (e) => setPostInput(e.target.value);

  const handleNewPost = (e) => {
    e.preventDefault();
    console.log(postInput, loggedUser);
    if(postInput){
      dispatch(createPost(postInput, loggedUser._id, location.pathname))
    }
    setPostInput("");
  };

  const handleInputImage = () => console.log("Input Image");

  const handlePublishPost = () => {
    console.log("Publish Post");
    setShowModal(false);
  };

  return (
    <div
      data-modal-placement="top-middle"
      className={`absolute inset-0 z-50 bg-black/40 items-center justify-center overflow-y-auto overflow-x-hidden ${
        showModal ? "flex" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
        <div className="relative rounded-lg shadow bg-[#363636]">
          <button
            type="button"
            className="absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 "
            data-modal-toggle="popup-modal"
            onClick={() => setShowModal(false)}
          >
            <span className="text-2xl">
              <AiFillCloseSquare />
            </span>
          </button>
          <div className="py-5 px-6 lg:px-8 flex">
            <Avatar size="l" />
            <form className="space-y-8 flex-1 mx-3" onSubmit={handleNewPost}>
              <textarea
                id="message"
                rows="4"
                className="block p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Your message..."
                onChange={handleInputPost}
                value={postInput}
              ></textarea>
              {/* TODO: quitarlo del form para evitar el submit del mismo */}
              <div className=" relative flex items-baseline justify-between after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
                <button
                  className="text-white text-2xl hover:opacity-50"
                  onClick={handleInputImage}
                >
                  <FaImage />
                </button>
                <button
                  className="bg-green-600 text-white py-1 px-7 rounded-md shadow-lg text-sm"
                  onClick={handlePublishPost}
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
