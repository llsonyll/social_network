import '../../pages/Profile'
import { useState } from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import Avatar from '../Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { modifyUser } from '../../redux/actions/userActions'

const EditFullname = ({ renderChangeRenderComponents, user }) => {
	const loggedUser = useSelector(store => store.auth.loggedUser)
	const dispatch = useDispatch()
	const handleOnCancel = () => {
		renderChangeRenderComponents('firstname')
	}
	//DESDE AQUI SE PONEN LAS ACCIONES
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')

	const handleOnSubmit = (e) => {
		e.preventDefault()
		if (firstname.length > 0 && lastname.length === 0) {
			dispatch(modifyUser(loggedUser._id, {firstname}))
			alert('You changed your name!')
			renderChangeRenderComponents('firstname')
		}
		else if (firstname.length === 0 && lastname.length > 0) {
			dispatch(modifyUser(loggedUser._id, {lastname}))
			alert('You changed your name!')
			renderChangeRenderComponents('firstname')
		}
		else if (firstname.length > 0 && lastname.length > 0) {
			dispatch(modifyUser(loggedUser._id, {firstname,lastname}))
			alert('You changed your name!')
			renderChangeRenderComponents('firstname')
		}
		else if (firstname.length === 0 && lastname.length === 0) {
			alert('Fill any input before submitting')
		}
	}

	return (
		<div
			data-modal-placement='top-middle'
			className={` absolute inset-0 z-50 bg-black/40 items-center justify-center overflow-y-auto overflow-x-hidden flex`}>
			<div className='relative p-4 w-full max-w-xl h-full md:h-auto'>
				<div className='relative rounded-lg shadow bg-[#363636]'>
					<div className='text-white text-center pt-10 px-2 text-xl'> Write a new name and submit it</div>

					<button
						type='button'
						className='absolute top-2 right-1 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 '
						data-modal-toggle='popup-modal'
						onClick={() => handleOnCancel()}>
						<span className='text-2xl'>
							<AiFillCloseSquare />
						</span>
					</button>
					<div className='py-5 px-6 lg:px-8 flex'>
						<form className='space-y-8 flex-1 mx-3' action='#'>
							<input
								id='message'
								rows='4'
								onChange={(e) => {
									e.preventDefault()
									setFirstname(e.target.value)
								}}
								className='block outline-none bg-stone-800 p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none'
								placeholder={`New First name`}></input>
							<input
								id='message'
								rows='4'
								onChange={(e) => {
									e.preventDefault()
									setLastname(e.target.value)
								}}
								className='block outline-none bg-stone-800 p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none'
								placeholder={`New Last name`}></input>

							<div className=" relative flex text-center items-baseline justify-center after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
								<button
									onClick={(e) => {
										e.preventDefault()
										handleOnSubmit(e)
									}}
									className='bg-green-600 text-white  mt-5 py-2 px-8 rounded-md shadow-lg text-sm  transition-all hover:scale-105'>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditFullname
