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
        let post = yield mongoose_1.Post.findById(`${postId}`);
        //Checks if post exists and if the post was made by the user
        if (!post) {
            res.status(400).json("Post doesn't exist");
        }
        else if (`${post.userId}` !== userId) {
            res.status(400).json("Only modify your own posts");
        }
        else {
            //Change content and save
            post.content = content;
            yield post.save();
            res.status(200).json('Comment modified');
        }
    }
    catch (err) {
        res.status(400).json('Something went wrong');
    }
}));
exports.default = router;
