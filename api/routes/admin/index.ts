import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment, Post, Payment } from '../../mongoose';

const router = express.Router()

router.get('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const admin = await User.findById(`${userId}`);
        if (!admin || !admin.isAdmin) return res.status(401).json('Missing permissions');

        const users = await User.find({})
        .sort({followers: -1})
        .populate('review', ['description', 'stars'])
        .select(['-password', '-posts', '-chats', '-socketId'])

        const posts = await Post.find({});

        const reports = await Report.find({});

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
        }

        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }

});

router.get('/payments/:adminId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;

        const admin = await User.findById(`${adminId}`);
        if (!admin || !admin.isAdmin) return res.status(401).json('Missing permissions')

        const payments = await Payment.find({});
        
        return res.json(payments);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
})

export default router;
