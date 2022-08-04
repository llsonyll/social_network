import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment, Post } from '../../mongoose';

const router = express.Router()

router.post('/:userId/:reportId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body;

        if(!reason) return res.status(404).json({msg: 'Missing reason'});

        const user = await User.findById(`${userId}`);
        if (!user) return res.status(404).json({msg: 'User not found'});

        if (reported === 'comment') {
            const existReport = await Report.findOne({ commentReportedId: `${reportId}` });
            if (existReport && `${existReport.userId}` === `${userId}`)
            return res.status(400).json({msg: 'Report already exist'});

            const comment = await Comment.findById(`${reportId}`);
            if (!comment) return res.status(404).json({msg: 'Comment not found'});
            var report = new Report({
                userId: user._id,
                commentReportedId: comment._id,
                reason
            });
        } else if (reported === 'post') {
            const existReport = await Report.findOne({ postReportedId: `${reportId}` });
            if (existReport && `${existReport.userId}` === `${userId}`)
            return res.status(400).json({msg: 'Report already exist'});

            const post = await Post.findById(`${reportId}`);
            if (!post) return res.status(404).json({msg: 'Post not found'});
            var report = new Report({
                userId: user._id,
                postReportedId: post._id,
                reason
            });
        } else {
            const existReport = await Report.findOne({ userReportedId: `${reportId}` });
            if (existReport && `${existReport.userId}` === `${userId}`)
            return res.status(400).json({msg: 'Report already exist'});

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
    try{
        const { type } = req.query;

        let reports: any[] = [];

        if(!type) {
            reports = await Report.find({})
            .populate({
                path: 'commentReportedId',
                select: ['userId', 'content'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            })
            .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            })
            .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            })
        }
        if(type === "post") {
            reports = await Report.find({postReportedId: {$exists: true} })
            .populate({
                path: 'postReportedId',
                select: ['userId', 'content', 'multimedia'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            })
        }
        if(type === "comment") {
            reports = await Report.find({commentReportedId: {$exists: true}})
            .populate({
                path: 'commentReportedId',
                select: ['userId', 'content'],
                populate: {
                    path: 'userId',
                    select: ['firstname', 'lastname']
                }
            })
        }
        if(type === "user") {
            reports = await Report.find({userReportedId: {$exists: true}})
            .populate({
                path: 'userReportedId',
                select: ['firstname', 'lastname', 'biography', 'profilePicture', 'username'],
            })
        }

        return res.json(reports);
    } catch(err) { 
        return res.status(400).json({errMsg: err});
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

        const user = await User.findById(`${report.userReportedId}`);
        if (!user || `${user._id}` === `${admin._id}`) return res.status(404).json('Not posible to proceed');

        // FALTA ELIMINAR TODO LO RELACIONADO AL USER
        user.isDeleted = true;
        await user.save();
        
        return res.json('Reported successfully');
    }catch(err){
        return res.status(400).json('Something went wrong');
    }
});

export default router;
