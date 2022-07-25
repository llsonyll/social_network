const Avatar = ({
  imgUrl = "https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
  size = "s", // 's', 'm', 'l', 'xl', 'xl2' , 'xxl'
}) => {
  return size === "s" ? (
    <div className={`rounded-full  overflow-hidden p-1 w-8 h-8`}>
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "m" ? (
    <div className={`rounded-full  overflow-hidden p-1 w-10 h-10`}>
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "l" ? (
    <div className={`rounded-full  overflow-hidden p-1 w-12 h-12`}>
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "xl" ? (
    <div className={`rounded-full  overflow-hidden p-1 w-16 h-16`}>
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "xl2" ? (
    <div className={`rounded-full bg-white overflow-hidden p-1 w-20 h-20`}>
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) :(
    <div className={`rounded-full  overflow-hidden p-1 w-40 h-40`}>
      <img
        className="object-cover h-full rounded-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  );
};

export default Avatar;
