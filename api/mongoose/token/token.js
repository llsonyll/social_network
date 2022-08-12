"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSchema = void 0;
const mongoose_1 = require("mongoose");
exports.tokenSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true, auto: true },
    email: { type: mongoose_1.Schema.Types.String, unique: true, required: true },
    token: { type: mongoose_1.Schema.Types.String, required: true }
});
