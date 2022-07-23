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
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("../../mongoose");
const router = express_1.default.Router();
router.post('/:userId/:postId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.params;
    const { content } = req.body;
    console.log('entree');
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        const post = yield mongoose_1.Post.findById(`${postId}`)
            .populate({ path: 'commentsId', select: ['content', 'likes'], populate: { path: 'userId', select: ['username', 'likes'] } })
            .populate('userId', 'username')
            .populate('likes', 'username')
            .populate('dislikes', 'username');
        if (!user)
            return res.status(404).json({ msg: 'idk' });
        if (!post)
            return res.status(404).json({ msg: 'post error' });
        if (!content)
            return res.status(404).json({ msg: 'content error' });
        const newComment = new mongoose_1.Comment({
            content,
            userId: user._id,
            postId: post._id
        });
        yield newComment.save();
        post.commentsId.push(newComment._id);
        yield post.save();
        console.log(post);
        return res.status(201).json(post);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
