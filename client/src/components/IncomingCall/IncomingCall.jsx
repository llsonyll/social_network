import Draggable from "react-draggable"
import { AiOutlinePhone } from "react-icons/ai"
import { FiPhoneMissed } from "react-icons/fi"
import Avatar from "../Avatar"



const IncomingCall = (props) => {
    
    const {data, acceptCall, denyCall} = props

    function handleAcceptCall(){
        acceptCall(data._id)
    }
    function handleDenyCall(){
        denyCall(data._id)
    }

    return (
        <Draggable bounds="parent ">
            <div className="absolute z-50  ">
            <div className="flex flex-col">
            <div className="text-white text-center flex flex-col items-center">
            <Avatar imgUrl={data.profilePicture} size='xl' className='m-0'/>
            {data.username}
            </div>
            <div>
                <button onClick={handleAcceptCall} className='bg-green-600 text-white p-2 rounded-md mx-1'><AiOutlinePhone/></button>
                <button className='bg-red-600 text-white p-2 rounded-md mx-1' onClick={handleDenyCall}><FiPhoneMissed/></button>
            </div>
            </div>
            </div>
        </Draggable>
    )
}


export default IncomingCall
