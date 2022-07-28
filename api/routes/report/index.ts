import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment,  } from '../../mongoose';

const router = express.Router()

router.post('/:userId/:reportId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body; 

    } catch (error) {
        return res.status(400).json(error);
    }
});

export default router;
