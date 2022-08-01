import { AiFillCloseSquare } from "react-icons/ai";
import { RiUserSearchLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import AdminSearchUser from "../AdminSearchUser";
import AdminReports from "../AdminReports";
import AdminStadistics from "../AdminStadistics";

import { useState, useEffect } from "react";

const AdminBoard = ({ showAdmin, setShowAdmin }) => {
  const [tab, setTab] = useState("search"); // search, reports, stadistics

  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-[#262626] shadow-xl rounded-sm relative md:p-12 p-6">
        <button
          type="button"
          className="absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-stone-800"
          data-modal-toggle="popup-modal"
          onClick={() => setShowAdmin(!showAdmin)}
        >
          <span className="text-2xl">
            <AiFillCloseSquare />
          </span>
        </button>
        <div className="text-white font-bold text-4xl text-center md:mb-8 mb-4 ">
          Admin Dashboard
        </div>
        <div className="flex md:mb-4 mb-2">
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ${
              tab === "search" ? "opacity-100 underline" : ""
            }`}
            onClick={() => setTab("search")}
          >
            <RiUserSearchLine />
            Search
          </button>
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ${
              tab === "reports" ? "opacity-100 underline" : ""
            }`}
            onClick={() => setTab("reports")}
          >
            <TbReportSearch />
            Reports
          </button>
          <button
            className={`flex-1 flex items-center justify-center text-white opacity-50 gap-2 ${
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
          ) : (
            <AdminStadistics />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;
