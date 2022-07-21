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
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user || !content)
            return res.status(404).json({ msg: 'idk' });
        const newPost = new mongoose_1.Post({
            content,
            userId: user._id
        });
        yield newPost.save();
        user.posts.push(newPost._id);
        yield user.save();
        return res.status(201).json({ msg: 'Post created successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.post('/comment/:userId/:postId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.params;
    const { content } = req.body;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        const post = yield mongoose_1.Post.findById(`${postId}`);
        if (!user || !post || !content)
            return res.status(404).json({ msg: 'idk' });
        const newComment = new mongoose_1.Comment({
            content,
            userId: user._id,
            postId: post._id
        });
        yield newComment.save();
        post.commentsId.push(newComment._id);
        yield post.save();
        return res.status(201).json(post);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.get('/home/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let page = parseInt(`${req.query.page}`);
    if (!page)
        page = 0;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ errorMsg: 'who are you?' });
        if (user.following.length === 0) {
            const posts = yield mongoose_1.Post.find({}).skip(page * 20).limit(20);
            res.json(posts);
        }
        //  else {
        //si el usuario sigue a otros usuarios
        // }
    }
    catch (err) {
        return res.status(404).json({ errorMsg: err });
    }
}));
exports.default = router;
