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

        const user = await User.findById(`${userId}`);
        if (!user) return res.status(404).json({msg: 'User not found'});

        if (reported === 'comment') {
            const comment = await Comment.findById(`${reportId}`);
            if (!comment) return res.status(404).json({msg: 'Comment not found'});
            var report = new Report({
                userId: user._id,
                commentReportedId: comment._id,
                reason
            });
        } else if (reported === 'post') {
            const post = await Post.findById(`${reportId}`);
            if (!post) return res.status(404).json({msg: 'Post not found'});
            var report = new Report({
                userId: user._id,
                postReportedId: post._id,
                reason
            });
        } else {
            const user = await User.findById(`${reportId}`);
            if (!user) return res.status(404).json({msg: 'User not found'});
            var report = new Report({
                userId: user._id,
                userReportedId: user._id,
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


router.get('/', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {

const {type} = req.query


try{
    let reports: any[] = []
    if(!type) {
        reports = await Report.find({})
    }
    if(type === "postReportedId") {
        reports = await Report.find({postReportedId: {$exists: true} })
    } if(type==="commentReportedId") {
        reports = await Report.find({commentReportedId: {$exists: true}})
    } if(type==="userReportedId") {
        reports = await Report.find({userReportedId: {$exists: true}})
    }

    res.json(reports)

} catch(err) { 
    res.status(400).json({errMsg: err})
}

})

export default router;
