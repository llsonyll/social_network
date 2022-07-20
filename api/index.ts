import 'dotenv/config'
import server from './routes/route.js'


server.listen(3001, () => console.log("listening on port 3001"))
