import InputText from "../InputText";
import ActionButton from "../ActionButton";
import LoadingSpinner from "../LoadingSpinner";
import SearchUsersBox from "../SearchUsersBox";

import { AiFillStar } from "react-icons/ai";

import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";

const AdminSearchUser = () => {
  const [userInfo, setUserInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearchResults, setLoadingSearchResults] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("SEARCH", searchText);
    setLoadingSearchResults(true);

    try {
      const { data } = await apiConnection.get(`user/browser/${searchText}`);
      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
    }

    setLoadingSearchResults(false);
  };

  useEffect(() => {
    if (searchText.length === 0) {
      setSearchResults([]);
      setLoadingSearchResults(true);
    }
  }, [searchText]);
  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center gap-8">
        <div className="text-green-700 font-bold">
          Search account by id or email:
        </div>
        <div className="w-full relative">
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText.length > 0 && (
            <div className="absolute w-full bg-neutral-600 rounded-md translate-y-2 shadow-xl">
              {loadingSearchResults ? (
                <div className="p-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="">
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => {
                      return (
                        <SearchUsersBox
                          username={user.username}
                          key={user._id}
                          id={user._id}
                        />
                      );
                    })
                  ) : (
                    <div className="p-2 text-white font-medium text-center">
                      {`Sin resultados a la busqueda "${searchText}"`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Search"
          className="bg-green-800 text-white md:px-5 px-3 py-2 rounded-md cursor-pointer focus:bg-green-700"
        />
      </form>
      <div className="results text-white md:mt-6 mt-3">
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

          <div className="flex flex-col md:mt-4 mt-2 gap-2">
            <button
              className="bg-green-700  py-1 font-semibold rounded-sm disabled:opacity-50"
              disabled
            >
              Guardar
            </button>
            <button className="bg-red-500  py-1 font-semibold rounded-sm">
              Suspender
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSearchUser;
