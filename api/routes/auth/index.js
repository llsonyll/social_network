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
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("../../utils/nodemailer");
let router = express_1.default.Router();
//---------------function create Token--------------------
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ user: { id: user._id, email: user.email } }, `${process.env.SECRET_TEST}`, {
        expiresIn: 60 * 15,
    });
};
//---------------function create Token--------------------
const refreshToken = (user, _idToken) => {
    return jsonwebtoken_1.default.sign({ email: user.email, userTokenId: _idToken }, `${process.env.SECRET_REFRESH}`, {
        expiresIn: "1d",
    });
};
//---------------middleware new User-----------------------------
const middlewareNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password, firstname, lastname, username } = req.body;
        const profileArray = [
            "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p1_anad93.png",
            "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p2_tj88ek.png",
            "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p3_dlphru.png",
            "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p4_zy2yhe.png",
            "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p5_i3n2nd.png",
        ];
        if (!email || !password || !firstname || !lastname || !username) {
            return res
                .status(400)
                .json({ message: "Please, send your email and password" });
        }
        //search if User already exists
        let user = yield mongoose_1.User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        //password encryption
        let salt = yield bcrypt_1.default.genSalt(10);
        let hash = yield bcrypt_1.default.hash(password, salt);
        //verify email existence uwu
        // await emailExistence.check(`${email}`, async(err: any, response: boolean) => {
        //   if(!response) {
        //     return res.status(400).json({message: "Email doesn't exists"})
        //   }
        // })
        let newUser = new mongoose_1.User(Object.assign(Object.assign({}, req.body), { password: hash, profilePicture: profileArray[Math.floor(Math.random() * 5)] }));
        yield newUser.save();
        next();
    }
    catch (error) {
        res.json(error);
    }
});
router.get("/logOuterr", (req, res) => {
    res.status(400).json("fallo logOut");
});
//----------------------log up -----------------------------------------------
router.put("/logOut", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/logOuterr",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user } = req;
        if (!user) {
            return res.status(400).json("user required");
        }
        yield mongoose_1.Token.deleteOne({ email: user.email });
        return res.json({});
    }
    catch (err) {
        res.json(err);
    }
}));
//---------------------------refresh Token---------------------------------------------
router.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let currentRefreshToken = req.body.refreshToken;
        let user = yield mongoose_1.User.findOne({ email: currentRefreshToken.email });
        if (!user) {
            return res.status(400).json("user not register");
        }
        let tokenUser = yield mongoose_1.Token.findOneAndUpdate({ email: currentRefreshToken.email }, { token: createToken(user) }, { new: true }); //actualiza user
        if (!tokenUser) {
            return res.status(400).json("token not exist");
        }
        // //---------------le resta 20 minutos a la actua ------------------------------
        // let difference: any = new Date().getTime();
        // difference = new Date(difference - 60 * 20000);
        // //---------------------cada 24 horas ------------------------------------------
        // let cookie = " ";
        // if(new Date(currentRefreshToken.exp*1000) > difference) {
        //     cookie = refreshToken(user as IUser, tokenUser._id.toString()); 
        // };
        console.log("ENTRE");
        return res.status(200).json({ msg: "todo salio bien" });
    }
    catch (err) {
        console.log(err);
        return res.json(err);
    }
}));
//------------rute register-----------------------------
router.post("/register", middlewareNewUser, passport_1.default.authenticate("local", {
    session: false,
    failureRedirect: "/auth/login",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //user return of passport strategy
    try {
        let { user } = req;
        console.log(user);
        if (!user) {
            return res.status(400).json("The user does not exists");
        }
        const send = user;
        const mailInfo = {
            title: "New User Registered",
            subject: "Registration",
            message: `<li>Register has been completed successfully</li>`,
        };
        const { message } = yield (0, nodemailer_1.sendMail)(mailInfo, send.email);
        console.log(message);
        //------------------deleted token-----------------------------
        yield mongoose_1.Token.deleteOne({ email: send.email });
        let token = new mongoose_1.Token({
            email: send.email,
            token: createToken(user),
        });
        yield token.save();
        return res.status(200).json({
            token: refreshToken(user, token._id.toString()),
            username: send.username,
            _id: send._id,
            profilePicture: send.profilePicture,
            isDeleted: send.isDeleted,
            isAdmin: send.isAdmin,
            isPremium: send.isPremium,
        });
    }
    catch (error) {
        res.json(error);
    }
}));
//route error login
router.get("/login", (req, res) => {
    res.status(400).json("Incorrect email or password.");
});
router.get("/loginjwt", (req, res) => {
    res.status(400).json("Token needed");
});
//-----------------------------login user -----------------------------
/*
  strategy passport local, verify user in database if error redirect route error login
*/
router.post("/login", passport_1.default.authenticate("local", {
    session: false,
    failureRedirect: "/auth/login",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //user return of passport strategy
    try {
        let { user } = req;
        if (user) {
            const send = user;
            //--------------elimina susuario----------------------------
            yield mongoose_1.Token.deleteOne({ email: send.email });
            let token = new mongoose_1.Token({
                email: send.email,
                token: createToken(user),
            });
            yield token.save();
            if (send.isPremium) {
                const date = new Date();
                if (send.expirationDate) {
                    if (date > send.expirationDate) {
                        const newUser = yield mongoose_1.User.findById(send._id);
                        if (newUser) {
                            newUser.followers = newUser.followers.concat(newUser.followRequest);
                            newUser.isPremium = false;
                            newUser.expirationDate = undefined;
                            newUser.plan = undefined;
                            newUser.isPrivate = false;
                            newUser.set({ followRequest: [] });
                            yield newUser.save();
                        }
                    }
                }
            }
            let newRefreshtoken = refreshToken(user, token._id.toString());
            return res.status(200).json({
                token: newRefreshtoken,
                username: send.username,
                _id: send._id,
                profilePicture: send.profilePicture,
                isDeleted: send.isDeleted,
                isAdmin: send.isAdmin,
                isPremium: send.isPremium,
            });
            //res.redirect()
        }
        return res.status(400).json("The user does not exists");
    }
    catch (error) {
        res.json(error);
    }
}));
//--------------------------------------login google-------------------------------------
router.get("/loginGoogle", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const send = user;
        //------------------deleted token-----------------------------
        yield mongoose_1.Token.deleteOne({ email: send.email });
        let token = new mongoose_1.Token({
            email: send.email,
            token: createToken(user),
        });
        yield token.save();
        res.cookie("token", refreshToken(user, token._id.toString()), { domain: `.socialn.me`, maxAge: 10000 });
        return res.redirect(`${process.env.URL_FRONT}`);
    }
    catch (err) {
        res.status(400).json({ err: "todo salio mal" });
    }
}));
//---------------------------facebook---------------------------------
router.get("/loginFacebook", passport_1.default.authenticate("facebook", {
    scope: ["email"],
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const send = user;
        //------------------deleted token-----------------------------
        yield mongoose_1.Token.deleteOne({ email: send.email });
        let token = new mongoose_1.Token({
            email: send.email,
            token: createToken(user),
        });
        yield token.save();
        res.cookie("token", refreshToken(user, token._id.toString()), { domain: `.socialn.me`, maxAge: 10000 });
        return res.redirect(`${process.env.URL_FRONT}`);
    }
    catch (err) {
        res.status(400).json({ err: "todo salio mal" });
    }
}));
//------------------------route data user----------------------------------
router.post("/", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //-------------extract Authorization from HTTP headers----------------
        const authorization = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ");
        if (!authorization ||
            authorization.length !== 2 ||
            authorization[0].toLocaleLowerCase() !== "bearer") {
            return res.status(400).json("no token");
        }
        const token = authorization[1];
        //------------------------decode token-----------------------------------
        let verifyToken = jsonwebtoken_1.default.verify(`${token}`, `${process.env.SECRET_REFRESH}`);
        if (!verifyToken || !verifyToken.email) {
            res.status(401).json("Invalid Token");
        }
        let { email } = verifyToken;
        const user = yield mongoose_1.User.findOne({ email: `${email}` });
        console.log(user);
        if (!user) {
            return res.status(400).json("Invalid Token");
        }
        let { _id, username, profilePicture, isDeleted, isAdmin, isPremium } = user;
        if (user.isPremium) {
            const date = new Date();
            if (user.expirationDate) {
                if (date > user.expirationDate) {
                    user.followers = user.followers.concat(user.followRequest);
                    user.isPrivate = false;
                    user.isPremium = false;
                    user.expirationDate = undefined;
                    user.plan = undefined;
                    user.set({ followRequest: [] });
                    yield user.save();
                }
            }
        }
        return res.status(200).json({
            _id: _id.toString(),
            username,
            profilePicture,
            isDeleted,
            isAdmin,
            isPremium,
        });
    }
    catch (err) {
        return res.status(400).json(err);
    }
}));
//-------------------------route test---------------------------------
router.get("/test", passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => {
    res.json({ msg: "Todo funciona a la perfeccion" });
});
exports.default = router;
