import { Types } from "mongoose";
import { Server } from "socket.io";


interface ServerToClientEvents {
    noArg: () => void;
    privMessage: (text: String) => void
  }
  
interface ClientToServerEvents {
    logged: (_id: Types.ObjectId, socketId: string) => void;
    privMessage: (text:string, _id:Types.ObjectId) => void;
}
  
interface InterServerEvents {
    ping: () => void;
}
  
interface SocketData {
    name: string;
    age: number;
}


export default function a(app:any){
    
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(app, {
        cors: {
          origin: "http://localhost:3000"
        }
      });


    return io.on("connection", (socket) => {
        console.log(socket.id)
    })
}