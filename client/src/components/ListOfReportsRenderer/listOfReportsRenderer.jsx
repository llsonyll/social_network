import React from 'react'
import Avatar from '../Avatar'
import './listOfReportsRenderer.css'
import { useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { getReportsAction } from '../../redux/actions/reportActions'
import { useEffect, useState } from 'react'
import { deleteReported, closeReport } from '../../redux/actions/reportActions'

//lo llamo desde adminReports
//Sirve para renderizar la lista de reportes y eliminar la basura de una vez.

/* 
1. Así se ve la ruta y se le cambia al final comment por post o user dependiendo de lo que uno quiera 
// http://localhost:3001/report/62e80a1240e56ae280107b26?type=comment
2. Falta unirla con redux en el reducer reportActions.js porque no estába funcionando. Pero la ruta funciona bien.  
3. La idea de este componente es que reciba 'comment', 'post', 'user' y renderize los reportes dependiendo de eso. O se pueden traer todos de una vez y concatenarlos todos en un solo renderizado, el problema es que la ruta devuelve cositas distintas, entonces me parece que es mejor solo traer y mostrar comment, o post o users, no todos al mismo tiempo porque los mapeos se complicarian. 
4. 


*/


const ListOfReportsRenderer = ({type}) => {


  const {reports} = useSelector((state) => state.report)
  const userId = useSelector((state) => state.auth.loggedUser._id);
  const dispatch = useDispatch()
  const [tipo, setTipo] = useState("")


  useEffect(() => {
    console.log(type)
   dispatch(getReportsAction(userId, type))
 }, [type])

    const handlePunish = (userId, reportId, type) => {
      // dispatch(deleteReported(userId, reportId, type))
      console.log(userId, reportId, type)
    }
    const handleCloseCase = (userId, reportId, type) => {
      // dispatch(closeReport(userId, reportId, type))
      console.log(userId, reportId, type)
    }

    let reportCounter = 1

     var reportsTest = reports?.map((r) => {
            if (r._id) {
                var tipoprueba
                 if(r.commentReportedId) tipoprueba = 'commentReportedId'
                 else if(r.postReportedId) tipoprueba = 'postReportedId'
                 else if(r.userReportedId) tipoprueba = 'userReportedId'
                const {_id, reason} = r 
                let content   
                let firstname            //del reportado
                let lastname              //del reportado
                let usernameOfReporter     //del que reportó
                let usernameOfReported    //del reportado
                let idOfReported         ///del reportado
                let idOfReporter          //del que reportó
                let thingReportedId       //de la cosa que se reportó (solo puede ser comment | post)
                if(tipoprueba === "userReportedId") {
                   firstname = r[tipoprueba].firstname
                   lastname= r[tipoprueba].lastname
                   usernameOfReported= r[tipoprueba].username
                   usernameOfReporter= r.userId.username
                   idOfReported = r[tipoprueba]._id
                   idOfReporter = r.userId._id
                  content = null
                } else {
                  firstname = r[tipoprueba].userId.firstname
                  lastname= r[tipoprueba].userId.lastname
                  usernameOfReported= r[tipoprueba].userId.username
                  usernameOfReporter = r.userId.username
                  idOfReported = r[tipoprueba].userId._id
                  idOfReporter = r.userId._id
                  thingReportedId = r[tipoprueba]._id
                  content = r[tipoprueba].content
                }
                if(tipoprueba === "commentReportedId") thingReportedId=r[tipoprueba].postId

                return(
                  // <Link to={`/home/post/${thingReportedId}`}>
                  <div>
                    <li className='flex items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl rounded-lg '>
                                    <div className='w-10'>{reportCounter++}</div>
                                    <Link to={`/home/profile/${idOfReported}`}>
                                    <div className='w-40'>{firstname + ' ' + lastname} - {usernameOfReported}</div>
                                    </Link>
                                    <Link to={`/home/profile/${idOfReporter}`}>
                                    <div className='w-45'>reported by {usernameOfReporter}</div>
                                    </Link>
                                    <div className='w-72 h-20 self-center flex-wrap'>{reason}</div>
                                    <div className='w-40'>{content}</div>
                                    

                    <div className='flex items-center justify-center mb-8'>
                        <button className=' bg-[#9B423D] ml-0 mr-2 mt-3 mb-3 p-1 pl-3 pr-3 rounded-md'
                                onClick={() => {
                                handlePunish(userId, _id, tipoprueba)
                                }}
                                type="button"
                            >
                                Punish
                            </button>
                            <button className='bg-[#4E864C] rounded-md mr-3 p-1 pl-3 pr-3 ml-6'
                                onClick={() => {
                                  handleCloseCase(userId, _id, tipoprueba)
                                }}
                                type="button"
                            >Close Case</button>
                    </div> 
                    </li>
                    {/* </Link> */}
                    </div>
                )
            } 
        })
    

    
  return (
    <>
        <div className='flex-row' key={Math.random()}>
                <ol>
                {reportsTest}
                </ol>
        </div>
     </>
  )
}

export default ListOfReportsRenderer