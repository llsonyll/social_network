"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../mongoose");
const userHandler = (io, socket) => {
    socket.on("logged", (_id, socketId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield mongoose_1.User.findById(_id);
            if (user) {
                user.isConnected = true;
                user.socketId = socketId;
                yield user.save();
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on('privMessage', (content, _id, fromId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield mongoose_1.User.findById(_id);
            console.log('aveeeer');
            if (user) {
                io.to(`${user.socketId}`).emit('privMessage', content, fromId, chatId);
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on('call', (_id, fromId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield mongoose_1.User.findById(_id);
            if (user) {
                io.to(`${user.socketId}`).emit('call', fromId);
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on('closeCall', (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield mongoose_1.User.findById(_id);
            if (user) {
                console.log('acallegoTranqui');
                io.to(`${user.socketId}`).emit('closeCall');
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on('notification', (type, refId, userId, toId, username, profilePicture, content) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield mongoose_1.User.findById(toId);
            if (user) {
                io.to(`${user.socketId}`).emit('notification', type, refId, userId, profilePicture, username, content);
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield mongoose_1.User.findOne({ socketId: socket.id });
            if (user) {
                user.isConnected = false;
                user.socketId = undefined;
                yield user.save();
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.default = userHandler;
