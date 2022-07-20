// Para las rutas en general
import express from 'express'
import authRouter from "./auth/index"
import userRoute from './user/index'

const server = express();

server.use(express.json());

server.use('/user', userRoute)
server.use("/auth",authRouter);

export default server;
