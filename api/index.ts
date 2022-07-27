import 'dotenv/config'
import server from './routes/route.js'
import {createServer} from 'http'
import socket from './socket/index.js'

const app = createServer(server)

socket(app)

const host = process.env.HOST || '0.0.0.0';
const port: any = process.env.PORT || 3001;

app.listen(port,host, () => console.log(`port ${port} and host ${host}`))
