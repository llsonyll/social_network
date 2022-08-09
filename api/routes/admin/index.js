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
router.get('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const admin = yield mongoose_1.User.findById(`${userId}`);
        if (!admin || !admin.isAdmin)
            return res.status(401).json('Missing permissions');
        const users = yield mongoose_1.User.find({})
            .sort({ followers: -1 })
            .populate('review', ['description', 'stars'])
            .select(['-password', '-posts', '-chats', '-socketId']);
        const posts = yield mongoose_1.Post.find({});
        const reports = yield mongoose_1.Report.find({});
        const usersConnected = users.filter(c => c.isConnected);
        const premiumUsers = users.filter(p => p.isPremium);
        const adminUsers = users.filter(a => a.isAdmin);
        const desactivatedUsers = users.filter(d => d.isDeleted);
        const popularUser = users[0];
        const info = {
            registeredUsers: users.length,
            usersConnected: usersConnected.length,
            activePosts: posts.length,
            premiumUsers: premiumUsers.length,
            adminUsers: adminUsers.length,
            reports: reports.length,
            desactivatedUsers: desactivatedUsers.length,
            popularUser
        };
        return res.status(200).json(info);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}));
router.get('/payments/:adminId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const admin = yield mongoose_1.User.findById(`${adminId}`);
        if (!admin || !admin.isAdmin)
            return res.status(401).json('Missing permissions');
        const payments = yield mongoose_1.Payment.find({});
        return res.json(payments);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}));
exports.default = router;
