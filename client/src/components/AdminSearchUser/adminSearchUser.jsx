import InputText from "../InputText";
import ActionButton from "../ActionButton";
import LoadingSpinner from "../LoadingSpinner";
import SearchUsersBox from "../SearchUsersBox";

import { AiFillStar } from "react-icons/ai";

import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";

const AdminSearchUser = () => {
  const [userInfo, setUserInfo] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    biography: "",
    isAdmin: false,
    isPremium: false,
    isPrivate: false,
    review: "",
  });

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

  const handleSelection = async (id) => {
    try {
      const { data } = await apiConnection.get(`user/${id}`);
      console.log(data);
      setSearchText("");
      setSearchResults("");
      setUserInfo(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserSelectedUpdate = async () => {
    if (!userInfo._id) return;
    // {username, firstname, lastname, biography, profilePicture }

    try {
      const { data } = await apiConnection.put(
        `user/${userInfo._id}`,
        userInfo
      );
      console.log(data);
      // return dispatch(userProfile(data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckInputChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleTextInputChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            <div className="absolute w-full bg-neutral-600 rounded-md translate-y-2 shadow-xl z-10">
              {loadingSearchResults ? (
                <div className="p-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="">
                  {searchResults.length > 0 ? (
                    searchResults.map(({ username, _id, profilePicture }) => {
                      return (
                        <div
                          className=" top-auto left-0 right-0 bg-[#363636] px-2 py-4 shadow-lg outline-2 m-1 rounded-lg hover:bg-neutral-800 active:bg-neutral-900 cursor-pointer"
                          key={_id}
                          onClick={() => handleSelection(_id)}
                        >
                          <div className="text-center text-white font-semibold">
                            <p> {username} </p>
                          </div>
                        </div>
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
          disabled={searchText.length === 0}
          className="bg-green-800 text-white md:px-5 px-3 py-2 rounded-md cursor-pointer focus:bg-green-700 disabled:opacity-50"
        />
      </form>
      <div className="text-white md:mt-6 mt-3 -z-10">
        <div className="px-9 flex flex-col gap-2">
          <InputText
            label="Id"
            value={userInfo._id}
            setValue={handleTextInputChange}
            disabled
          />
          <InputText
            label="Firstname"
            value={userInfo.firstname}
            setValue={handleTextInputChange}
          />
          <InputText
            label="Lastname"
            value={userInfo.lastname}
            setValue={handleTextInputChange}
          />
          <InputText
            label="Username"
            value={userInfo.username}
            setValue={handleTextInputChange}
          />
          <div className="info_row flex gap-4">
            <div className="basis-1/4 font-light"> Password </div>
            <div className="basis-3/4 flex justify-end">
              <ActionButton
                label="Restaurar"
                action={() => {
                  console.log("Restaurar contraseña");
                }}
                bg="bg-blue-500"
              />
            </div>
          </div>
          <InputText label="Email" value={userInfo.email} disabled />
          {/* <InputText label="Biography" value={''} /> */}
          <div className="info_row flex gap-4">
            <div className="basis-1/4 font-light"> isAdmin </div>
            <div className="basis-3/4 flex gap-4">
              <input
                type="checkbox"
                name="isAdmin"
                checked={userInfo.isAdmin}
                onChange={handleCheckInputChange}
              />
            </div>
          </div>
          <div className="info_row flex gap-4">
            <div className="basis-1/4 font-light"> isPremium </div>
            <div className="basis-3/4 flex gap-4">
              <input
                type="checkbox"
                name="isPremium"
                checked={userInfo.isPremium}
                onChange={handleCheckInputChange}
              />
            </div>
          </div>
          <div className="info_row flex gap-4">
            <div className="basis-1/4 font-light"> isPrivate </div>
            <div className="basis-3/4 flex gap-4">
              <input
                type="checkbox"
                name="isPrivate"
                checked={userInfo.isPrivate}
                onChange={handleCheckInputChange}
              />
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
              disabled={!userInfo._id}
              onClick={handleUserSelectedUpdate}
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
