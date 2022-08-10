import React from 'react'
import Avatar from '../Avatar'
import './listOfReportsRenderer.css'
import { useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { getReportsAction } from '../../redux/actions/reportActions'
import { useEffect, useState } from 'react'

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
   if(type === "post") setTipo("postReportedId") 
   if(type === "comment") setTipo("commentReportedId") 
   if(type === "user") setTipo("userReportedId") 
 }, [type])

console.log(reports)
    

    let reportCounter = 1

    if(tipo === "") {

    }
     var reportsTest = reports?.map((r) => {
            if (r._id) {
                var tipoprueba
                // var type
                 if(r.commentReportedId) tipoprueba = 'commentReportedId'
                 else if(r.postReportedId) tipoprueba = 'postReportedId'
                 else if(r.userReportedId) tipoprueba = 'userReportedId'
                //  console.log(type, r)
                //  if(r.type === null) console.log("lol", r)
                // console.log(tipoprueba)
                // console.log(r[tipoprueba].userId)
                const {_id, reason} = r 
                let content
                let firstname
                let lastname
                let username
                if(tipoprueba === "userReportedId") {
                   firstname = r[tipoprueba].firstname
                   lastname= r[tipoprueba].lastname
                   username= r[tipoprueba].username
                  content = null
                } else {
                  firstname = r[tipoprueba].userId.firstname
                  lastname= r[tipoprueba].userId.lastname
                  username= r[tipoprueba].userId.username
                  content = r[tipoprueba].content


                }

                return(
                    <li className='  '>
                                    <div className='w-10 h-full justify-center bg-neutral-900'>
                                      {reportCounter++}
                                    </div>
                                    <div className='username__report  h-full w-full justify-center'>{username}</div>
                                    <div className='report__reason w-full h-full flex-wrap justify-center bg-neutral-900'>{reason}</div>
                                    <div className='report_content w-full h-auto justify-center bg-neutral-800'>{content}</div>
                    <div className='flex items-center justify-center mb-8'>
                        <button className=' bg-[#9B423D] ml-0 mr-2 mt-3 mb-3 p-1 pl-3 pr-3 rounded-md'
                                onClick={() => {
                                //Debe eliminar el comentario, la publicación o eliminar a la persona
                                }}
                                type="button"
                            >
                                Delete
                            </button>
                            <button className='bg-[#4E864C] rounded-md mr-3 p-1 pl-3 pr-3 ml-6'
                                onClick={() => {
                                //Debe cerrar el reporte, pero todavia no entiendo si hay o no ruta de eliminar reportes. 
                                }}
                                type="button"
                            >Close Case</button>
                    </div> 
                    </li>
                    
                )
            } 
        })
    

    
  return (
    <>
        <div className='flex-row h-96'  key={Math.random()}>
                <ol className='h-full'>
                {reportsTest}
                </ol>
        </div>
     </>
  )
}

export default ListOfReportsRenderer