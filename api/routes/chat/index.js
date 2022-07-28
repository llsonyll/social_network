"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = require("../../mongoose");
const router = express_1.default.Router();
router.get('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let user = yield mongoose_1.User.findById(userId)
            .select('chats')
            .populate({ path: 'chats', populate: { path: 'users', select: ['username', 'profilePicture'] } });
        if (!user) {
            return res.status(400).json({ errorMessage: 'No User Found' });
        }
        return res.json(user);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
router.get('/:userId/:chatUserId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, chatUserId } = req.params;
        let chat;
        if (userId === chatUserId) {
            chat = yield mongoose_1.Chat.findOne({ users: [userId, chatUserId] }).populate('users', ['username', 'profilePicture']).populate('messages', ['content', 'from']);
        }
        else {
            chat = yield mongoose_1.Chat.findOne({ users: { $all: [userId, chatUserId] } }).populate('users', ['username', 'profilePicture']).populate('messages', ['content', 'from']);
        }
        if (chat) {
            return res.json(chat);
        }
        chat = new mongoose_1.Chat({
            users: [userId, chatUserId]
        });
        if (userId === chatUserId) {
            let user = yield mongoose_1.User.findById(userId);
            if (user) {
                user.chats.push(chat._id);
                yield user.save();
            }
            else {
                return res.status(400).json({ errorMessage: 'Something went wrong' });
            }
        }
        else {
            let user1 = yield mongoose_1.User.findById(userId);
            let user2 = yield mongoose_1.User.findById(chatUserId);
            if (user1 && user2) {
                user1.chats.push(chat._id);
                user2.chats.push(chat._id);
                yield user1.save();
                yield user2.save();
            }
            else {
                return res.status(400).json({ errorMessage: 'Something went wrong' });
            }
        }
        yield chat.save();
        return res.redirect(`/chat/${userId}/${chatUserId}`);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
router.post('/message/:userId/:chatId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, chatId } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ errorMessage: 'Plesase send content' });
        }
        let chat = yield mongoose_1.Chat.findById(chatId);
        if (!chat) {
            return res.status(400).json({ errorMessage: 'Chat not found' });
        }
        let message = new mongoose_1.Message({
            from: userId,
            chatId,
            content
        });
        yield message.save();
        chat.messages.push(message._id);
        yield chat.save();
        res.json({
            _id: message._id,
            from: message.from,
            content: message.content
        });
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
//62dedb98ec4e56b835a48601
//62dedbe19dcff657146231a5
exports.default = router;
