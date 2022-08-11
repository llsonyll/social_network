import { RiUserSearchLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import AdminSearchUser from "../AdminSearchUser";
import AdminReports from "../AdminReports";
import AdminStadistics from "../AdminStadistics";

import { useState, useEffect } from "react";
import AdminPayments from "../AdminPayments";

const AdminBoard = () => {
  const [tab, setTab] = useState("search"); // search, reports, stadistics

  return (
    <div className="flex items-center justify-center">
      <div className="bg-[#262626] shadow-xl rounded-sm relative md:p-12 p-6">
        <div className="text-white font-bold text-4xl text-center md:mb-8 mb-4 ">
          Admin Dashboard
        </div>
        <div className="flex md:mb-4 mb-2 flex-wrap">
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ml-4 ${
              tab === "search" ? "opacity-100 underline" : ""
            }`}
            onClick={() => setTab("search")}
          >
            <RiUserSearchLine />
            Search
          </button>
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ml-4 ${
              tab === "reports" ? "opacity-100 underline" : ""
            }`}
            onClick={() => setTab("reports")}
          >
            <TbReportSearch />
            Reports
          </button>
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ml-4 ${
              tab === "payments" ? "opacity-100 underline" : ""
            }`}
            onClick={() => setTab("payments")}
          >
            <TbReportSearch />
            Payments
          </button>
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ml-6 ${
              tab === "stadistics" ? "opacity-100 underline" : ""
            }`}
            onClick={() => setTab("stadistics")}
          >
            <HiOutlineChartSquareBar />
            Statistics
          </button>
        </div>
        <div className="">
          {tab === "search" ? (
            <AdminSearchUser />
          ) : tab === "reports" ? (
            <AdminReports />
          ) : tab === "payments" ? (
            <AdminPayments /> 
          ) :(
            <AdminStadistics />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;
