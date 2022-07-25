import 'dotenv/config'
import server from './routes/route.js'


const host = process.env.HOST || '0.0.0.0';
const port: any = process.env.PORT || 3001;

server.listen(port,host, () => console.log("listening on port 3001"))
