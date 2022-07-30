"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
exports.postSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentsId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    likes: [
        new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, require: true },
            username: { type: String }
        })
    ],
    dislikes: [
        new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            username: { type: String }
        })
    ],
    content: { type: String },
    multimedia: String
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    },
    versionKey: false
});
