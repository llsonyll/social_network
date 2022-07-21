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
const mongoose_1 = require("../../mongoose");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post('/post/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { content } = req.body;
    const user = yield mongoose_1.User.findById(`${userId}`);
    if (!user || !content)
        return res.status(404).json({ msg: 'idk' });
    try {
        const newPost = new mongoose_1.Post({
            content,
            userId: user._id
        });
        yield newPost.save();
        return res.status(201).json({ msg: 'Post created successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.post('/comment/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { content, postId } = req.body;
    const user = yield mongoose_1.User.findById(`${userId}`);
    const post = yield mongoose_1.Post.findById(`${postId}`);
    if (!user || !post || !content)
        return res.status(404).json({ msg: 'idk' });
    try {
        const newComment = new mongoose_1.Comment({
            content,
            userId: user._id,
            postId: post._id
        });
        yield newComment.save();
        return res.status(201).json({ msg: 'Comment created successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.get("/browser/:username", passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        //---------------------find User by username---------------------------
        const users = yield mongoose_1.User.find({ username: new RegExp(`^${username}`, "i") });
        if (!Object.values(users).length) {
            return res.status(400).json({ err: "User not fount" });
        }
        return res.status(200).json(users);
    }
    catch (error) {
    }
}));
exports.default = router;
