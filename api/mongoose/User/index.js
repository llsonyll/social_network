"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true }],
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    followers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    isAdmin: { type: Boolean, default: false, required: true },
    isPremium: { type: Boolean, default: false, required: true },
    isPrivate: { type: Boolean, default: false, required: true },
    isConnected: Boolean,
    birthday: Date,
    biography: String,
    review: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' }
});
