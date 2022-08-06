import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import { useDispatch} from 'react-redux'
//acciones
import { editPost, deletePost } from "../../redux/actions/postActions";


const EditPost = ({ userId , postNumber, content, showEditComponent}) => {
    const dispatch = useDispatch()
    const[postText , setPostText] = useState(content)
    //redux

    const handleOnCancel = () => {
		showEditComponent()
	}
    const handleOnEditPost = () => {
        dispatch(editPost(userId, postNumber, {content:postText}))
        handleOnCancel()
        //console.log('EDITANDO POST');
    }
    const handleDeletePost = () => {
        dispatch(deletePost(userId, postNumber))
        handleOnCancel()
        //console.log('BORRANDO POST');
    }

  return (
    <div
    data-modal-placement='top-middle'
    className={`fixed inset-0 z-50 bg-black/40 items-center justify-center  overflow-y-auto overflow-x-hidden flex`}>
    <div className='fixed p-4 w-full max-w-xl h-full md:h-auto'>
        <div className='relative rounded-lg shadow bg-[#363636]'>
            <div className='text-white text-center pt-10 text-xl '>Edit Post</div>

            <button
                type='button'
                className='absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 '
                data-modal-toggle='popup-modal'
                onClick={handleOnCancel}
                >
                <span className='text-2xl'>
                <AiFillCloseSquare />
                </span>
            </button>
            <div className='py-5 px-6 lg:px-8 flex'>
                <form className='space-y-8 flex-1 mx-3' action='#'>
                    <textarea
                        id='message'
                        className='block outline-none bg-stone-800 p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none'
                        placeholder={`Edit Post`}
                        defaultValue={content}
                        onChange={(e) => setPostText(e.target.value)}
                        maxLength={2000}
                        >
                            {/* {
                                `${content}`
                            } */}
                        </textarea>

                    <div className=" relative flex items-baseline justify-center after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeletePost()
                            }}
                            className='bg-red-500 mx-1 text-white  mt-5 py-2 px-8 rounded-md shadow-lg text-sm transition-all hover:scale-105 '>
                            Delete post &#128078;
                        </button>
                        <button
                            /* disabled={comment === ''} */
                             onClick={(e) => {
                                e.preventDefault()
                                handleOnEditPost()
                            }}
                            className='bg-green-600 mx-1 text-white  mt-5 py-2 px-8 rounded-md shadow-lg text-sm transition-all hover:scale-105 disabled:bg-gray-600'>
                            Edit &#128077;
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
  )
}

export default EditPost
