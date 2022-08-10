import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import SearchUsersBox from "../SearchUsersBox";
import LoadingSpinner from "../LoadingSpinner";

import { MdRemoveCircle } from "react-icons/md";

const SearchResults = ({
  input,
  setInput,
  selectRecent,
  searched,
  setSearched,
}) => {
  const { searches, error, loading } = useSelector(
    (state) => state.browserReducer
  );

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (input.length > 1) {
        const recentLS = localStorage.getItem("recentSearch");
        const parsedLS = JSON.parse(recentLS);

        if (parsedLS) {
          setSearched(false);
          setRecent(parsedLS);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  const handleRemoveRecentSearch = (recentToRemove) => {
    const filtered = recent.filter((r) => r._id !== recentToRemove._id);
    setRecent(filtered);
    localStorage.setItem("recentSearch", JSON.stringify(filtered));
  };

  return (
    <div className="absolute w-full bg-neutral-600 rounded-b-lg shadow-md pt-4 -translate-y-4 -z-10">
      {(input.trim().length > 0 && recent.length > 0 && !searched) || loading
        ? recent.map((recent) => {
            return (
              <div
                key={recent._id}
                className="flex px-2 py-1 hover:bg-[#363636] m-1"
              >
                <button
                  className="flex-1 text-start font-bold text-white"
                  onClick={() => selectRecent(recent.username)}
                >
                  {recent.username}
                </button>
                <button
                  className="z-10 hover:text-red-500"
                  onClick={() => handleRemoveRecentSearch(recent)}
                >
                  <MdRemoveCircle />
                </button>
              </div>
            );
          })
        : null}
      {input.trim().length > 0 || searched ? (
        !error ? (
          !loading ? (
            searches.map((user) => {
              return (
                <div key={user._id} className="" onClick={() => setInput("")}>
                  <SearchUsersBox
                    key={user._id}
                    username={user.username}
                    id={user._id}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center p-6">
              <LoadingSpinner />
            </div>
          )
        ) : (
          <div className=" top-auto left-0 right-0 bg-[#363636] px-2 py-4 shadow-lg outline-2 m-1 rounded-lg hover:bg-neutral-800 active:bg-neutral-900">
            <div className="text-center text-white font-semibold">
              <p> {error} </p>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};

export default SearchResults;
