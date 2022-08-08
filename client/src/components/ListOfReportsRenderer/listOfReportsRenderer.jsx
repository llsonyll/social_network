import React from 'react'
import Avatar from '../Avatar'
import './listOfReportsRenderer.css'
import { useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { getReportsAction } from '../../redux/actions/reportActions'

//lo llamo desde adminReports
//Sirve para renderizar la lista de reportes y eliminar la basura de una vez.

/* 
1. Así se ve la ruta y se le cambia al final comment por post o user dependiendo de lo que uno quiera 
// http://localhost:3001/report/62e80a1240e56ae280107b26?type=comment
2. Falta unirla con redux en el reducer reportActions.js porque no estába funcionando. Pero la ruta funciona bien.  
3. La idea de este componente es que reciba 'comment', 'post', 'user' y renderize los reportes dependiendo de eso. O se pueden traer todos de una vez y concatenarlos todos en un solo renderizado, el problema es que la ruta devuelve cositas distintas, entonces me parece que es mejor solo traer y mostrar comment, o post o users, no todos al mismo tiempo porque los mapeos se complicarian. 
4. 


*/


const ListOfReportsRenderer = (typeOfReport = '') => {

    let arrayPrueba =  [{
        _id: "62f0218c9247c013d23247a2",
        userId: "62e80a1240e56ae280107b26",
        commentReportedId: {
          _id: "62ef100bfe603e4be6ae62f2",
          userId: {
            _id: "62dedd26ff1f6d86c08ca214",
            firstname: "carlos",
            lastname: "perejil"
          },
          content: "bueno ahora te voy a pegar un tiro"
        },
        reason: "CARLITOS VIOLENCIA AAAAAA",
        createdAt: "2022-08-07T20:33:16.328Z"
    } ,
    {
        _id: "62f0218c9247c013d23247a2",
        userId: "62e80a1240e56ae280107b26",
        commentReportedId: {
          _id: "62ef100bfe603e4be6ae62f2",
          userId: {
            _id: "62dedd26ff1f6d86c08ca214",
            firstname: "carlos",
            lastname: "perejil"
          },
          content: "bueno ahora te voy a pegar un tiro"
        },
        reason: "CARLITOS VIOLENCIA AAAAAAAA",
        createdAt: "2022-08-07T20:33:16.328Z"
    } ]


    
    /*
    Aqui me estaba trayendo las cosas de redux pero creo que va a ser mejor que el dispatch lo hagan los 3 botones en el componente adminReports. 

    const dispatch = useDispatch()
    
    let admin = useSelector((state) => state.auth.loggedUser)
    
     let arr = null

    if (typeOfReport === 'comment' && arr === null) {
        //lA RUTA NECESITA UN ID DE UN ADMIN, SI NO SE LE PASA ASI NO FUNCIONA
        dispatch(getReportsAction(typeOfReport, admin._id))
         arr = useSelector((state) => state.report.reports)
         console.log(arr)
    } */
    

    let reportCounter = 1

    let reports = null;
    if (/* typeOfReport === 'comment' ESTA EVALUACION NO SIRVE Y NO SE PORQUE AAAAAAAAAAAAAAAAAAA*/ true) {
        reports = arrayPrueba?.map((r) => {
            if (r._id) {

                const {_id, commentReportedId, reason} = r 
                const {firstname, lastname} = commentReportedId.userId
                const {content} = commentReportedId

                return(
                    <li className='flex items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl rounded-lg '>
                                    <div className='w-10'>{reportCounter++}</div>
                                    
                                    <div className='w-40'>{firstname + ' ' + lastname}</div>
                                    <div className='w-72 h-20 self-center flex-wrap'>{reason}</div>
                                    <div className='w-40'>{content}</div>
                                    
                    
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
    }

    
  return (
    <>
        <div className='flex-row' key={Math.random()}>
                <ol>
                {reports}
                </ol>
        </div>
     </>
  )
}

export default ListOfReportsRenderer