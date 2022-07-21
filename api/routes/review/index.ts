import express, {Request, Response} from 'express';
import { Review, User } from "../../mongoose";
import passport from 'passport'

const router = express.Router();

router.post('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { description, stars } = req.body;

    const user = await User.findById(`${userId}`);

    if (!user || !description || !stars) return res.status(404).json({msg: 'idk'})

    try {
        const newReview = new Review({
            description,
            stars,
            userId: user._id
        })

        await newReview.save();

        return res.status(201).json({msg: 'Review created successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }

})

export default router;
