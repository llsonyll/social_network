"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = void 0;
const mongoose_1 = require("mongoose");
exports.chatSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message', required: true }]
}, {
    timestamps: {
        createdAt: false,
        updatedAt: true
    },
    versionKey: false
});
