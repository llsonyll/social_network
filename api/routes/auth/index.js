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
let router = express_1.default.Router();
//---------------function create Token--------------------
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ user: { id: user._id, email: user.email } }, `${process.env.SECRET_TEST}`);
};
//---------------middleware new User-----------------------------
const middlewareNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password, firstname, lastname, username } = req.body;
        if (!email || !password || !firstname || !lastname || !username) {
            return res.status(400).json({ message: "Please, send your email and password" });
        }
        //search if User already exists
        let user = yield mongoose_1.User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        //password encryption
        let salt = yield bcrypt_1.default.genSalt(10);
        let hash = yield bcrypt_1.default.hash(password, salt);
        //create new User
        let newUser = new mongoose_1.User(Object.assign(Object.assign({}, req.body), { password: hash }));
        yield newUser.save();
        //res.status(201).json(newUser);
        next();
    }
    catch (error) {
        res.json(error);
    }
});
//------------rute register----------------------------- 
router.post("/register", middlewareNewUser, passport_1.default.authenticate("local", { session: false, failureRedirect: '/auth/login' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //user return of passport strategy
    try {
        let { user } = req;
        if (user) {
            const send = user;
            return res.status(200).json({ token: createToken(user), username: send.username, _id: send._id });
            //res.redirect()
        }
        return res.status(400).json("The user does not exists");
    }
    catch (error) {
        res.json(error);
    }
}));
//route error login 
router.get("/login", (req, res) => {
    res.status(400).json('Incorrect email or password.');
});
router.get("/loginjwt", (req, res) => {
    res.status(400).json('Token needed');
});
//-----------------------------login user -----------------------------
/*
  strategy passport local, verify user in database if error redirect route error login
*/
router.post("/login", passport_1.default.authenticate("local", { session: false, failureRedirect: '/auth/login' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //user return of passport strategy
    try {
        let { user } = req;
        if (user) {
            const send = user;
            return res.status(200).json({ token: createToken(user), username: send.username, _id: send._id });
            //res.redirect()
        }
        return res.status(400).json("The user does not exists");
    }
    catch (error) {
        res.json(error);
    }
}));
router.get('/test', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => {
    res.json({ msg: 'Todo funciona a la perfeccion' });
});
exports.default = router;
