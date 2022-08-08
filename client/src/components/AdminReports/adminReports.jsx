import { useState, useEffect } from "react";
import { apiConnection } from "../../utils/axios";
import {useSelector, useDispatch} from 'react-redux'
import { getReportsAction } from "../../redux/actions/reportActions";
import Multiselect from 'multiselect-react-dropdown';
import ListOfReportsRenderer from "../ListOfReportsRenderer/listOfReportsRenderer";

const AdminReports = () => {
  /* useEffect(() => {
    dispatch(getReportsAction())
  }, [])
  console.log(reports) */


/* 
    1. Aqui van los estados y botones para elegir mostrar comments, posts o users dependiendo de lo que el admin quiera. 
    2. El fullname es de la persona que reportaron, no la que reportó, al darle click al motivo del reporte debería llevar al perfil de la persona que reportó.
    3. Darle click a content, cuando sea un comentario, no debería hacer nada, pero cuando sea un post o un reporte de perfil, debería llevar a eso, post o perfil del acusado. 
*/
    
  return (
    <>
                <div className='flex items-center justify-center mb-8'>
                        <button className=' bg-[#b5b5b5] ml-0 mr-2 mt-3 mb-3 p-1 pl-3 pr-3 rounded-md'
                                onClick={() => {
                                //Debe renderizar comentarios, por defecto se muestra uno de los 3, sea comentarios, posts o users
                                }}
                                type="button"
                            >
                                Comments
                            </button>
                            <button className='bg-[#b5b5b5] rounded-md mr-3 p-1 pl-3 pr-3 ml-6'
                                onClick={() => {
                                }}
                                type="button"
                            >Posts</button>
                            <button className='bg-[#b5b5b5] rounded-md mr-3 p-1 pl-3 pr-3 ml-6'
                                onClick={() => {
                                }}
                                type="button"
                            >Users</button>
                    </div> 

      <li className=''>
                    <div className=''>#</div>
                    <div className=''>Fullname</div>
                    <div className=''>Reason</div>
                    <div className=''>Content</div>
      </li>
    <div className="flex items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl rounded-lg '">
         <div>
            <ListOfReportsRenderer typeOfReport='comment'/>
        </div>
    </div>
    </>
  );
};

export default AdminReports;
