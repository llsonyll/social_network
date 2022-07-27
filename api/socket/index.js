"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function a(app) {
    const io = new socket_io_1.Server(app, {
        cors: {
            origin: "http://localhost:3000"
        }
    });
    return io.on("connection", (socket) => {
        console.log(socket.id);
    });
}
exports.default = a;
