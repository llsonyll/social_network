"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentsSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    },
    versionKey: false
});
