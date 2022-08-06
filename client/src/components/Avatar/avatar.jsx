import { TbCrown } from "react-icons/tb";
import { useSelector } from "react-redux";

const Avatar = ({
  imgUrl = "https://www.fundacion-affinity.org/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
  size = "s", // 's', 'm', 'l', 'xl', 'xl2' , 'xxl'
}) => {
  const isPremium = useSelector(
    (state) => state.user.userProfileData.isPremium
  );

  return size === "s" ? (
    <div className="rounded-full  p-1 w-8 h-8 relative">
      <img
        className="object-cover h-full rounded-full w-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "m" ? (
    <div className="rounded-full  p-1 w-10 h-10 relative">
      <img
        className="object-cover h-full rounded-full w-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "l" ? (
    <div className="rounded-full  p-1 w-12 h-12 relative">
      <img
        className="object-cover h-full rounded-full w-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "xl" ? (
    <div className="rounded-full  p-1 w-16 h-16 relative">
      <img
        className="object-cover h-full rounded-full w-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : size === "xl2" ? (
    <div className="rounded-full bg-white p-1 w-20 h-20 relative">
      <img
        className="object-cover h-full rounded-full w-full"
        src={imgUrl}
        alt="avatarIMG"
      />
    </div>
  ) : (
    <div className="rounded-full p-1 w-40 h-40 relative">
      <img
        className="object-cover rounded-full w-40 h-40"
        src={imgUrl}
        alt="avatarIMG"
      />
      {isPremium ? (
        <div className="absolute z-50 text-white w-10 h-10 -bottom-3 right-0 text-xl bg-black rounded-full flex items-center justify-center">
          <TbCrown />
        </div>
      ) : null}
    </div>
  );
};

export default Avatar;
