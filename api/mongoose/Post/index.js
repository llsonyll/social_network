"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
exports.postSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
    },
    commentsId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    likes: [
        {
            types: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    dislikes: [
        {
            types: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});
