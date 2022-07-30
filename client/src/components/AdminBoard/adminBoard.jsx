import { AiFillCloseSquare, AiFillStar } from "react-icons/ai";
import InputText from "../InputText";
import ActionButton from "../ActionButton";

const AdminBoard = ({ showAdmin, setShowAdmin }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("SEARCH");
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-[#262626] shadow-xl rounded-sm relative md:p-12 p-6">
        <div className="text-white font-bold text-4xl text-center md:mb-12 mb-6 ">
          Admin Dashboard
        </div>
        <button
          type="button"
          className="absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-stone-800"
          data-modal-toggle="popup-modal"
          onClick={() => setShowAdmin(!showAdmin)}
        >
          <span className="text-2xl">
            <AiFillCloseSquare />
          </span>
        </button>
        <>
          <form onSubmit={handleSearch} className="flex items-center gap-8">
            <div className="text-green-700 font-bold">
              Search account by id or email:
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
            />
            <input
              type="submit"
              value="Search"
              className="bg-green-700 text-white md:px-5 px-3 py-2 rounded-md cursor-pointer"
            />
          </form>
          <div className="results text-white md:my-6 my-3">
            <div className="user_info px-9 flex flex-col gap-2">
              <InputText value="Firstname" />
              <InputText value="Lastname" />
              <InputText value="Username" />
              <div className="info_row flex gap-4">
                <div className="basis-1/4 font-light"> Password </div>
                <div className="basis-3/4 flex justify-end">
                  <ActionButton
                    label="Restaurar"
                    action={() => {}}
                    bg="bg-blue-500"
                  />
                </div>
              </div>
              <InputText value="Email" />
              <InputText value="Biography" />
              <div className="info_row flex gap-4">
                <div className="basis-1/4 font-light"> isAdmin </div>
                <div className="basis-3/4 flex gap-4">
                  <input type="checkbox" /> Yes
                  <input type="checkbox" /> No
                </div>
              </div>
              <div className="info_row flex gap-4">
                <div className="basis-1/4 font-light"> isPremium </div>
                <div className="basis-3/4 flex gap-4">
                  <input type="checkbox" /> Yes
                  <input type="checkbox" /> No
                </div>
              </div>
              <div className="info_row flex gap-4">
                <div className="basis-1/4 font-light"> isPrivate </div>
                <div className="basis-3/4 flex gap-4">
                  <input type="checkbox" /> Yes
                  <input type="checkbox" /> No
                </div>
              </div>
              <div className="info_row flex gap-4">
                <div className="basis-1/4 font-light"> Review </div>
                <div className="basis-3/4 flex gap-2 items-center">
                  <div className="flex items-center">
                    <div className="font-semibold">5</div>
                    <AiFillStar />
                  </div>
                  <input
                    type="text"
                    disabled
                    className="focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col md:my-4 my-2 gap-2">
                <button
                  className="bg-green-700 cursor-pointer py-1 font-semibold rounded-sm disabled:opacity-50"
                  disabled
                >
                  Guardar
                </button>
                <button className="bg-red-500 cursor-pointer py-1 font-semibold rounded-sm">
                  Suspender
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default AdminBoard;
