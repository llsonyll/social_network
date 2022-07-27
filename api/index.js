"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const route_js_1 = __importDefault(require("./routes/route.js"));
const http_1 = require("http");
const index_js_1 = __importDefault(require("./socket/index.js"));
const app = (0, http_1.createServer)(route_js_1.default);
(0, index_js_1.default)(app);
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;
app.listen(port, host, () => console.log(`port ${port} and host ${host}`));
