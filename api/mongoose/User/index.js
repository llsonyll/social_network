"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true }],
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    followers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    followRequest: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    isAdmin: { type: Boolean, default: false, required: true },
    isPremium: { type: Boolean, default: false, required: true },
    isPrivate: { type: Boolean, default: false, required: true },
    isConnected: Boolean,
    birthday: Date,
    biography: String,
    review: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' },
    socketId: String,
    chats: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true }],
    paymentsId: [{ type: String, ref: 'Payment' }],
    plan: { type: String, enum: ['weekly', 'monthly', 'yearly'] },
    expirationDate: Date
}, {
    versionKey: false
});
