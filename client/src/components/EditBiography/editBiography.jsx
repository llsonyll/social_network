import '../../pages/Profile'
import { useState } from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import Avatar from '../Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { modifyUser } from '../../redux/actions/userActions'
import { goodAlerts } from "../../utils/SweetAlertTypes/SweetAlerts";

const EditFullname = ({ renderChangeRenderComponents, user }) => {
	const [bio, setBio] = useState('')
	const loggedUser = useSelector(store => store.auth.loggedUser)
	const dispatch = useDispatch()

	const handleChange = (e) => {
		setBio(e.target.value)
	}

	const handleOnCancel = () => {
		renderChangeRenderComponents('biography')
	}

	const handleOnSubmit = () => {
		dispatch(modifyUser(loggedUser._id, {biography: bio}))
		goodAlerts('You changed your Biography!')
		renderChangeRenderComponents('biography')
	}

	return (
		<div
			data-modal-placement='top-middle'
			className={` fixed inset-0 z-50 bg-black/40 items-center justify-center overflow-y-auto overflow-x-hidden flex`}>
			<div className='relative p-4 w-full max-w-xl h-full md:h-auto'>
				<div className='relative rounded-lg shadow bg-[#363636]'>
					<div className='text-white text-center pt-10 text-xl '> Write a new Biography and submit it</div>

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
							<textarea
								id='message'
								rows='4'
								maxLength="200"
								className='block outline-none bg-stone-800 p-2.5 w-full text-sm bg-transparent rounded-lg border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 resize-none'
								placeholder={`New Biograpy`}
								value={bio}
								onChange={handleChange}></textarea>

							<div className=" relative flex items-baseline justify-center after:content-[''] after:ml-0 after:absolute after:right-0 after:left-0 after:-top-2 after:bg-[#424242] after:h-0.5">
								<button
									onClick={(e) => {
										e.preventDefault()
										handleOnSubmit()
									}}
									className='bg-green-600 text-white  mt-5 py-2 px-8 rounded-md shadow-lg text-sm transition-all hover:scale-105 '>
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
