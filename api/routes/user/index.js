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
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = require("../../utils/nodemailer");
const router = express_1.default.Router();
// GET "/browser/:username"
router.get("/browser/:username", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        //---------------------find User by username ---> return ([{id,username},{}....])---------------------------
        const users = yield mongoose_1.User.find({ username: new RegExp(`^${username}`, "i") }, { username: 1, _id: 1, profilePicture: 1 }).limit(4);
        if (!Object.values(users).length) {
            return res.status(400).json({ err: "User not fount" });
        }
        return res.status(200).json(users);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
router.get("/browserFollowing/:userId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let { users } = req.query;
    !users ? users = "" : null;
    try {
        //---------------------find User by username ---> return ([{id,username},{}....])---------------------------
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ errorMsg: "Who r u?!!!!" });
        const foundUsers = yield mongoose_1.User.find({ username: {
                $regex: users,
                $options: "i"
            }, _id: { $in: user.following } })
            // .select(['-password', '-chats', '-socketId', '-isAdmin', '-chats', '-paymentsId', ''])
            .select(['_id', 'username', 'profilePicture', 'firstname', 'lastname', 'isPremium']);
        console.log(foundUsers);
        return res.status(200).json(foundUsers);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
// GET '/:userId'
router.get("/:userId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`)
            // .populate('posts', select['_id', 'likes', 'dislikes', 'content','commentsId'], populate:{path: 'userId', select: ['username', 'likes']} )
            .populate({
            path: "posts",
            select: [
                "content",
                "createdAt",
                "likes",
                "dislikes",
                "_id",
                "commentsId",
                "multimedia",
            ],
            options: { sort: { createdAt: -1 } },
            populate: { path: "userId", select: ["username", "profilePicture"] },
        })
            .populate({
            path: "review",
        })
            .populate('followRequest', ['username', 'profilePicture'])
            // .populate('followRequest', 'username')
            // .populate('following', 'username')
            // .populate('followers', 'username')
            .select("-password");
        if (!user)
            return res.status(404).json({ errorMsg: "who are you?" });
        return res.status(201).json(user);
    }
    catch (err) {
        res.status(404).json({ errorMsg: err });
    }
}));
// PUT "/updatePassword"
router.put("/updatePassword", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword, userId } = req.body;
        if (!oldPassword || !newPassword)
            return res.status(400).json({ error: "Passwords should be provided" });
        const user = yield mongoose_1.User.findById(userId);
        if (!user)
            return res.status(400).json({
                error: "Email provided does not belong to any registered user",
            });
        const match = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!match)
            return res.status(400).json({
                error: "Validation error on password you provided as current password",
            });
        const mailMessage = {
            title: "Password Changed",
            subject: "Password Update",
            message: `<li>Your password has been changed successfully</li>`,
        };
        const { message } = yield (0, nodemailer_1.sendMail)(mailMessage, user.email);
        //password encryption
        let salt = yield bcrypt_1.default.genSalt(10);
        let hash = yield bcrypt_1.default.hash(newPassword, salt);
        user.password = hash;
        yield user.save();
        return res.status(200).json({
            message: "User's password updated successfully",
        });
    }
    catch (err) {
        return res.status(400).json(err);
    }
}));
// PUT '/:userId'
router.put("/:userId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { username, firstname, lastname, biography, profilePicture, coverPicture } = req.body;
        if (!username &&
            !firstname &&
            !lastname &&
            !biography &&
            biography !== "" &&
            !profilePicture &&
            !coverPicture) {
            return res.status(400).json({ errprMsg: "Please send data" });
        }
        if (req.body.isPremium === false) {
            req.body.plan = undefined;
            req.body.expirationDate = undefined;
        }
        if (req.body.isPremium) {
            req.body.plan = 'weekly';
            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }
            const date = new Date();
            req.body.expirationDate = sumarDias(date, 7);
        }
        const user = yield mongoose_1.User.findByIdAndUpdate(`${userId}`, req.body, {
            new: true,
        })
            .populate({
            path: "posts",
            select: [
                "content",
                "likes",
                "dislikes",
                "_id",
                "commentsId",
                "createdAt",
                "multimedia",
            ],
            options: { sort: { createdAt: -1 } },
            populate: { path: "userId", select: ["username", "profilePicture"] },
        })
            // .populate('following', 'username')
            // .populate('followers', 'username')
            .select("-password");
        if (!user)
            return res.status(404).json({ errorMsg: "who are you?" });
        return res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
