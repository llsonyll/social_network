import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import { useDispatch} from 'react-redux'


//acciones
import { deleteComment, editComment } from "../../redux/actions/commentActions";

const EditComment = ({ renderChangeRenderComponents, data , props}) => {
    const[comment, Setcomment] = useState('')
    //redux
    const dispatch = useDispatch()
    console.log('hola',props);
    useEffect(() => {
        Setcomment(data.content)
    }, [])
    

    const handleOnCancel = () => {
		renderChangeRenderComponents('editComment')
	}

    const handleOnEditComment = () => {
        dispatch(editComment(data.userId._id, props.post._id,data._id,{content: comment}))
		handleOnCancel('editComment')
    }
    const handleDeleteComment = () => {
        dispatch(deleteComment(data.userId._id, props.post._id,data._id))
		handleOnCancel('editComment')
    }

  return (
    <div
    data-modal-placement='top-middle'
    className={` fixed inset-0 z-50 bg-black/40 items-center justify-center overflow-y-auto overflow-x-hidden flex`}>
    <div className='relative p-4 w-full max-w-xl h-full md:h-auto'>
        <div className='relative rounded-lg shadow bg-[#363636]'>
            <div className='text-white text-center pt-10 text-xl '>Edit Comment</div>

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
                        placeholder={`Edit Comment`}
                        value={comment}
                        onChange={(e) => Setcomment(e.target.value)}
                        >
                            {
                                `${data.content}`
                            }
                        </textarea>

                    <div className=" relative flex items-baseline justify-center after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeleteComment()
                            }}
                            className='bg-red-500 mx-1 text-white  mt-5 py-2 px-8 rounded-md shadow-lg text-sm transition-all hover:scale-105 '>
                            Delete &#128078;
                        </button>
                        <button
                            disabled={comment === ''}
                            onClick={(e) => {
                                e.preventDefault()
                                handleOnEditComment()
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

export default EditComment