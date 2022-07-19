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
let router = (0, express_1.default)();
//------------rute register-----------------------------
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    if (!email || password) {
        return res.status(400).json({ message: "Please, send your email and password" });
    }
    let user = yield mongoose_1.User.findOne({ email: email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    let salt = yield bcrypt_1.default.genSalt(10);
    req.body.password = yield bcrypt_1.default.hash(password, salt);
    let newUser = new mongoose_1.User(req.body);
    newUser.save();
    res.status(200).json(newUser);
}));
//-------------rute login---------------------------------
router.post("/login");
router.listen(3000, () => "success connect");
