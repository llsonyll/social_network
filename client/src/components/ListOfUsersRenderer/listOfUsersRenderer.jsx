import React from 'react'
import Avatar from '../Avatar'
import './listOfUsersRenderer.css'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import { AiFillCloseSquare } from "react-icons/ai";
//iconos
import {AiOutlineSearch} from 'react-icons/ai'


//Este componente renderiza las personas que dieron like/dislike/siguen/son seguidas...
//Se puede usar para renderizar usuarios dependiendo de lo que uno necesite mostrar.
//El arr que llega contiene las personas a renderizar. Si no hay arr debe haber id de post, si hay id de post, va y trae la gente que dio likes o dislikes al post.
const ListOfUsersRenderer = ({arrayOfPeopleToRender = [], profileId = '' , closeRenderFunction, titleToRender}) => {
    
    let arr = arrayOfPeopleToRender
    

    //esto divide el arr de likes/dislikes/followers/following
    let people = arr?.map((person) => {
        if (person.username) {
            return(
                <Link to={`/home/profile/${person._id}`}>
                <div className='persontile'>
                    <div  className='personname'>
                        <span>{person.username}</span>
                    </div>
                </div>
                </Link> 
            )
            
        }
    } )



  return (
                <div className='likes-container'>
                        <>
                        <button className='absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800' onClick={closeRenderFunction}>
                        <span className="text-3xl">
                        <AiFillCloseSquare />
                        </span>
                        </button>
                        <div className='likesordislikestitle'> {titleToRender} </div>
                      
                            <div className='peoplecontainer'>
                                <ol>
                                {people}
                                </ol>
                            </div>
                        </>
                </div>
  )
}

export default ListOfUsersRenderer