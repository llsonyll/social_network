// Para las rutas en general
import express from 'express'
import authRouter from "./auth/index"

const server = express();

server.use(express.json());

// server.use("/auth",(req,res)=>authRouter.get(req,res));
server.use("/auth",authRouter);

export default server;
