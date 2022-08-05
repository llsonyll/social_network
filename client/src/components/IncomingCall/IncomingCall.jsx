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
        <Draggable bounds="parent">
            <div className="absolute z-50 bottom-0">
            <div className="flex flex-col">
            <div>
            <Avatar imgUrl={data.profilePicture} size='xl'/>
            {data.username}
            </div>
            <div>
                <button onClick={handleAcceptCall} className='bg-green-300'><AiOutlinePhone/></button>
                <button className='bg-red-300' onClick={handleDenyCall}><FiPhoneMissed/></button>
            </div>
            </div>
            </div>
        </Draggable>
    )
}


export default IncomingCall
