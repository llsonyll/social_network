import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment, Post } from '../../mongoose';

const router = express.Router()

router.post('/:userId/:reportId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body; // REPORTED VA A ACEPTAR 3 VALORES: COMMENT, POST Y USER

        if(!reason){
            return res.status(404).json({msg: 'Not Reason'})
        }

        if (reported === 'comment') {
            const comment = await Comment.findById(`${reportId}`);
            if (!comment) return res.status(404).json({msg: 'Comment not found'});
            var report = new Report({
                userId, // como string o buscarlo y ponerlo como objectid
                commentReportedId: comment._id, // como string o buscarlo y ponerlo como objectid
                reason
            });
        } else if (reported === 'post') {
            const post = await Post.findById(`${reportId}`);
            if (!post) return res.status(404).json({msg: 'Post not found'});
            var report = new Report({
                userId, // como string o buscarlo y ponerlo como objectid
                postReportedId: post._id, // como string o buscarlo y ponerlo como objectid
                reason
            });
        } else {
            const user = await User.findById(`${reportId}`);
            if (!user) return res.status(404).json({msg: 'User not found'});
            var report = new Report({
                userId, // como string o buscarlo y ponerlo como objectid
                userReportedId: user._id, // como string o buscarlo y ponerlo como objectid
                reason
            });
        }
        
        if (!report) return res.status(401).json({msg: 'Reported fails'});

        await report.save();

        return res.status(201).json({msg: 'Reported successfully'});
    } catch (error) {
        return res.status(400).json(error);
    }
});

export default router;
