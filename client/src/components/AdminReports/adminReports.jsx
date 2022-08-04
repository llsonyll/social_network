import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import {useSelector, useDispatch} from 'react-redux'
import { getReportsAction } from "../../redux/actions/reportActions";
import Multiselect from 'multiselect-react-dropdown';

const AdminSearchUser = () => {


  const reports = useSelector((state) => state.report.reports)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getReportsAction())
  }, [])
  console.log(reports)
  return (
    <>
      <h1> Admin Reports </h1>
    </>
  );
};

export default AdminSearchUser;
