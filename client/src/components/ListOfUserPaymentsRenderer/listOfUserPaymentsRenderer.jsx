import React from 'react'
import Avatar from '../Avatar'
import './ListOfUserPaymentsRenderer.css'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import { AiFillCloseSquare } from "react-icons/ai";

//lo llamo desde profilePosts.jsx
//Este componente renderiza las personas que dieron like/dislike/siguen/son seguidas...
//Se puede usar para renderizar usuarios dependiendo de lo que uno necesite mostrar.
//El arr que llega contiene las personas a renderizar. Si no hay arr debe haber id de post, si hay id de post, va y trae la gente que dio likes o dislikes al post.

const ListOfUserPaymentsRenderer = ({arrayOfPaymentsToRender=[], closeRenderFunction}) => {
    const dispatch = useDispatch()


    let payments = null;
    if (arrayOfPaymentsToRender.length > 0) {
        payments = arrayOfPaymentsToRender?.map((p) => {
    
                return(
                    <div className='flex flex-col w-94 mb-10'>
                                <div className=' flex flex-col'>
                                <div className='font-extrabold'>User Id:<span className='ml-20 font-thin'>{p._id}</span></div>
                                <div className='font-extrabold'>Amount:<span className='ml-20 font-thin'>{p.amount}</span></div>    
                                <div className='font-extrabold'>Plan:<span className='ml-28 font-thin'>{p.plan}</span></div>
                                <div className='font-extrabold whitespace-nowrap'>Payment Id:<span className='ml-12 font-thin'>{p.paymentId}</span></div>
                                <div className='font-extrabold'>Payment date:<span className='ml-8 font-thin'>{p.paymentDate}</span></div>
                    </div>
                        </div>
                )
        })
    }


  return (
      <div className='containersiii self-center z-50 ml-12 fixed top-0 center rounded-2xl shadow-xl shadow-black bg-[#202225] px-4 py-4 text-white items-center w-2/4 max-w-lg h-auto'>
              <button className="text-gray-400 absolute top-0 mb-0 right-0 bg-transparent rounded-lg text-sm p-1.5 ml-auto hover:bg-gray-800 " onClick={closeRenderFunction}>
              <span className="text-3xl">
              <AiFillCloseSquare />
              </span>
              </button>
              <div className='textToRender absolute center mt-3 mb-80 pb-3 font-extrabold uppercase'> Payment Details </div>
                  <div className='peoplecontainersiii overflow-auto h-72 ml-3 mt-10 w-11/12'>
                      <ol>
                      {payments}
                      </ol>
              </div>
      </div>
  )
}

export default ListOfUserPaymentsRenderer