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
router.get('/browser/:username', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        //---------------------find User by username ---> return ([{id,username},{}....])---------------------------
        const users = yield mongoose_1.User.find({ username: new RegExp(`^${username}`, 'i') }, { username: 1, _id: 1 });
        if (!Object.values(users).length) {
            return res.status(400).json({ err: 'User not fount' });
        }
        return res.status(200).json(users);
    }
    catch (err) {
        res.status(400).json(err);
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
            const posts = yield mongoose_1.Post.find({})
                .sort({ createdAt: -1 })
                .skip(page * 20)
                .limit(20);
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
router.get('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`)
            // .populate('posts', select['_id', 'likes', 'dislikes', 'content','commentsId'], populate:{path: 'userId', select: ['username', 'likes']} )
            .populate({
            path: 'posts',
            select: ['content', 'createdAt', 'likes', 'dislikes', '_id', 'commentsId'],
            populate: { path: 'userId', select: ['username'] },
        })
            .populate('following', 'username')
            .populate('followers', 'username')
            .select('-password');
        if (!user)
            return res.status(404).json({ errorMsg: 'who are you?' });
        return res.status(201).json(user);
    }
    catch (err) {
        res.status(404).json({ errorMsg: err });
    }
}));
exports.default = router;
