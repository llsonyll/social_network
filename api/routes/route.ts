// Para las rutas en general
import express from 'express'
import authRouter from "./auth/index"
import { Auth } from '../controllers/auth';
import { User } from '../mongoose';
import passport  from 'passport';
import userRoute from './user/index'

const server = express();

server.use(express.json());
Auth(server,User);
server.use(passport.initialize());

server.use('/user', userRoute)
server.use("/auth",authRouter);

export default server;