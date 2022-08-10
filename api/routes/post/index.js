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
            .populate('userId', ['username', 'profilePicture']);
        //.populate('likes', 'username')
        //.populate('dislikes', 'username')
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
        let user = yield mongoose_1.User.findById(`${userId}`);
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
        //Delete reports of the post
        yield mongoose_1.Report.deleteMany({ postReportedId: { _id: postId } });
        //Delete report of the post comments
        yield mongoose_1.Report.deleteMany({ commentReportedId: { $in: post.commentsId } });
        //Remove post and send response
        yield post.remove();
        res.json('Eliminated from the world');
    }
    catch (err) {
        res.status(400).json('something went wrong');
    }
}));
router.get("/likes/:postId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postId = req.params.postId;
        let post = yield mongoose_1.Post.findById(postId)
            .populate("likes", ['username', 'profilePicture']);
        if (!post) {
            return res.status(404).json("not post");
        }
        ;
        res.status(200).json(post.likes);
    }
    catch (err) {
        res.json(err);
    }
}));
router.get("/dislikes/:postId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postId = req.params.postId;
        let post = yield mongoose_1.Post.findById(postId)
            .populate("dislikes", ['username', 'profilePicture']);
        if (!post) {
            return res.status(404).json("not post");
        }
        ;
        res.status(200).json(post.dislikes);
    }
    catch (err) {
        res.json(err);
    }
}));
router.put("/dislike/:postId/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postId = req.params.postId;
        let userId = req.params.userId;
        let action = req.query.action;
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user) {
            return res.status(400).json("algo salio mal");
        }
        let post = yield mongoose_1.Post.findById(`${postId}`);
        if (!post) {
            return res.status(400).json("algo salio mal");
        }
        if (post.likes.includes(user._id)) {
            yield mongoose_1.Post.updateOne({ _id: postId }, {
                $pull: {
                    likes: user._id,
                },
            });
        }
        if (action === "add") {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $addToSet: {
                    dislikes: user._id
                }
            }, { new: true });
        }
        else {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    dislikes: user._id
                }
            }, { new: true });
        }
        if (!post) {
            return res.status(400).json("not found dislikes");
        }
        res.status(200).json(post);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}));
router.put("/like/:postId/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postId = req.params.postId;
        let userId = req.params.userId;
        let action = req.query.action;
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user) {
            return res.status(400).json("algo salio mal");
        }
        let post = yield mongoose_1.Post.findById(`${postId}`);
        if (!post) {
            return res.status(400).json("algo salio mal");
        }
        if (post.dislikes.includes(user._id)) {
            console.log("entre mal");
            yield mongoose_1.Post.updateOne({ _id: postId }, {
                $pull: {
                    dislikes: user._id,
                },
            });
        }
        if (action === "add") {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $addToSet: {
                    likes: user._id
                }
            }, { new: true });
        }
        else {
            post = yield mongoose_1.Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    likes: user._id
                },
            }, { new: true });
        }
        return res.status(200).json(post);
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
