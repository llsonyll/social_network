const Avatar = ({
  imgUrl = "https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
}) => {
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
