import express, { Response, Request } from 'express';
import passport from 'passport';
import { Payment, User } from '../../mongoose';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51LPwrkFSz33wG2Vonf5yG4W2lDY1xk3pQk08tmCKG3mXzNsxSBWvnvGnDGPZgb2daRoqzS4k55dMC6iJVK3OccF600zQOQvySl', {apiVersion: '2020-08-27'});

const router = express.Router()

router.post('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    try {
        
        let { id, amount, plan } = req.body; // AGREGAR PLAN EN FRONT
        const { userId } = req.params;
        if (!plan || !amount || !id) return res.status(400).json({msg: 'Missing data'})
        
        amount *= 100;

        let user = await User.findById(`${userId}`);
        if (!user) return res.status(404).json({msg: 'User not found'});
        if (user.isPremium) return res.json({msg: 'You\'re already premium'});
    
        const payment = await stripe.paymentIntents.create({
            amount,
            payment_method: id,
            currency: 'USD',
            confirm: true
        })
        
        if (payment.status === 'succeeded') {
                        
            function sumarDias(fecha: Date, dias: number, plan: string){
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
            
            if (plan === 'weekly') var expirationDate: any = sumarDias(date, 7, plan);
            if (plan === 'monthly') var expirationDate: any = sumarDias(date, 1, plan);
            if (plan === 'yearly') var expirationDate: any = sumarDias(date, 1, plan);

            user.isPremium = true;
            user.expirationDate = expirationDate;
            user.plan = plan;
            user.paymentsId?.push(payment.id);
            await user.save();

            const transaction = new Payment({
                paymentId: payment.id,
                userId: user._id,
                amount,
                paymentDate: new Date(),
                plan
            });
            await transaction.save();

            return res.status(201).json({msg: "Successfull payment"})
        }
    } catch (error: any) {
        error.raw?.message 
        ? res.status(400).json(error.raw?.message)
        : res.status(400).json({msg: 'Payment fails'});
    }
});

export default router;
