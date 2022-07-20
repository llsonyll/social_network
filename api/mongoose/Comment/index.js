"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, unique: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});
