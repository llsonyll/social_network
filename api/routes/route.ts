// Para las rutas en general
import express from 'express';
import authRouter from "./auth/index";
import cors from "cors";

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

// server.use("/auth",(req,res)=>authRouter.get(req,res));
server.use("/auth",authRouter);

export default server;
