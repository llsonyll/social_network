import 'dotenv/config'
import server from './routes/route.js'



server.listen(3000, () => console.log("listening on port 3000"))
