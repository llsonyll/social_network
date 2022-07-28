import 'dotenv/config'
import server from './routes/route.js'
import {createServer} from 'http'
import userHandler, { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket/index.js'
import { Server } from 'socket.io'

const app = createServer(server)

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(app, {
    cors: {
      origin: "http://localhost:3000"
    }
  });

const onConnection = (socket:any) => {
    userHandler(io, socket)
}

io.on('connect', onConnection )




const host = process.env.HOST || '0.0.0.0';
const port: any = process.env.PORT || 3001;

app.listen(port,host, () => console.log(`port ${port} and host ${host}`))
