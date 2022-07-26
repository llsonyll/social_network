"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.messageSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    chatId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Chat' },
    content: { type: String, required: true }
});
