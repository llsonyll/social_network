import { Link } from "react-router-dom";

const SearchUsersBox = (props) => {
  return (
    <Link to={`/home/profile/${props.id}`}>
    <div className=" top-auto left-0 right-0 bg-[#363636] px-2 py-4 rounded-sm shadow-lg outline-2 m-1 rounded-lg hover:bg-neutral-800 active:bg-neutral-900">
      <div className="text-center text-white font-semibold">
       <p> {props.username} </p>
      </div>
    </div>
    </Link>
  );
};

export default SearchUsersBox;