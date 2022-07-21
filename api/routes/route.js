"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Para las rutas en general
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./auth/index"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("../controllers/auth");
const mongoose_1 = require("../mongoose");
const passport_1 = __importDefault(require("passport"));
const index_2 = __importDefault(require("./user/index"));
const server = (0, express_1.default)();
const options = {
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
server.use((0, cors_1.default)(options));
server.use(express_1.default.json());
(0, auth_1.Auth)(server, mongoose_1.User);
server.use(passport_1.default.initialize());
server.use('/user', index_2.default);
server.use("/auth", index_1.default);
exports.default = server;
