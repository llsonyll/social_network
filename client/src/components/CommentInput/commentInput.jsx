import Avatar from "../Avatar";

const CommentInput = ({ ref }) => {
  return (
    <div className="flex items-center">
      <Avatar />
      <input
        ref={ref}
        className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 h-full py-1 pl-2 pr-7 border-transparent bg-gray-700 text-white sm:text-sm rounded-md ml-3"
        type="text"
      />
    </div>
  );
};

export default CommentInput;
