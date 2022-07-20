"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Para las rutas en general
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./auth/index"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
// server.use("/auth",(req,res)=>authRouter.get(req,res));
server.use("/auth", index_1.default);
exports.default = server;
