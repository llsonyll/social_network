import React from 'react'
import Avatar from '../Avatar'
import './listOfUsersRenderer.css'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import { AiFillCloseSquare } from "react-icons/ai";
//iconos
import {AiOutlineSearch} from 'react-icons/ai'

const ListOfUsersRenderer = ({likes, dislikes, renderLikes, renderDislikes}) => {

    let arr = []

    if (likes) {
         arr = likes
    }
    if (dislikes) {
         arr = dislikes
    }
    

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
                        <button className='absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800' onClick={renderLikes ? renderLikes : renderDislikes}>
                        <span className="text-3xl">
                        <AiFillCloseSquare />
                        </span>
                        </button>
                        <div className='likesordislikestitle'> {likes ? 'Likes' : 'Dislikes'} </div>
                      
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