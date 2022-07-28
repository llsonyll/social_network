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
router.put("/like/:commentId/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userId, commentId } = req.params;
        let comment = yield mongoose_1.Comment.findById(`${commentId}`);
        if (!comment) {
            return res.status(400).json("comment does not exist");
        }
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user) {
            return res.status(400).json("user does not exist");
        }
        if (comment.dislikes.includes(user._id)) {
            yield mongoose_1.Comment.updateOne({ _id: commentId }, {
                $pull: {
                    dislikes: user._id
                }
            });
        }
        if (!comment.likes.includes(user._id)) {
            comment.likes.push(user._id);
            yield comment.save();
        }
        else {
            comment = yield mongoose_1.Comment.findOneAndUpdate({ _id: commentId }, {
                $pull: {
                    likes: user._id
                }
            }, { new: true });
        }
        return res.status(200).json({ likes: comment.likes, _id: comment._id });
    }
    catch (err) {
        return res.json(err);
    }
}));
router.put("/dislike/:commentId/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userId, commentId } = req.params;
        let comment = yield mongoose_1.Comment.findById(`${commentId}`);
        if (!comment) {
            return res.status(400).json("comment does not exist");
        }
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user) {
            return res.status(400).json("user does not exist");
        }
        if (comment.likes.includes(user._id)) {
            yield mongoose_1.Comment.updateOne({ _id: commentId }, {
                $pull: {
                    likes: user._id
                }
            });
        }
        if (!comment.dislikes.includes(user._id)) {
            comment.dislikes.push(user._id);
            yield comment.save();
        }
        else {
            comment = yield mongoose_1.Comment.findOneAndUpdate({ _id: commentId }, {
                $pull: {
                    dislikes: user._id
                }
            }, { new: true });
        }
        return res.status(200).json({ dislikes: comment.dislikes, _id: comment._id });
    }
    catch (err) {
        return res.json(err);
    }
}));
router.post('/:userId/:postId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.params;
    const { content } = req.body;
    console.log('entree');
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        let post = yield mongoose_1.Post.findById(`${postId}`)
            .populate('userId', ['username', 'profilePicture'])
            //.populate('likes', 'username')
            .populate('dislikes', 'username');
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
        post = yield post.populate({ path: 'commentsId', select: ['content', 'likes'], populate: { path: 'userId', select: ['username', 'likes', 'profilePicture'] } });
        return res.status(201).json(post);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
// router.put('/:userId/:postId/:commentId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
// async (req: Request, res: Response) => {
//    try {
//       const { userId, postId, commentId } = req.params;
//       const { content } = req.body;
//       if (!content) return res.status(400).json({msg: 'Must have content'});
//       const comment = await Comment.findById(`${commentId}`);
//       if (!comment) return res.status(404).json({msg: 'Comment doesn\'t exist'});
//       if (`${comment.userId}` !== userId) return res.status(404).json({msg: 'You can\'t edit other users comments'});
//       if (`${comment.postId}` !== postId) return res.status(404).json({msg: 'Comment doesn\'t belong to this post'});
//       comment.content = content;
//       await comment.save();
//       return res.status(201).json()
//    } catch (error) {
//       return res.status(400).json(error)
//    }
// })    FALTA VERIFICAR QUE FUNCIONE BIEN
exports.default = router;
