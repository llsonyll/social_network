import React from 'react'
import Avatar from '../Avatar'
import './listOfUsersRendererWithButtons.css'
import { useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { AiFillCloseSquare } from "react-icons/ai";
//iconos
import {
    acceptFollowRequest,
    cancelFollowRequest,
  } from "../../redux/actions/userActions";
  

//lo llamo desde profile.jsx
//Sirve para renderizar la lista de peticiones de seguimiento pendientes y para aceptarlas o rechazarlas de una vez.

const ListOfUsersRenderer = ({arrayOfPeopleToRender = [], userId = '', closeRenderFunction, titleToRender}) => {
    const dispatch = useDispatch()

    //console.log(arrayOfPeopleToRender)
    let arr = []


        arr = useSelector((state) => state.user.userProfileData.followRequest)
        console.log(arr)
    


    let people = null;
    people = arr?.map((person) => {
        if (person.username) {
            return(
                <div className='borde' key={person._id}>
                <div className='persontile flex-col '>
                <Link onClick={closeRenderFunction} to={`/home/profile/${person._id}`}>
                    <div className='friend-contact__avatar flex-col flex items-center'>
                        <Avatar size= 'l'imgUrl={person.profilePicture}/>
                    </div>
                            <div  className='personname'>
                                <span>@{person.username}</span>
                            </div>
                </Link> 
                </div>
                    <div className='flex items-center justify-center mb-8'>
                        <button className=' bg-[#9B423D] ml-0 mr-2 mt-3 mb-3 p-1 pl-3 pr-3 rounded-md'
                                onClick={() => {
                                dispatch(cancelFollowRequest(userId, person._id));
                                }}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button className='bg-[#4E864C] rounded-md mr-3 p-1 pl-3 pr-3 ml-6'
                                onClick={() => {
                                dispatch(acceptFollowRequest(userId, person._id));
                                }}
                                type="button"
                            >Accept</button>
                    </div>
                </div>
            )
        } 
    })

  return (
      <div className='containersiii self-center z-50 mx-0 fixed top-0  center rounded-2xl shadow-xl shadow-black bg-[#202225] px-4 py-4 text-white items-center w-72 h-96'>
              <button className="text-gray-400 absolute top-0 mb-0 right-0 bg-transparent rounded-lg text-sm p-1.5 ml-auto hover:bg-gray-800 " onClick={closeRenderFunction}>
              <span className="text-3xl">
              <AiFillCloseSquare />
              </span>
              </button>
              <div className='textToRender absolute center mb-80 pb-3 font-bold uppercase'> {'Follow Requests'} </div>
                  <div className='peoplecontainersiii overflow-auto h-72 ml-3 mt-10 w-11/12'>
                      <ol>
                       {people}
                      </ol>
              </div>
      </div>
  )
}

export default ListOfUsersRenderer