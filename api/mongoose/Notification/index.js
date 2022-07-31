"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.notificationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment', 'follow', 'message'], required: true },
    content: { type: String, required: true },
    seen: { type: Boolean }
}, {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});
