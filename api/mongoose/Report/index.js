"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchema = void 0;
const mongoose_1 = require("mongoose");
exports.reportSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    postReportedId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' },
    commentReportedId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' },
    userReportedId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, required: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    },
    versionKey: false
});
