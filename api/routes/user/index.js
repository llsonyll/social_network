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
// GET '/home/:userId' - esta rompe la home
/* router.get(
    '/home/:userId',
    passport.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }),
    async (req: Request, res: Response) => {
        const { userId } = req.params
        let page = parseInt(`${req.query.page}`)

// 		if (!page) page = 0

// 		try {
// 			const user = await User.findById(`${userId}`)
// 			if (!user) return res.status(404).json({ errorMsg: 'who are you?' })

// 			if (user.following.length === 0) {
// 				const posts = await Post.find({})
// 					.sort({ createdAt: -1 })
// 					.skip(page * 20)
// 					.limit(20)
//                     .populate('userId', ['username', 'profilePicture'])
// 				res.json(posts)
// 			}
// 			//  else {

// 			//si el usuario sigue a otros usuarios

            // }
        } catch (err) {
            return res.status(404).json({ errorMsg: err })
        }
    }
) */
// GET '/:userId'
router.get('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`)
            // .populate('posts', select['_id', 'likes', 'dislikes', 'content','commentsId'], populate:{path: 'userId', select: ['username', 'likes']} )
            .populate({
            path: 'posts',
            select: ['content', 'createdAt', 'likes', 'dislikes', '_id', 'commentsId', 'multimedia'],
            options: { sort: { 'createdAt': -1 } },
            populate: { path: 'userId', select: ['username', 'profilePicture'] },
        })
            // .populate('followRequest', 'username')
            // .populate('following', 'username')
            // .populate('followers', 'username')
            .select('-password');
        if (!user)
            return res.status(404).json({ errorMsg: 'who are you?' });
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
router.put('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { username, firstname, lastname, biography, profilePicture } = req.body;
        if (!username && !firstname && !lastname && (!biography && biography !== '') && !profilePicture) {
            return res.status(400).json({ errprMsg: 'Please send data' });
        }
        const user = yield mongoose_1.User.findByIdAndUpdate(`${userId}`, req.body, { new: true })
            .populate({
            path: 'posts',
            select: ['content', 'likes', 'dislikes', '_id', 'commentsId', 'createdAt', 'multimedia'],
            options: { sort: { 'createdAt': -1 } },
            populate: { path: 'userId', select: ['username', 'profilePicture'] }
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
router.get('/home/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let page = parseInt(`${req.query.page}`);
    let control = req.query.control;
    !control ? control = "true" : null;
    if (!page)
        page = 0;
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ errorMsg: 'who are you?' });
        const date = new Date().getTime();
        let result = [];
        if (user.following.length > 0) {
            if (control === "true") {
                result = yield mongoose_1.Post.find({
                    // userId: { $in: [...user.following, user._id] }, 
                    $or: [{ userId: user._id }, { userId: { $in: user.following } }],
                    createdAt: { $gte: new Date(date - 259200000) }
                }) //menos 3 dias                
                    .sort({ createdAt: -1 })
                    .skip(page * 10)
                    .limit(10)
                    .populate('userId', ['username', 'profilePicture']);
            }
            else {
                result = yield mongoose_1.Post.find({
                    createdAt: { $gte: new Date(date - 259200000) },
                    userId: { $nin: [...user.following, user._id] }
                })
                    .sort({ createdAt: -1 })
                    .skip(page * 10)
                    .limit(10)
                    .populate('userId', ['username', 'profilePicture']);
            }
        }
        if (user.following.length === 0) {
            result = yield mongoose_1.Post.find({ createdAt: { $gte: new Date(date - 259200000) } })
                .sort({ createdAt: -1 })
                .skip(page * 10)
                .limit(10)
                .populate('userId', ['username', 'profilePicture']);
        }
        res.json(result);
    }
    catch (err) {
        return res.status(404).json({ errorMsg: err });
    }
}));
router.get('/following/:userId', passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.userId;
        let user = yield mongoose_1.User.findById(`${userId}`).populate('following', ['username', 'profilePicture']);
        console.log(user.following);
        if (!user) {
            return res.status(400).json('not following');
        }
        res.status(200).json(user.following);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
// GET '/:userId' - esta repetida, pero esta no tiene multimedia
/* router.get(
  "/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(`${userId}`)
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
          ],
          options: { sort: { createdAt: -1 } },
          populate: { path: "userId", select: ["username", "profilePicture"] },
        })

        //.populate('following', 'username')
        //.populate('followers', 'username')
        .select("-password");
      if (!user) return res.status(404).json({ errorMsg: "who are you?" });
      return res.status(201).json(user);
    } catch (err) {
      res.status(404).json({ errorMsg: err });
    }
  }
); */
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
        const dummyPassword = "abcde12345";
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
// PUT '/:userId'
/*
COMENTO ESTA PORQUE FRAN DIJO QUE PUEDE SER QUE ESTA SEA EL PROBLEMA, PORQUE ESTÁ DESACTUALIZADA, PERO NO LA BORRO POR SI SE ROMPE ALGO
router.put(
  "/:userId",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
  }),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { username, firstname, lastname, biography } = req.body;

      if (
        !username &&
        !firstname &&
        !lastname &&
        !biography &&
        biography !== ""
      ) {
        return res.status(400).json({ errprMsg: "Please send data" });
      }

      const user = await User.findByIdAndUpdate(`${userId}`, req.body, {
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
          ],
          populate: { path: "userId", select: ["username", "profilePicture"] },
        })
        .populate("following", "username")
        .populate("followers", "username")
        .populate('followRequest', 'username')
        .select("-password");

      if (!user) return res.status(404).json({ errorMsg: "who are you?" });

      return res.json(user);
    } catch (err) {
      res.status(400).json({ errorMsg: err });
    }
  }
); */
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
                        followRequest: user._id
                    }
                }, { new: true });
            }
            else {
                userFollowed.followRequest.push(user._id);
            }
            yield userFollowed.save();
        }
        else {
            user.following.push(userFollowed._id);
            yield user.save();
            userFollowed.followers.push(user._id);
            yield userFollowed.save();
        }
        const userFollowedUpdated = yield mongoose_1.User.findById(userFollowed._id);
        return res.status(200).json(userFollowedUpdated.followers);
    }
    catch (err) {
        return res.status(404).json({ errorMsg: err });
    }
}));
//ruta para borrar la cuenta de un usuario
router.put("/deleted/:userId", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.userId;
        /*    let deletePost = await Post.deleteMany({userId:`${userId}`});
           let deleteComment = await Comment.deleteMany({userId:`${userId}`});
            let deleteReview = await Review.deleteMany({userId:`${userId}`});
            let deleteMessage = await Message.deleteMany({from:`${userId}`});
            let deleteChat = await Chat.findOneAndUpdate({users:{_id:`${userId}`}}); */
        let userDeleted = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, { isDeleted: true }, { new: true });
        if (!userDeleted) {
            return res.status(400).json("Eror deleting user");
        }
        return res.status(200).json(userDeleted);
    }
    catch (err) {
        res.json(err);
    }
}));
// -------------- PUT /acceptFollow/:userId/:userRequestingId --- Aceptar solicitud de seguimiento ------------------
router.put('/acceptFollow/:userId/:userRequestingId', passport_1.default.authenticate("jwt", { session: false, failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userRequestingId } = req.params;
        const userRequesting = yield mongoose_1.User.findById(`${userRequestingId}`);
        if (!userRequesting)
            return res.status(404).json({ msg: 'User requesting not found' });
        const user = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, {
            $pull: {
                followRequest: `${userRequesting._id}`
            }
        }, { new: true });
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        user.followers.push(`${userRequesting._id}`);
        yield user.save();
        userRequesting.following.push(user._id);
        yield userRequesting.save();
        // user = await user
        // .populate()
        return res.json({ followers: user.followers, followRequest: user.followRequest });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
// -------------- PUT /cancelFollow/:userId/:userRequestingId --- Cancelar solicitud de seguimiento ------------------
router.put('/cancelFollow/:userId/:userRequestingId', passport_1.default.authenticate("jwt", { session: false, failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userRequestingId } = req.params;
        const userRequesting = yield mongoose_1.User.findById(`${userRequestingId}`);
        if (!userRequesting)
            return res.status(404).json({ msg: 'User requesting not found' });
        const user = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, {
            $pull: {
                followRequest: `${userRequesting._id}`
            }
        }, { new: true });
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        yield user.save();
        return res.json({ followers: user.followers, followRequest: user.followRequest });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
