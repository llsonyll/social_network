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
router.post('/:userId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { description, stars } = req.body;
    const user = yield mongoose_1.User.findById(`${userId}`);
    if (!user || !description || !stars)
        return res.status(404).json({ msg: 'idk' });
    try {
        const newReview = new mongoose_1.Review({
            description,
            stars,
            userId: user._id
        });
        yield newReview.save();
        user.review = newReview._id;
        yield user.save();
        return res.status(201).json({ msg: 'Review created successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userReviews = yield mongoose_1.Review.find({});
        if (!userReviews.length)
            return res.status(404).json({ msg: "No hay reviews pero somos la mejor red social del mercado actual" });
        return res.json(userReviews);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.delete('/:reviewId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    try {
        const findReview = yield mongoose_1.Review.findById(`${reviewId}`);
        if (!findReview)
            return res.status(404).json({ msg: 'Review not found, but you can create one with 5 stars ;)' });
        const user = yield mongoose_1.User.findById(findReview.userId);
        if (!user)
            return res.json({ msg: 'Anonymus review xd' });
        yield mongoose_1.Review.deleteOne({ _id: findReview._id });
        user.review = undefined;
        yield user.save();
        return res.json({ msg: 'Review deleted successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
