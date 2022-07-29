import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import SearchUsersBox from "../SearchUsersBox";
import LoadingSpinner from "../LoadingSpinner";

const SearchResults = ({ input, setInput }) => {
  const { searches, error, loading } = useSelector(
    (state) => state.browserReducer
  );

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (input.length > 1) {
        const recentLS = localStorage.getItem("recentSearch");
        setRecent(JSON.parse(recentLS));
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  // input con minimo un caracter con busquedas recientes
  // input con minimo un caracter sin busquedas recientes
  // input con texto y resultados
  // input con texto y sin resultados

  return (
    <div className="absolute w-full bg-neutral-600 rounded-b-lg shadow-md pt-4 -translate-y-4 -z-10">
      {input.trim().length > 0 && recent.length > 0
        ? recent.map((r) => {
            return (
              <button
                key={r._id}
                className=""
                onClick={() => console.log("Select Recent")}
              >
                {r.username}
                <button
                  className="z-10"
                  onClick={() => console.log("Skip/remove")}
                >
                  X
                </button>
              </button>
            );
          })
        : null}
      {input.trim().length > 0 ? (
        !error ? (
          !loading ? (
            searches.map((user) => {
              return (
                <SearchUsersBox
                  username={user.username}
                  key={user._id}
                  id={user._id}
                />
              );
            })
          ) : (
            <div className="flex justify-center items-center p-6">
              <LoadingSpinner />
            </div>
          )
        ) : (
          <SearchUsersBox username={error} />
        )
      ) : null}
    </div>
  );
};

export default SearchResults;
