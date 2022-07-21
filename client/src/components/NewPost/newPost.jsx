import { AiFillCloseSquare } from "react-icons/ai";
import { FaImage } from "react-icons/fa";
import Avatar from "../Avatar";

const NewPost = ({ showModal, setShowModal }) => {
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
            <form className="space-y-8 flex-1 mx-3" action="#">
              <textarea
                id="message"
                rows="4"
                class="block p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Your message..."
              ></textarea>

              <div className=" relative flex items-baseline justify-between after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
                <button className="text-white text-2xl">
                  <FaImage />
                </button>
                <button className="bg-green-600 text-white py-1 px-7 rounded-md shadow-lg text-sm">
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
