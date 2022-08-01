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
router.put('/:userId/:postId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId } = req.params;
        const { content } = req.body;
        //Checks if body has content
        if (!content) {
            return res.status(400).json('Necesita tener contenido');
        }
        let post = yield mongoose_1.Post.findById(`${postId}`)
            .populate({ path: 'commentsId', select: ['content', 'likes'], populate: { path: 'userId', select: ['username', 'likes', 'profilePicture'] } })
            //.populate('likes', 'username')
            .populate('dislikes', 'username');
        //Checks if post exists and if the post was made by the user
        if (!post) {
            res.status(400).json("Post doesn't exist");
        }
        else if (`${post.userId}` !== userId) { // ALGO PASAAA
            console.log(`${post.userId}`);
            console.log(userId);
            res.status(400).json("Only modify your own posts");
        }
        else {
            //Change content and save
            post.content = content;
            yield post.save();
            post = yield post.populate('userId', ['username', 'profilePicture']);
            res.status(200).json(post);
        }
    }
    catch (err) {
        res.status(400).json('Something went wrong');
    }
}));
router.get('/:postId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        //Search a post and select the data we want to send
        let post = yield mongoose_1.Post.findById(`${postId}`)
            .populate({ path: 'commentsId', select: ['content', 'likes', 'dislikes'], populate: { path: 'userId', select: ['username', 'likes', 'dislikes', 'profilePicture'] } })
            .populate('userId', ['username', 'profilePicture'])
            //.populate('likes', 'username')
            .populate('dislikes', 'username');
        //If no post found send error, else send the post
        if (!post) {
            res.status(400).json("Post doesn't exist");
        }
        else {
            res.json(post);
            console.log(post);
        }
    }
    catch (err) {
        res.status(400).json('Something went wrong');
    }
}));
router.delete('/:userId/:postId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, postId } = req.params;
        let post = yield mongoose_1.Post.findById(`${postId}`);
        //if no post founded or the post was made by other user sends error
        if (!post) {
            return res.status(400).json('Post not found');
        }
        if (`${post.userId}` !== userId) {
            return res.status(400).json('Delete only your own posts');
        }
        let user = yield mongoose_1.User.findById(`${userId}`).populate({
            path: 'posts',
            select: ['content', 'createdAt', 'likes', 'dislikes', '_id', 'commentsId', 'multimedia'],
            options: { sort: { 'createdAt': -1 } },
            populate: { path: 'userId', select: ['username', 'profilePicture'] },
        }).select('-password');
        //If no user found send an error
        if (!user) {
            return res.status(400).json('Wtf who did this post????');
        }
        //Delete the post from the posts of the User
        yield user.updateOne({ $pull: { posts: postId } });
        yield user.save();
        //Delete comments done at this post
        let comments = post.commentsId;
        yield mongoose_1.Comment.deleteMany({ _id: { $in: comments } });
        //Remove post and send response
        yield post.remove();
        res.json(user.posts);
    }
    catch (err) {
        res.status(400).json('something went wrong');
    }
}));
router.put("/dislike/:postId/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postId = req.params.postId;
        let userId = req.params.userId;
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user) {
            return res.status(400).json("algo salio mal");
        }
        let post = yield mongoose_1.Post.findById(`${postId}`);
        if (!post) {
            return res.status(400).json("algo salio mal");
        }
        let id = user._id;
        let likes = yield mongoose_1.Post.findOne({ _id: postId, "likes._id": id });
        if (likes) {
            yield mongoose_1.Post.updateOne({ _id: postId }, {
                $pull: {
                    likes: { _id: id },
                },
            });
        }
        let dislikes = yield mongoose_1.Post.findOne({ _id: postId, "dislikes._id": id });
        if (!dislikes) {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $push: {
                    dislikes: { _id: id, username: user.username }
                }
            }, { new: true });
        }
        else {
            console.log("entre");
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    dislikes: { _id: id }
                }
            }, { new: true });
        }
        if (!post) {
            return res.status(400).json("not found dislikes");
        }
        res.status(200).json({ dislikes: post.dislikes, likes: post.likes });
    }
    catch (err) {
        return res.status(400).json(err);
    }
}));
router.put("/like/:postId/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postId = req.params.postId;
        let userId = req.params.userId;
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user) {
            return res.status(400).json("algo salio mal");
        }
        let post = yield mongoose_1.Post.findById(`${postId}`);
        if (!post) {
            return res.status(400).json("algo salio mal");
        }
        let id = user._id;
        let dislikes = yield mongoose_1.Post.findOne({ _id: postId, "dislikes._id": id });
        if (dislikes) {
            yield mongoose_1.Post.updateOne({ _id: postId }, {
                $pull: {
                    dislikes: { _id: id },
                },
            });
        }
        let likes = yield mongoose_1.Post.findOne({ _id: postId, "likes._id": id });
        if (!likes) {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $push: {
                    likes: { _id: id, username: user.username }
                }
            }, { new: true });
        }
        else {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    likes: { _id: id },
                },
            }, { new: true });
        }
        return res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
    }
    catch (err) {
        return res.status(400).json(err);
    }
}));
router.post('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { content, multimedia } = req.body;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ msg: 'No user found' });
        if (!content && !multimedia)
            return res.status(404).json({ msg: 'Please send something' });
        const newPost = new mongoose_1.Post({
            content,
            multimedia,
            userId: user._id
        });
        yield newPost.save();
        user.posts.push(newPost._id);
        yield user.save();
        yield newPost.populate('userId', ['username', 'profilePicture']);
        return res.status(201).json(newPost);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
