import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import { useSelector, useDispatch } from "react-redux";
import { getReportsAction } from "../../redux/actions/reportActions";
import Multiselect from "multiselect-react-dropdown";
import ListOfReportsRenderer from "../ListOfReportsRenderer/listOfReportsRenderer";

const AdminReports = () => {
  const [type, setType] = useState("");
  useEffect(() => {
    // dispatch(getReportsAction());
    console.log(type)
  }, [type]);
  // console.log(reports);

  /* 
    1. Aqui van los estados y botones para elegir mostrar comments, posts o users dependiendo de lo que el admin quiera. 
    2. El fullname es de la persona que reportaron, no la que reportó, al darle click al motivo del reporte debería llevar al perfil de la persona que reportó.
    3. Darle click a content, cuando sea un comentario, no debería hacer nada, pero cuando sea un post o un reporte de perfil, debería llevar a eso, post o perfil del acusado. 
*/

const handleType = (value) => {
  setType(value.target.name)
}

  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <button
          className=" bg-[#b5b5b5] ml-0 mr-2 mt-3 mb-3 p-1 pl-3 pr-3 rounded-md"
          onClick={(e) => handleType(e)}
          type="button"
          name="commentReportedId"
        >
          Comments
        </button>
        <button
          className="bg-[#b5b5b5] rounded-md mr-3 p-1 pl-3 pr-3 ml-6"
          onClick={(e) => handleType(e)}
          type="button"
          name="postReportedId"
        >
          Posts
        </button>
        <button
          className="bg-[#b5b5b5] rounded-md mr-3 p-1 pl-3 pr-3 ml-6"
          onClick={(e) => handleType(e)}
          type="button"
          name="userReportedId"
        >
          Users
        </button>
      </div>

      <li className="li-header text-white bg-neutral-600 ">
        <div className="flex justify-center">#</div>
        <div className="flex justify-center">Username</div>
        <div className="flex justify-center ">Reported By</div>
        <div className="flex justify-center">Reason</div>
        <div className="li-header-content flex justify-center">Content</div>
      </li>
      <div className="flex items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl rounded-lg '">
        <div>
          <ListOfReportsRenderer
            // typeOfReport='comment'
            type={type}
          />
        </div>
      </div>
    </>
  );
};

export default AdminReports;
