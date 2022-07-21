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
// router.delete('/reviewId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
//     const { reviewId } = req.params;
//     const review = await Review.findById(`${reviewId}`);
//     if (!review) return res.status(404).json({msg: 'Review not found'});
//     try {
//         await Review.deleteById(review._id)
//         return res.json({msg: 'Review deleted successfully'})
//     } catch (error) {
//         return res.status(400).json(error);
//     }
// });
exports.default = router;
