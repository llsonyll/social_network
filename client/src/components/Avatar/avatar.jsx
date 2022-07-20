const Avatar = ({ imgUrl }) => {
  return (
    <div className="rounded-full w-12 h-12 p-1 bg-white overflow-hidden">
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  );
};

export default Avatar;
