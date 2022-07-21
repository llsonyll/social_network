// Para las rutas en general
import express from 'express';
import authRouter from "./auth/index";
import cors from "cors";
import { Auth } from '../controllers/auth';
import { User } from '../mongoose';
import passport  from 'passport';
import userRoute from './user/index'
import postRoute from './post'

const server = express();

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Authorization'
  ],
  credentials: true,
  origin: "http://localhost:3000",
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

server.use(cors(options))

server.use(express.json());
Auth(server,User);
server.use(passport.initialize());


server.use("/post", postRoute)
server.use('/user', userRoute)
server.use("/auth",authRouter);

export default server;
