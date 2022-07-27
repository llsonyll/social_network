import express, { Response, Request } from 'express';
import passport from 'passport';
import { User } from '../../mongoose';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51LPwrkFSz33wG2Vonf5yG4W2lDY1xk3pQk08tmCKG3mXzNsxSBWvnvGnDGPZgb2daRoqzS4k55dMC6iJVK3OccF600zQOQvySl', {apiVersion: '2020-08-27'});

const router = express.Router()

router.post('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    try {
        
        let { id, amount } = req.body;
        const { userId } = req.params;
        amount *= 100;
    
        const payment = await stripe.paymentIntents.create({
            amount,
            payment_method: id,
            currency: 'USD',
            confirm: true
        })
        if (payment.status === 'succeeded') {
            
            const user = await User.findOneAndUpdate({_id: `${userId}`}, {isPremium: true}, {new: true})
            if (!user) return res.status(404).json({msg: 'User not found'});
            console.log(user)
            
            await user.save()

            console.log(user)

            return res.json({msg: "Successfull payment"})
        }
    } catch (error: any) {
        error.raw.message 
        ? res.status(400).json(error.raw.message)
        : res.status(400).json({msg: "Subscription fails"});
    }
});

export default router;
