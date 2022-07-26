import InputText from "../InputText";
import ActionButton from "../ActionButton";
import LoadingSpinner from "../LoadingSpinner";
import SearchUsersBox from "../SearchUsersBox";

import { AiFillStar, AiFillInfoCircle } from "react-icons/ai";

import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import Swal from "sweetalert2";
import ListOfUserPaymentsRenderer from "../ListOfUserPaymentsRenderer/listOfUserPaymentsRenderer";

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
    review: {},
    paymentsId: []
  });

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearchResults, setLoadingSearchResults] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingSearchResults(true);

    try {
      const { data } = await apiConnection.get(`user/browser/${searchText}`);
      // console.log(data);
      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
    }

    setLoadingSearchResults(false);
  };

  const handleSelection = async (id) => {
    try {
      const { data } = await apiConnection.get(`user/${id}`);
      // console.log(data);
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

      // console.log(data);

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "User has been updated successfully",
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Ups... Something went wrong",
        text: "Try it again later",
        background: "#4c4d4c",
        color: "white",
      });
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

  const handlePasswordReset = async () => {
    if (!userInfo._id) return;

    try {
      const { data } = await apiConnection.post(`user/restorePassword`, {
        email: userInfo.email,
      });

      // console.log(data);

      Swal.fire({
        icon: "success",
        title: "Restored",
        text: "User's password has been restored successfully",
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Ups... Something went wrong",
        text: "Try it again later",
        background: "#4c4d4c",
        color: "white",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const { data } = await apiConnection.put(`user/deleted/${userInfo._id}`);
      // console.log(data);
      // console.log("Your account has been deleted");
      setUserInfo((prev) => ({
        ...prev,
        isDeleted: true,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (searchText.length === 0) {
      setSearchResults([]);
      setLoadingSearchResults(true);
    }
  }, [searchText]);


  let handleShowPaymentDetails = () => {
    setShowPaymentDetails(!showPaymentDetails)
  }

  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center gap-8">
        <div className="text-green-700 font-bold">
          Search account by id/username/email:
        </div>
        <div className="w-full relative">
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
            value={searchText}
            maxLength="40"
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
          className="bg-green-800 text-white md:px-5 px-3 py-2 rounded-md focus:bg-green-700 disabled:opacity-50"
        />
      </form>
      <div className="text-white md:mt-6 mt-3 -z-10">
        <div className="px-9 flex flex-col gap-2">
          {userInfo.isDeleted && (
            <div className="bg-red-600 rounded-md shadow-md px-2 py-1 flex items-center gap-3 justify-center opacity-75 mb-2">
              <AiFillInfoCircle />
              <div className="font-light text-sm">
                Este usuario esta suspendido
              </div>
            </div>
          )}

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
            maxLength="20"
          />
          <InputText
            label="Lastname"
            value={userInfo.lastname}
            setValue={handleTextInputChange}
            maxLength="20"
          />
          <InputText
            label="Username"
            value={userInfo.username}
            setValue={handleTextInputChange}
            maxLength="15"
          />
          <div className="info_row flex gap-4">
            <div className="basis-1/4 font-light"> Password </div>
            <div className="basis-3/4 flex justify-end">
              <ActionButton
                label="Restaurar"
                action={handlePasswordReset}
                bg="bg-blue-500"
                disabled={!userInfo._id}
              />
            </div>
          </div>
          <InputText label="Email" value={userInfo.email} disabled />
          <div className="info_row flex gap-4">
            <div className="basis-1/4 font-light"> Biography </div>
            <div className="basis-3/4 flex justify-end">
              <textarea
                id="message"
                rows="4"
                maxLength="200"
                className="block outline-none bg-[#363636] p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none"
                name="biography"
                value={userInfo.biography}
                onChange={handleTextInputChange}
                
              ></textarea>
            </div>
          </div>
          {/* BOTON PARA VER EL DETALLE DE LOS PAGOS*/}
          <button onClick={handleShowPaymentDetails} className="bg-green-700  py-1 font-semibold rounded-sm">See payments</button>
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
              {userInfo.review ? (
                <>
                  <div className="flex items-center">
                    <div className="font-semibold">
                      {userInfo.review.stars ?? ""}
                    </div>
                    <AiFillStar />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={userInfo.review.description ?? ""}
                    className="focus:ring-indigo-500 focus:border-indigo-500 py-1 pl-2 pr-7 border-transparent bg-[#363636] text-white sm:text-sm rounded-md w-full"
                  />
                </>
              ) : (
                "Sin review"
              )}
            </div>
          </div>

          <div className="flex flex-col md:mt-4 mt-2 gap-2">
            <button
              className="bg-green-700  py-1 font-semibold rounded-sm disabled:opacity-75"
              disabled={!userInfo._id}
              onClick={handleUserSelectedUpdate}
            >
              Guardar
            </button>
            <button
              className="bg-red-500  py-1 font-semibold rounded-sm disabled:opacity-75"
              disabled={userInfo.isDeleted || !userInfo._id}
              onClick={handleDeleteUser}
            >
              Suspender
            </button>
          </div>
        </div>
      </div>
      {showPaymentDetails === true && (
        <ListOfUserPaymentsRenderer
          arrayOfPaymentsToRender={userInfo?.paymentsId}
          closeRenderFunction={handleShowPaymentDetails}
        />
      )}
    </>
  );
};

export default AdminSearchUser;
