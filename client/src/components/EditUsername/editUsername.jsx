import "../../pages/Profile";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import Avatar from "../Avatar";
import { useDispatch, useSelector } from "react-redux";
import { modifyUser } from "../../redux/actions/userActions";
import { errorAlerts, goodAlerts } from "../../utils/SweetAlertTypes/SweetAlerts";

const EditUsername = ({ renderChangeRenderComponents, user }) => {
  const [username, setUsername] = useState("");
  const loggedUser = useSelector((store) => store.auth.loggedUser);
  const { username: currentUserName } = useSelector(
    (state) => state.user.userProfileData
  );

  const dispatch = useDispatch();

  function handleChange(e) {
    setUsername(e.target.value);
  }

  const handleOnCancel = () => {
    renderChangeRenderComponents("username");
  };

  const handleOnSubmit = () => {
    if (username) {
      if (username.split(" ").length !== 1) {
        return errorAlerts("Username should not have empty spaces");
      }

      if (username.trim().length > 13) {
        return errorAlerts("Username should not have no more than 13 characters");
      }

      try {
        dispatch(modifyUser(loggedUser._id, { username: username }));
        goodAlerts("You changed your username!");
        renderChangeRenderComponents("username");
      } catch (error) {
        console.log(error);
      }
    } else {
      errorAlerts("You need to have an username!");
    }
  };

  return (
    <div
      data-modal-placement="top-middle"
      className={` fixed inset-0 z-50 bg-black/40 items-center justify-center overflow-y-auto overflow-x-hidden flex`}
    >
      <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
        <div className="relative rounded-lg shadow bg-[#363636]">
          <div className="text-white text-center pt-10 text-xl">
            Write a new username and submit it
          </div>

          <button
            type="button"
            className="absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 "
            data-modal-toggle="popup-modal"
            onClick={() => handleOnCancel()}
          >
            <span className="text-2xl">
              <AiFillCloseSquare />
            </span>
          </button>
          <div className="py-5 px-6 lg:px-8 flex">
            <form className="space-y-8 flex-1 mx-3" action="#">
              <input
                id="message"
                rows="4"
                className="block outline-none bg-stone-800 p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={currentUserName}
                onChange={handleChange}
                value={username}
                maxLength="15"
              ></input>

              <div className=" relative text-center flex items-baseline justify-center after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleOnSubmit();
                  }}
                  className="block bg-green-600 text-white  mt-5 py-2 px-8 rounded-md shadow-lg text-sm transition-all hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUsername;
