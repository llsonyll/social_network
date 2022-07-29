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
    try {
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user || !description || !stars)
            return res.status(404).json({ msg: 'idk' });
        const review = yield mongoose_1.Review.findOne({ userId: user._id });
        if (review)
            return res.status(401).json({ msg: 'User already has a review' });
        const newReview = new mongoose_1.Review({
            description,
            stars,
            userId: user._id
        });
        yield newReview.save();
        user.review = newReview._id;
        yield user.save();
        return res.status(201).json(newReview);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userReviews = yield mongoose_1.Review.find({})
            .populate('userId', ['firstname', 'lastname']);
        if (!userReviews.length)
            return res.json([]);
        return res.json(userReviews);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.delete('/:userId/:reviewId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, userId } = req.params;
    try {
        const findReview = yield mongoose_1.Review.findById(`${reviewId}`);
        if (!findReview)
            return res.status(404).json({ msg: 'Review not found, but you can create one with 5 stars ;)' });
        if (`${findReview.userId}` !== userId)
            return res.status(400).json({ msg: 'You can only delete your own review' });
        const user = yield mongoose_1.User.findById(`${userId}`);
        if (!user)
            return res.status(400).json({ msg: 'Anonymus review xd' });
        yield mongoose_1.Review.deleteOne({ _id: findReview._id });
        user.review = undefined;
        yield user.save();
        const allReviews = yield mongoose_1.Review.find({});
        if (!allReviews.length)
            return res.json([]);
        return res.json(allReviews);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
router.put('/:userId/:reviewId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId, userId } = req.params;
        const { description, stars } = req.body;
        //Checks if body has content
        if (!description && !stars) {
            return res.status(400).json('Necesita tener descripción o estrellas');
        }
        ;
        const review = yield mongoose_1.Review.findById(`${reviewId}`);
        //Checks if review exists and if the review was made by the user
        if (!review) {
            res.status(404).json("Review doesn't exist");
        }
        else if (`${review.userId}` !== userId) {
            res.status(400).json("You can only modify your own review");
        }
        else {
            //Change description or stars and save
            if (description)
                review.description = description;
            if (stars)
                review.stars = stars;
            yield review.save();
            const allReviews = yield mongoose_1.Review.find({});
            if (!allReviews.length)
                return res.json([]);
            res.status(200).json(allReviews);
        }
        ;
    }
    catch (err) {
        res.status(400).json('Something went wrong');
    }
}));
exports.default = router;
