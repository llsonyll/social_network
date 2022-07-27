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
    try {
        let { id, amount } = req.body;
        const { userId } = req.params;
        amount *= 100;
        const payment = yield stripe.paymentIntents.create({
            amount,
            payment_method: id,
            currency: 'USD',
            confirm: true
        });
        if (payment.status === 'succeeded') {
            const user = yield mongoose_1.User.findOneAndUpdate({ _id: `${userId}` }, { isPremium: true }, { new: true });
            if (!user)
                return res.status(404).json({ msg: 'User not found' });
            console.log(user);
            yield user.save();
            console.log(user);
            return res.json({ msg: "Successfull payment" });
        }
    }
    catch (error) {
        error.raw.message
            ? res.status(400).json(error.raw.message)
            : res.status(400).json({ msg: "Subscription fails" });
    }
}));
exports.default = router;
