import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment, Post } from '../../mongoose';

const router = express.Router()

router.post('/:userId/:reportId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body;

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
        .populate('commentReportedId', 'userId')
        .populate('postReportedId', 'userId')
    }
    if(type === "postReportedId") {
        reports = await Report.find({postReportedId: {$exists: true} })
        .populate('postReportedId', 'userId')
    } if(type==="commentReportedId") {
        reports = await Report.find({commentReportedId: {$exists: true}})
        .populate('commentReportedId', 'userId')
    } if(type==="userReportedId") {
        reports = await Report.find({userReportedId: {$exists: true}})
    }

    res.json(reports)

} catch(err) { 
    res.status(400).json({errMsg: err})
}

});

router.delete('/:userId/:reportId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req:Request, res:Response) =>{
    try{
        const { userId, reportId } = req.params;
        const { type } = req.body;

        const admin = await User.findById(`${userId}`);
        if(!admin || !admin.isAdmin) return res.status(401).json('Missings permissions');
        
        const report = await Report.findById(`${reportId}`);
        
        if(!report) return res.status(404).json('Report not found');
        
        if (type === 'post') {
            const post = await Post.findById(`${report.postReportedId}`);
            if (!post) return res.status(404).json('Post not found');
            console.log(post)
            
            const user = await User.findById(`${post.userId}`);
            if (!user) return res.status(404).json('User not found');
            console.log(user)
            
            const newUser = await User.findOneAndUpdate({_id: user._id}, {$pull: {posts: `${post._id}`}}, {new: true});
            if (!newUser) return res.status(400).json('Not posible to delete');
            console.log(newUser)
            await newUser.save();
            
            const commentId = post.commentsId;
            await Comment.deleteMany({_id: {$in: commentId}});
            await report.remove();
            await post.remove();
            
            return res.json('Reported successfully');
        }
        if (type === 'comment') {
            const comment = await Comment.findById(`${report.commentReportedId}`);
            if (!comment) return res.status(404).json('Comment not found');
            console.log(comment)

            const post = await Post.findById(comment.postId);
            if (!post) return res.status(404).json('Post not found');
            console.log(post)

            const newPost = await Post.findOneAndUpdate({_id: post._id}, {$pull: {commentsId: comment._id}}, {new: true});
            if (!newPost) return res.status(400).json('Not posible to delete');
            await newPost.save();
            console.log(newPost)
            await report.remove();
            await comment.remove();
            console.log('todo ok')

            return res.json('Reported successfully');
        }

        // const report = await User.findById(`${reportId}`);
        // if (!report) return res.status(404).json('User not found');

        // report.isDeleted = true;
        // await report.save();
        
        return res.json('Reported successfully');
    }catch(err){
        return res.status(400).json('Something went wrong');
    }
});

export default router;
