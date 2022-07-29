import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { User } from "../mongoose";


export interface ServerToClientEvents {
    noArg: () => void;
    privMessage: (content: String, _id:Types.ObjectId, chatId:Types.ObjectId) => void;
    call: (_id:Types.ObjectId) => void
  }
  
export interface ClientToServerEvents {
    logged: (_id: Types.ObjectId, socketId: string) => void;
    privMessage: (content:string, toId:Types.ObjectId,fromId: Types.ObjectId,  chatId:Types.ObjectId) => void;
    call: (toId:Types.ObjectId, fromId: Types.ObjectId ) => void;
}
  
export interface InterServerEvents {
    ping: () => void;
}
  
export interface SocketData {
    name: string;
    age: number;
}



const userHandler = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, socket:Socket<ClientToServerEvents,ServerToClientEvents>) => {

    socket.on("logged",async (_id, socketId) => {
        try{
            let user = await User.findById(_id)
            if(user){
                user.isConnected = true
                user.socketId = socketId
                await user.save()
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on('privMessage', async(content, _id, fromId, chatId)=> {
        try{
            let user = await User.findById(_id)
            console.log('aveeeer')
            if(user){
                io.to(`${user.socketId}`).emit('privMessage', content, fromId, chatId)
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on('call', async(_id, fromId) => {
        try{
            let user = await User.findById(_id)
            console.log('llega la call')
            if(user){
                io.to(`${user.socketId}`).emit('call', fromId)
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on('disconnect', async () => {
        try{
            let user = await User.findOne({socketId: socket.id})
            if(user){
                user.isConnected = false
                user.socketId = undefined
                await user.save()
            }
        }catch(err){
            console.log(err)
        }
    })
}


export default userHandler