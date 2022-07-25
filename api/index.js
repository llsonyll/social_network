"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const route_js_1 = __importDefault(require("./routes/route.js"));
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;
route_js_1.default.listen(port, host, () => console.log(`port ${port} and host ${host}`));
