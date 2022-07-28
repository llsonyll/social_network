// Para las rutas en general
import express,{ Response, Request } from 'express';
import authRouter from "./auth/index";
import cors from "cors";
import { Auth } from '../controllers/auth';
import { User } from '../mongoose';
import passport  from 'passport';
import userRoute from './user/index';
import reviewRoute from './review';
import postRoute from './post';
import commentRoute from './comment';
import morgan from "morgan";
import chatRoute from './chat'

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
  origin: "*",
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

server.use(cors(options));

server.use(express.json());
server.use(morgan("dev"));
Auth(server,User);
server.use(passport.initialize());

server.get("/",(req:Request, res:Response) => {
  res.json({msg:"funciono todo bien"})
})

server.use("/post", postRoute);
server.use('/user', userRoute);
server.use("/auth", authRouter);
server.use('/review', reviewRoute);
server.use('/comment', commentRoute);
server.use('/chat', chatRoute)

export default server;
