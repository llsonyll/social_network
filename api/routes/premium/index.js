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
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default('sk_test_51LPwrkFSz33wG2Vonf5yG4W2lDY1xk3pQk08tmCKG3mXzNsxSBWvnvGnDGPZgb2daRoqzS4k55dMC6iJVK3OccF600zQOQvySl', { apiVersion: '2020-08-27' });
const router = express_1.default.Router();
router.post('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let { id, amount, plan } = req.body; // AGREGAR PLAN EN FRONT
        const { userId } = req.params;
        if (!plan || !amount || !id)
            return res.status(400).json({ msg: 'Missing data' });
        amount *= 100;
        let user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        if (user.isPremium)
            return res.json({ msg: 'You\'re already premium' });
        const payment = yield stripe.paymentIntents.create({
            amount,
            payment_method: id,
            currency: 'USD',
            confirm: true
        });
        if (payment.status === 'succeeded') {
            function sumarDias(fecha, dias, plan) {
                if (plan === 'weekly') {
                    fecha.setDate(fecha.getDate() + dias);
                    return fecha;
                }
                if (plan === 'monthly') {
                    fecha.setMonth(fecha.getMonth() + dias);
                    return fecha;
                }
                if (plan === 'yearly') {
                    fecha.setFullYear(fecha.getFullYear() + dias);
                    return fecha;
                }
            }
            const date = new Date();
            if (plan === 'weekly')
                var expirationDate = sumarDias(date, 7, plan);
            if (plan === 'monthly')
                var expirationDate = sumarDias(date, 1, plan);
            if (plan === 'yearly')
                var expirationDate = sumarDias(date, 1, plan);
            user.isPremium = true;
            user.expirationDate = expirationDate;
            user.plan = plan;
            (_a = user.paymentsId) === null || _a === void 0 ? void 0 : _a.push(payment.id);
            yield user.save();
            const transaction = new mongoose_1.Payment({
                paymentId: payment.id,
                userId: user._id,
                amount,
                paymentDate: new Date(),
                plan
            });
            yield transaction.save();
            return res.status(201).json({ msg: "Successfull payment" });
        }
    }
    catch (error) {
        ((_b = error.raw) === null || _b === void 0 ? void 0 : _b.message)
            ? res.status(400).json((_c = error.raw) === null || _c === void 0 ? void 0 : _c.message)
            : res.status(400).json({ msg: 'Payment fails' });
    }
}));
router.put('/private/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield mongoose_1.User.findById(`${userId}`)
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
            .select("-password");
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        if (user.isPrivate)
            user.isPrivate = false;
        else
            user.isPrivate = true;
        yield user.save();
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
