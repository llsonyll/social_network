import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import './adminStatistics.css'
import { useSelector, useDispatch } from "react-redux";
import { getUsersInfo } from "../../redux/actions/adminActions";
import Avatar from "../../components/Avatar";

const AdminStatistics = () => {

  const dispatch = useDispatch();
  const { _id } = useSelector(store => store.auth.loggedUser);
    
  useEffect(() => {
    dispatch(getUsersInfo(_id));

  }, [ ]);
  const info = useSelector(store => store.admin.info);

  return (
    <div className="statisticscontainer">

      <div>
        <p className="inline">Registered users:</p> <span className="text-green-600">{info?.registeredUsers}</span> 
      </div>
      <div>
        <p className="inline">Users connected:</p> <span className="text-green-600">{info?.usersConnected}</span> 
      </div>
      <div>
        <p className="inline">Active posts:</p> <span className="text-green-600">{info?.activePosts}</span> 
      </div>
      <div>
        <p className="inline">Premium users:</p> <span className="text-green-600">{info?.premiumUsers}</span> 
      </div>
      <div>
        <p className="inline">Admin users:</p> <span className="text-green-600">{info?.adminUsers}</span> 
      </div>
      <div>
        <p className="inline">Reports:</p> <span className="text-red-600">{info?.reports}</span> 
      </div>
      <div>
        <p className="inline">Desactivated users:</p> <span className="text-red-600">{info?.desactivatedUsers}</span> 
      </div>
      <h1>Most popular user:</h1>
      <div>
        <div className="flex bg-neutral-700 rounded-md p-1"> 
        <Avatar size="m" imgUrl={info.popularUser?.profilePicture} className='self-center'/>
        <section className="flex flex-col">
          <p>@{info.popularUser?.username}</p>
          <span className="text-sm text-gray-500"> {info.popularUser?.firstname} {info.popularUser?.lastname}</span>
          <span className="text-sm text-gray-500">{info.popularUser?.email} </span>
        </section>
        
        </div>
      </div>
      <div>
        <p className="inline">Following:</p> <span className="text-green-600">{info.popularUser?.following?.length}</span> 
      </div>
      <div>
        <p className="inline">Followers:</p> <span className="text-green-600">{info.popularUser?.followers?.length}</span> 
      </div>
      <div>
        <p className="inline"> Features:</p> <span className="text-green-600">{info.popularUser?.isAdmin ? 'Administrator, ' : null}{info.popularUser?.isPremium ? 'Premium, ': null} {info.popularUser?.isPrivate ? 'Private profile' : null}</span> 
      </div>
      <div>
        <p className="inline">Biography:</p> <span className="text-green-600">{info.popularUser?.biography ? info.popularUser?.biography : null}</span> 
      </div>
      <div>
        <p className="inline">Review: </p> <span className="text-green-600">{info.popularUser?.review ? `${info.popularUser.review?.description}, ${info.popularUser.review?.stars} stars` : null}</span> 
      </div>
    </div>
  );
};

export default AdminStatistics;
