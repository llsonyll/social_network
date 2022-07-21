"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = require("mongoose");
exports.reviewSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true },
    stars: { type: Number, required: true }
}, {
    versionKey: false
});
