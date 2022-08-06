import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { User } from "../mongoose";


export interface ServerToClientEvents {
    noArg: () => void;
    privMessage: (content: String, _id:Types.ObjectId, chatId:Types.ObjectId) => void;
    call: (_id:Types.ObjectId, username: string, profilePicture:string) => void
    closeCall: () => void;
    notification: (type: 'like' | 'follow' | 'comment' | 'message', refId: Types.ObjectId, userId:Types.ObjectId, profilePicture:string, username: string, content: string) => void;
  }
  
export interface ClientToServerEvents {
    logged: (_id: Types.ObjectId, socketId: string) => void;
    privMessage: (content:string, toId:Types.ObjectId,fromId: Types.ObjectId,  chatId:Types.ObjectId) => void;
    call: (toId:Types.ObjectId, fromId: Types.ObjectId , username: string, profilePicture: string) => void;
    closeCall: (_id: Types.ObjectId) => void;
    notification: (type: 'like' | 'follow' | 'comment' | 'message', refId: Types.ObjectId, userId:Types.ObjectId, toId:Types.ObjectId, content:string , profilePicture:string, username: string) => void;
    logout: (_id: Types.ObjectId) => void
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

    socket.on('call', async(_id, fromId, username, profilePicture) => {
        try{
            let user = await User.findById(_id)
            if(user){
                io.to(`${user.socketId}`).emit('call', fromId, username, profilePicture)
            }
        }catch(err){
            console.log(err)
        }
    })
    
    socket.on('closeCall', async (_id) => {
        try{
            let user = await User.findById(_id)
            if(user){
                console.log('acallegoTranqui')
                io.to(`${user.socketId}`).emit('closeCall')
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on('notification', async (type, refId, userId, toId, username, profilePicture, content) => {
        try{
            let user = await User.findById(toId)
            if(user){
                io.to(`${user.socketId}`).emit('notification', type, refId, userId, profilePicture, username, content)
            }
        }catch(err){
            console.log(err)
        }
    })
    
    socket.on('logout', async(_id)=>{
        try{
            let user = await User.findById(_id)
            if(user){
                user.isConnected = false
                user.socketId = undefined
                await user.save()
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