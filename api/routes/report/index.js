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
router.post('/:userId/:reportId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body;
        if (!reason) {
            return res.status(404).json({ msg: 'Not Reason' });
        }
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        if (reported === 'comment') {
            const comment = yield mongoose_1.Comment.findById(`${reportId}`);
            if (!comment)
                return res.status(404).json({ msg: 'Comment not found' });
            var report = new mongoose_1.Report({
                userId: user._id,
                commentReportedId: comment._id,
                reason
            });
        }
        else if (reported === 'post') {
            const post = yield mongoose_1.Post.findById(`${reportId}`);
            if (!post)
                return res.status(404).json({ msg: 'Post not found' });
            var report = new mongoose_1.Report({
                userId: user._id,
                postReportedId: post._id,
                reason
            });
        }
        else {
            const user = yield mongoose_1.User.findById(`${reportId}`);
            if (!user)
                return res.status(404).json({ msg: 'User not found' });
            var report = new mongoose_1.Report({
                userId: user._id,
                userReportedId: user._id,
                reason
            });
        }
        if (!report)
            return res.status(401).json({ msg: 'Reported fails' });
        yield report.save();
        return res.status(201).json({ msg: 'Reported successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.get('/', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        let reports = [];
        if (!type) {
            reports = yield mongoose_1.Report.find({})
                .populate({
                path: 'commentReportedId',
                select: ['userId', 'content'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            })
                .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            })
                .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            });
        }
        if (type === "post") {
            reports = yield mongoose_1.Report.find({ postReportedId: { $exists: true } })
                .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            });
        }
        if (type === "comment") {
            reports = yield mongoose_1.Report.find({ commentReportedId: { $exists: true } })
                .populate({
                path: 'commentReportedId',
                select: ['userId', 'content'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            });
        }
        if (type === "user") {
            reports = yield mongoose_1.Report.find({ userReportedId: { $exists: true } })
                .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            });
        }
        return res.json(reports);
    }
    catch (err) {
        return res.status(400).json({ errMsg: err });
    }
}));
router.delete('/:userId/:reportId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reportId } = req.params;
        const { type } = req.body;
        const admin = yield mongoose_1.User.findById(`${userId}`);
        if (!admin || !admin.isAdmin)
            return res.status(401).json('Missings permissions');
        const report = yield mongoose_1.Report.findById(`${reportId}`);
        if (!report)
            return res.status(404).json('Report not found');
        if (type === 'post') {
            const post = yield mongoose_1.Post.findById(`${report.postReportedId}`);
            if (!post)
                return res.status(404).json('Post not found');
            console.log(post);
            const user = yield mongoose_1.User.findById(`${post.userId}`);
            if (!user)
                return res.status(404).json('User not found');
            console.log(user);
            const newUser = yield mongoose_1.User.findOneAndUpdate({ _id: user._id }, { $pull: { posts: `${post._id}` } }, { new: true });
            if (!newUser)
                return res.status(400).json('Not posible to delete');
            console.log(newUser);
            yield newUser.save();
            const commentId = post.commentsId;
            yield mongoose_1.Comment.deleteMany({ _id: { $in: commentId } });
            yield report.remove();
            yield post.remove();
            return res.json('Reported successfully');
        }
        if (type === 'comment') {
            const comment = yield mongoose_1.Comment.findById(`${report.commentReportedId}`);
            if (!comment)
                return res.status(404).json('Comment not found');
            console.log(comment);
            const post = yield mongoose_1.Post.findById(comment.postId);
            if (!post)
                return res.status(404).json('Post not found');
            console.log(post);
            const newPost = yield mongoose_1.Post.findOneAndUpdate({ _id: post._id }, { $pull: { commentsId: comment._id } }, { new: true });
            if (!newPost)
                return res.status(400).json('Not posible to delete');
            yield newPost.save();
            console.log(newPost);
            yield report.remove();
            yield comment.remove();
            console.log('todo ok');
            return res.json('Reported successfully');
        }
        const user = yield mongoose_1.User.findById(`${report.userReportedId}`);
        if (!user || `${user._id}` === `${admin._id}`)
            return res.status(404).json('Not posible to proceed');
        // FALTA ELIMINAR TODO LO RELACIONADO AL USER
        user.isDeleted = true;
        yield user.save();
        return res.json('Reported successfully');
    }
    catch (err) {
        return res.status(400).json('Something went wrong');
    }
}));
exports.default = router;
