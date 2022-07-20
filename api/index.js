"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const route_js_1 = __importDefault(require("./routes/route.js"));
route_js_1.default.listen(3001, () => console.log("listening on port 3001"));
