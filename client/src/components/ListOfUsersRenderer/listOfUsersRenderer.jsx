import React from 'react'
import Avatar from '../Avatar'
import './listOfUsersRenderer.css'
import {useSelector, useDispatch} from 'react-redux'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import { AiFillCloseSquare } from "react-icons/ai";
//iconos
import {AiOutlineSearch} from 'react-icons/ai'
import { listLikes, listDislikes } from '../../redux/actions/listOfUsersRendererActions' 
import clearList from '../../redux/reducers/listOfUsersRenderer.slice'
//lo llamo desde profilePosts.jsx
//Este componente renderiza las personas que dieron like/dislike/siguen/son seguidas...
//Se puede usar para renderizar usuarios dependiendo de lo que uno necesite mostrar.
//El arr que llega contiene las personas a renderizar. Si no hay arr debe haber id de post, si hay id de post, va y trae la gente que dio likes o dislikes al post.

const ListOfUsersRenderer = ({arrayOfPeopleToRender = [], postId = '' , userId = '', closeRenderFunction, titleToRender}) => {
    const dispatch = useDispatch()

    let arr = []
    
    if (titleToRender === 'likes' && arrayOfPeopleToRender.length > 0) {
        arr = arrayOfPeopleToRender
    }
    if (titleToRender === 'likes' && postId.length > 0) { 
        arr = useSelector((state) => state.listRenderer.likesPost)
        //console.log(arr);
    }
    if (titleToRender === 'dislikes') {
        arr = useSelector((state) => state.listRenderer.dislikesPost)
        //console.log(arr);
    }
    if (titleToRender === 'followers' && userId.length > 0) {
        arr = useSelector((state) => state.listRenderer.followers)
    }
    if (titleToRender === 'following' && userId.length > 0) {
        arr = useSelector((state) => state.listRenderer.following)
    }

    //esto divide el arr de likes/dislikes/followers/following

    let people = null;
    people = arr?.map((person) => {
        if (person.username) {
            return(
                <Link to={`/home/profile/${person._id}`}>
                <div className='persontile'>
                    <div className='friend-contact__avatar'>
                        <Avatar size= 'l'imgUrl={person.profilePicture}/>
                    </div>
                            <div  className='personname'>
                                <span>{person.username}</span>
                            </div>
                </div>
                </Link> 
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
              <div className='textToRender absolute center mb-80 pb-3 font-bold uppercase'> {titleToRender} </div>
                  <div className='peoplecontainersiii overflow-auto h-72 ml-3 mt-10 w-11/12'>
                      <ol>
                      {people}
                      </ol>
              </div>
      </div>
  )
}

export default ListOfUsersRenderer