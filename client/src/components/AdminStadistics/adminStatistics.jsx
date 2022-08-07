import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import './adminStatistics.css'
import { useSelector, useDispatch } from "react-redux";
import { getUsersInfo } from "../../redux/actions/adminActions";


const AdminStatistics = () => {

  const dispatch = useDispatch();
  const { _id } = useSelector(store => store.auth.loggedUser);
    
  useEffect(() => {
    dispatch(getUsersInfo(_id));

  });
  const info = useSelector(store => store.admin.info);


  return (
    <div className="statisticscontainer">

      <h1>Registered users: {info?.registeredUsers && info?.registeredUsers}</h1>
      <h1>Users connected: {info?.usersConnected && info?.usersConnected}</h1>
      <h1>Active posts: {info?.activePosts && info?.activePosts}</h1>
      <h1>Premium users: {info?.premiumUsers && info?.premiumUsers}</h1>
      <h1>Admin users: {info?.adminUsers && info?.adminUsers}</h1>
      <h1>Reports: {info?.reports && info?.reports}</h1>
      <h1>Desactivated users: {info?.desactivatedUsers && info?.desactivatedUsers}</h1>
      <h1>Most popular user: @{info.popularUser?.username && info.popularUser?.username}</h1>
      <h1>Fullname: {info.popularUser?.firstname} {info.popularUser?.lastname}</h1>
      <h1>Email: {info.popularUser?.email}</h1>
      <h1>Following: {info.popularUser.following?.length}</h1>
      <h1>Followers: {info.popularUser.followers?.length}</h1>
      <h1>
        Features: {info.popularUser?.isAdmin ? 'Administrator, ' : null}
        {info.popularUser?.isPremium ? 'Premium, ': null}
        {info.popularUser?.isPrivate ? 'Private profile' : null}
      </h1>
      <h1>Biography: {info.popularUser?.biography ? info.popularUser?.biography : null}</h1>
      <h1>Review: {info.popularUser?.review ? `${info.popularUser.review?.description}, ${info.popularUser.review?.stars} stars` : null}</h1>
    </div>
  );
};

export default AdminStatistics;
