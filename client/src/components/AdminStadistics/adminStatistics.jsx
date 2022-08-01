import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import './adminStatistics.css'
import { useSelector, useDispatch } from "react-redux";


const AdminStatistics = () => {

    const dispatch = useDispatch();
    



  return (
    <div className="statisticscontainer">

      <h1>Registered users: </h1>
      <h1>Users connected: </h1>
      <h1>Active posts: </h1>
      <h1>Premium users: </h1>
      <h1>Admin users: </h1>
      <h1>Admin users: </h1>
    </div>
  );
};

export default AdminStatistics;
