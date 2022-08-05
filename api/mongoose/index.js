"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.Payment = exports.Report = exports.Message = exports.Chat = exports.Review = exports.Post = exports.Comment = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Chat_1 = require("./Chat");
const Comment_1 = require("./Comment");
const Message_1 = require("./Message");
const Post_1 = require("./Post");
const Review_1 = require("./Review");
const User_1 = require("./User");
const Report_1 = require("./Report");
const Payment_1 = require("./Payment");
const Notification_1 = require("./Notification");
mongoose_1.default.connect(`${process.env.MONGO_URI}`);
exports.User = (0, mongoose_1.model)('User', User_1.userSchema);
exports.Comment = (0, mongoose_1.model)('Comment', Comment_1.commentsSchema);
exports.Post = (0, mongoose_1.model)('Post', Post_1.postSchema);
exports.Review = (0, mongoose_1.model)('Review', Review_1.reviewSchema);
exports.Chat = (0, mongoose_1.model)('Chat', Chat_1.chatSchema);
exports.Message = (0, mongoose_1.model)('Message', Message_1.messageSchema);
exports.Report = (0, mongoose_1.model)('Report', Report_1.reportSchema);
exports.Payment = (0, mongoose_1.model)('Payment', Payment_1.paymentSchema);
exports.Notification = (0, mongoose_1.model)('Notification', Notification_1.notificationSchema);
