"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const route_js_1 = __importDefault(require("./routes/route.js"));
const http_1 = require("http");
const index_js_1 = __importDefault(require("./socket/index.js"));
const socket_io_1 = require("socket.io");
const app = (0, http_1.createServer)(route_js_1.default);
const io = new socket_io_1.Server(app, {
    cors: {
        //origin: "http://localhost:3000"
        origin: "*"
    }
});
const onConnection = (socket) => {
    (0, index_js_1.default)(io, socket);
};
io.on('connect', onConnection);
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;
app.listen(port, host, () => console.log(`port ${port} and host ${host}`));
