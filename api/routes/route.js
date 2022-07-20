"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Para las rutas en general
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
exports.default = server;