// GET '/home/:userId'
router.get("/home/:userId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let page = parseInt(`${req.query.page}`);
    let control = req.query.control;
    !control ? (control = "true") : null;
    if (!page)
        page = 0;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ errorMsg: "who are you?" });
        const date = new Date().getTime();
        let result = [];
        if (user.following.length > 0) {
            if (control === "true") {
                result = yield mongoose_1.Post.find({
                    // userId: { $in: [...user.following, user._id] },
                    $or: [{ userId: user._id }, { userId: { $in: user.following } }],
                    createdAt: { $gte: new Date(date - 259200000) },
                }) //menos 3 dias
                    .sort({ createdAt: -1 })
                    .skip(page * 10)
                    .limit(10)
                    .populate("userId", ["username", "profilePicture"]);
            }
            else {
                result = yield mongoose_1.Post.find({
                    createdAt: { $gte: new Date(date - 259200000) },
                    userId: { $nin: [...user.following, user._id] },
                })
                    .sort({ createdAt: -1 })
                    .skip(page * 10)
                    .limit(10)
                    .populate("userId", ["username", "profilePicture"]);
            }
        }
        if (user.following.length === 0) {
            result = yield mongoose_1.Post.find({
                createdAt: { $gte: new Date(date - 259200000) },
            })
                .sort({ createdAt: -1 })
                .skip(page * 10)
                .limit(10)
                .populate("userId", ["username", "profilePicture"]);
        }
        res.json(result);
    }
    catch (err) {
        return res.status(404).json({ errorMsg: err });
    }
}));
// POST "/restorePassword"
router.post("/restorePassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email not provided" });
        const [user] = yield mongoose_1.User.find({ email: email });
        if (!user)
            return res.status(400).json({
                error: "Email provided does not belong to any registered user",
            });
        const generateRandomString = (num) => {
            let result = Math.random().toString(36).substring(0, num);
            return result;
        };
        const dummyPassword = generateRandomString(Math.random() * 10 + 6);
        const mailMessage = {
            title: "Password Restored",
            subject: "Password Restoration",
            message: `<li>Your password has been restored to a dummy value, you should change it quickly as possible, because its not safe now</li>
      <li>New Password: <strong>${dummyPassword}</strong></li>`,
        };
        const { message } = yield (0, nodemailer_1.sendMail)(mailMessage, user.email);
        console.log(message);
        //password encryption
        let salt = yield bcrypt_1.default.genSalt(10);
        let hash = yield bcrypt_1.default.hash(dummyPassword, salt);
        user.password = hash;
        yield user.save();
        return res.status(200).json({
            message: "Successfully user's password restored",
        });
    }
    catch (err) {
        return res.status(400).json(err);
    }
}));
// PUT "/follow/:userId/:userIdFollowed"
router.put("/follow/:userId/:userIdFollowed", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, userIdFollowed } = req.params;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`); // usuario
        const userFollowed = yield mongoose_1.User.findById(`${userIdFollowed}`); // usuario seguido
        if (!user || !userFollowed)
            return res.status(404).json({ error: "some user doesn't exists" });
        if (user.email === userFollowed.email)
            return res.status(404).json({ error: "No te podes autoseguir capo" });
        if (user.following.includes(userFollowed._id) ||
            userFollowed.followers.includes(user._id)) {
            yield mongoose_1.User.updateOne({ _id: user._id }, {
                $pull: {
                    following: userFollowed._id,
                },
            }, { new: true });
            yield mongoose_1.User.updateOne({ _id: userFollowed._id }, {
                $pull: {
                    followers: user._id,
                },
            }, { new: true });
        }
        else if (userFollowed.isPrivate) {
            if (userFollowed.followRequest.includes(user._id)) {
                yield mongoose_1.User.updateOne({ _id: userFollowed._id }, {
                    $pull: {
                        followRequest: user._id,
                    },
                }, { new: true });
            }
            else {
                userFollowed.followRequest.push(user._id);
            }
            yield userFollowed.save();
        }
        else {
            // user.following.push(userFollowed._id);
            yield mongoose_1.User.findOneAndUpdate({ _id: user._id }, {
                $addToSet: {
                    following: user._id
                }
            });
            yield user.save();
            // userFollowed.followers.push(user._id);
            yield mongoose_1.User.findOneAndUpdate({ _id: userFollowed._id }, {
                $addToSet: {
                    followers: user._id
                }
            });
            yield userFollowed.save();
        }
        const userFollowedUpdated = yield mongoose_1.User.findById(userFollowed._id);
        return res
            .status(200)
            .json({
            followers: userFollowedUpdated.followers,
            followRequest: userFollowedUpdated.followRequest,
        });
    }
    catch (err) {
        return res.status(404).json({ errorMsg: err });
    }
}));
//ruta para borrar la cuenta de un usuario
router.put("/deleted/:userId", passport_1.default.authenticate("jwt", { session: false, failureRedirect: "/auth/loginjwt", }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        let user = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, {
            $set: {
                posts: [],
                following: [],
                followers: [],
                followRequest: [],
                chats: []
            }
        }, { new: true });
        if (!user)
            return res.status(404).json('User not found');
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
        user.profilePicture = 'https://recursoshumanostdf.ar/download/multimedia.normal.83e40515d7743bdf.6572726f725f6e6f726d616c2e706e67.png';
        user.username = 'User eliminated';
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
        return res.status(200).json('Deleted successfully');
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}));
// -------------- PUT /acceptFollow/:userId/:userRequestingId --- Aceptar solicitud de seguimiento ------------------
router.put("/acceptFollow/:userId/:userRequestingId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userRequestingId } = req.params;
        const userRequesting = yield mongoose_1.User.findById(`${userRequestingId}`);
        if (!userRequesting)
            return res.status(404).json({ msg: "User requesting not found" });
        const user = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, {
            $pull: {
                followRequest: `${userRequesting._id}`,
            },
        }, { new: true });
        if (!user)
            return res.status(404).json({ msg: "User not found" });
        user.followers.push(`${userRequesting._id}`);
        yield user.save();
        userRequesting.following.push(user._id);
        yield userRequesting.save();
        // user = await user
        // .populate()
        return res.json({
            followers: user.followers,
            followRequest: user.followRequest,
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
// -------------- PUT /cancelFollow/:userId/:userRequestingId --- Cancelar solicitud de seguimiento ------------------
router.put("/cancelFollow/:userId/:userRequestingId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userRequestingId } = req.params;
        const userRequesting = yield mongoose_1.User.findById(`${userRequestingId}`);
        if (!userRequesting)
            return res.status(404).json({ msg: "User requesting not found" });
        const user = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, {
            $pull: {
                followRequest: `${userRequesting._id}`,
            },
        }, { new: true });
        if (!user)
            return res.status(404).json({ msg: "User not found" });
        yield user.save();
        return res.json({
            followers: user.followers,
            followRequest: user.followRequest,
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.get('/following/:userId', passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.userId;
        let user = yield mongoose_1.User.findById(`${userId}`)
            .populate("following", ['_id', 'username', 'profilePicture']);
        if (!user) {
            return res.status(400).json('not following');
        }
        res.status(200).json(user.following);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
router.get('/followers/:userId', passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.userId;
        let user = yield mongoose_1.User.findById(`${userId}`)
            .populate("followers", ['_id', 'username', 'profilePicture']);
        if (!user) {
            return res.status(400).json('not followers');
        }
        res.status(200).json(user.followers);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
exports.default = router;
