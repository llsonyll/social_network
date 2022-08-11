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
const nodemailer_1 = require("../../utils/nodemailer");
const router = express_1.default.Router();
router.post('/:userId/:reportId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body;
        if (!reason)
            return res.status(404).json({ msg: 'Missing reason' });
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        if (reported === 'comment') {
            const existReport = yield mongoose_1.Report.findOne({ commentReportedId: `${reportId}` });
            if (existReport && `${existReport.userId}` === `${userId}`)
                return res.status(400).json({ msg: 'Report already exist' });
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
            const existReport = yield mongoose_1.Report.findOne({ postReportedId: `${reportId}` });
            if (existReport && `${existReport.userId}` === `${userId}`)
                return res.status(400).json({ msg: 'Report already exist' });
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
            const existReport = yield mongoose_1.Report.findOne({ userReportedId: `${reportId}` });
            if (existReport && `${existReport.userId}` === `${userId}`)
                return res.status(400).json({ msg: 'Report already exist' });
            const userReported = yield mongoose_1.User.findById(`${reportId}`);
            if (!userReported)
                return res.status(404).json({ msg: 'User not found' });
            var report = new mongoose_1.Report({
                userId: user._id,
                userReportedId: userReported._id,
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
router.get('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const { userId } = req.params;
        const admin = yield mongoose_1.User.findById(`${userId}`);
        if (!admin || !admin.isAdmin)
            return res.status(401).json('Missings permissions');
        let reports = [];
        if (!type) {
            reports = yield mongoose_1.Report.find({})
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'commentReportedId',
                select: ['userId', 'content', 'postId'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username',]
                }
            })
                .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            })
                .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            });
        }
        if (type === "postReportedId") {
            reports = yield mongoose_1.Report.find({ postReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            });
        }
        if (type === "commentReportedId") {
            reports = yield mongoose_1.Report.find({ commentReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'commentReportedId',
                select: ['userId', 'content', 'postId'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            });
        }
        if (type === "userReportedId") {
            reports = yield mongoose_1.Report.find({ userReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
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
router.put('/:userId/:reportId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reportId } = req.params;
        const { type } = req.body;
        const admin = yield mongoose_1.User.findById(`${userId}`);
        if (!admin || !admin.isAdmin)
            return res.status(401).json('Missings permissions');
        const report = yield mongoose_1.Report.findById(`${reportId}`);
        if (!report)
            return res.status(404).json('Report not found');
        if (type === 'postReportedId') {
            const post = yield mongoose_1.Post.findById(`${report.postReportedId}`);
            if (!post)
                return res.status(404).json('Post not found');
            const user = yield mongoose_1.User.findById(`${post.userId}`);
            if (!user)
                return res.status(404).json('User not found');
            const newUser = yield mongoose_1.User.findOneAndUpdate({ _id: user._id }, { $pull: { posts: `${post._id}` } }, { new: true });
            if (!newUser)
                return res.status(400).json('Not posible to delete');
            yield newUser.save();
            const commentId = post.commentsId;
            yield mongoose_1.Report.deleteMany({ commentReportedId: { $in: commentId } });
            yield mongoose_1.Comment.deleteMany({ _id: { $in: commentId } });
            yield mongoose_1.Report.deleteMany({ postReportedId: { _id: post._id } });
            yield post.remove();
            const newReports = yield mongoose_1.Report.find({ postReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            });
            return res.json(newReports);
        }
        if (type === 'commentReportedId') {
            const comment = yield mongoose_1.Comment.findById(`${report.commentReportedId}`);
            if (!comment)
                return res.status(404).json('Comment not found');
            const post = yield mongoose_1.Post.findById(comment.postId);
            if (!post)
                return res.status(404).json('Post not found');
            const newPost = yield mongoose_1.Post.findOneAndUpdate({ _id: post._id }, { $pull: { commentsId: comment._id } }, { new: true });
            if (!newPost)
                return res.status(400).json('Not posible to delete');
            yield newPost.save();
            yield mongoose_1.Report.deleteMany({ commentReportedId: { _id: comment._id } });
            yield comment.remove();
            const newReports = yield mongoose_1.Report.find({ commentReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'commentReportedId',
                select: ['userId', 'content', 'postId'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            });
            return res.json(newReports);
        }
        if (type === 'userReportedId') {
            let userr = yield mongoose_1.User.findById(`${report.userReportedId}`);
            if (userr) {
                yield mongoose_1.Report.deleteMany({ postReportedId: { $in: userr.posts } });
                for (let i = 0; i < userr.posts.length; i++) {
                    let postsFound = yield mongoose_1.Post.findById(`${userr.posts[i]}`);
                    yield mongoose_1.Report.deleteMany({ commentReportedId: { $in: postsFound === null || postsFound === void 0 ? void 0 : postsFound.commentsId } });
                }
            }
            let user = yield mongoose_1.User.findOneAndUpdate({ _id: `${report.userReportedId}` }, {
                $set: {
                    posts: [],
                    following: [],
                    followers: [],
                    followRequest: []
                }
            }, { new: true });
            if (!user)
                return res.status(404).json('Not posible to proceed');
            const posts = yield mongoose_1.Post.find({ userId: user._id });
            for (let i = 0; i < posts.length; i++) {
                yield mongoose_1.Comment.deleteMany({ _id: { $in: posts[i].commentsId } });
            }
            yield mongoose_1.Post.deleteMany({ userId: user._id });
            yield mongoose_1.Post.updateMany({}, {
                $pull: {
                    likes: `${user._id}`,
                    dislikes: `${user._id}`,
                }
            });
            yield mongoose_1.User.updateMany({}, {
                $pull: {
                    following: `${user._id}`,
                    followers: `${user._id}`,
                    followRequest: `${user._id}`
                }
            });
            yield mongoose_1.Review.deleteOne({ userId: user._id });
            const mailMessage = {
                title: "You were banned",
                subject: "You were banned",
                message: `<li>Hi, ${user.username}. You were banned for breaking the SocialNetwork rules.</li>
                <li>If you think it was a mistake, contact: <strong>vavatyni@gmail.com</strong></li>`,
            };
            yield (0, nodemailer_1.sendMail)(mailMessage, user.email);
            user.profilePicture = 'https://recursoshumanostdf.ar/download/multimedia.normal.83e40515d7743bdf.6572726f725f6e6f726d616c2e706e67.png';
            user.username = "Banned user";
            user.isDeleted = true;
            user.isAdmin = false;
            user.isPremium = false;
            user.isPrivate = false;
            user.birthday = undefined;
            user.biography = undefined;
            user.review = undefined;
            user.plan = undefined;
            user.expirationDate = undefined;
            yield user.save();
            yield mongoose_1.Report.deleteMany({ userReportedId: { _id: user._id } });
            const newReports = yield mongoose_1.Report.find({ userReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            });
            return res.json(newReports);
        }
        res.status(400).json('Please send type of report');
    }
    catch (err) {
        return res.status(400).json('Something went wrong');
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
        if (!report)
            return res.status(404).json('Report not found');
        if (type === 'postReportedId') {
            yield mongoose_1.Report.deleteMany({ postReportedId: { _id: report.postReportedId } });
            const newReports = yield mongoose_1.Report.find({ postReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            });
            return res.json(newReports);
        }
        if (type === 'commentReportedId') {
            yield mongoose_1.Report.deleteMany({ commentReportedId: { _id: report.commentReportedId } });
            const newReports = yield mongoose_1.Report.find({ commentReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'commentReportedId',
                select: ['userId', 'content', 'postId'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname', 'username']
                }
            });
            return res.json(newReports);
        }
        if (type === 'userReportedId') {
            yield mongoose_1.Report.deleteMany({ userReportedId: { _id: report.userReportedId } });
            const newReports = yield mongoose_1.Report.find({ userReportedId: { $exists: true } })
                .sort({ createdAt: -1 })
                .populate('userId', 'username')
                .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            });
            return res.json(newReports);
        }
        res.status(400).json('Please send type of report');
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
