import { AiFillCloseSquare } from "react-icons/ai";

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
          <div className="results"></div>
        </>
      </div>
    </div>
  );
};

export default AdminBoard;
