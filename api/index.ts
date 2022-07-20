import 'dotenv/config'
import server from './routes/route.js'

console.log(process.env.MONGO_URI);

server.listen(3000, () => console.log("listening on port 3000"))
