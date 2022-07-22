import express, {Request, Response} from 'express';
import { Review, User } from "../../mongoose";
import passport from 'passport'

const router = express.Router();

router.post('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { description, stars } = req.body;
    
    try {
        const user = await User.findById(`${userId}`);
        
        if (!user || !description || !stars) return res.status(404).json({msg: 'idk'});

        const review = await Review.findOne({userId: user._id});

        if (review) return res.status(401).json({msg: 'User already has a review'});

        const newReview = new Review({
            description,
            stars,
            userId: user._id
        })

        await newReview.save();

        user.review = newReview._id;

        await user.save();

        return res.status(201).json(newReview)
    } catch (error) {
        return res.status(400).json(error)
    }

})

router.get('/', async (req: Request, res: Response) => {

    try{
        const userReviews = await Review.find({});

        if(!userReviews.length) return res.json([]);

        return res.json(userReviews)
    } catch(error) {
        return res.status(400).json(error)
    }
});

router.delete('/:userId/:reviewId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { reviewId, userId } = req.params;
    
    try {
        const findReview = await Review.findById(`${reviewId}`);
    
        if (!findReview) return res.status(404).json({msg: 'Review not found, but you can create one with 5 stars ;)'});

        if (`${findReview.userId}` !== userId) return res.status(400).json({msg: 'You can only delete your own review'});
        
        const user = await User.findById(`${userId}`);

        if (!user) return res.status(400).json({msg: 'Anonymus review xd'});

        await Review.deleteOne({_id: findReview._id});

        user.review = undefined;

        await user.save();

        const allReviews = await Review.find({})

        if (!allReviews.length) return res.json([]);

        return res.json(allReviews);
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.put('/:userId/:reviewId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req:Request, res:Response) => {
    try{
        const {reviewId, userId} = req.params
        const {description, stars} = req.body
        //Checks if body has content
        if(!description && !stars){
            return res.status(400).json('Necesita tener descripción o estrellas');
        };
        const review = await Review.findById(`${reviewId}`);
        //Checks if review exists and if the review was made by the user
        if(!review){
            res.status(404).json("Review doesn't exist");
        }else if(`${review.userId}` !== userId){
            res.status(400).json("You can only modify your own review");
        }else{
            //Change description or stars and save
            if (description) review.description = description;
            if (stars) review.stars = stars;
            
            await review.save();

            const allReviews = await Review.find({});

            if (!allReviews.length) return res.json([])

            res.status(200).json(allReviews);
        };
    }catch(err){
        res.status(400).json('Something went wrong');
    }
});

export default router;
