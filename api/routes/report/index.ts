import express, { Response, Request } from 'express';
import passport from 'passport';
import { Report, User, Comment, Post, Review, Message, Chat } from '../../mongoose';

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


router.get('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
    try{
        const { type } = req.query;
        const { userId } = req.params
        
        const admin = await User.findById(`${userId}`);
        if(!admin || !admin.isAdmin) return res.status(401).json('Missings permissions');

        let reports: any[] = [];

        if(!type) {
            reports = await Report.find({})
            .sort({createdAt: -1})
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
            .sort({createdAt: -1})
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
            .sort({createdAt: -1})
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
            .sort({createdAt: -1})
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

        if (!type) return res.status(400).json('Please send type of report');

        const admin = await User.findById(`${userId}`);
        if(!admin || !admin.isAdmin) return res.status(401).json('Missings permissions');
        
        const report = await Report.findById(`${reportId}`);
        
        if(!report) return res.status(404).json('Report not found');
        
        if (type === 'post') {
            const post = await Post.findById(`${report.postReportedId}`);
            if (!post) return res.status(404).json('Post not found');
            
            const user = await User.findById(`${post.userId}`);
            if (!user) return res.status(404).json('User not found');
            
            const newUser = await User.findOneAndUpdate({_id: user._id}, {$pull: {posts: `${post._id}`}}, {new: true});
            if (!newUser) return res.status(400).json('Not posible to delete');
            await newUser.save();
            
            const commentId = post.commentsId;
            await Comment.deleteMany({_id: {$in: commentId}});
            await Report.deleteMany({postReportedId: {_id: post._id}})
            await post.remove();
            
            return res.json('Post reported successfully');
        }
        if (type === 'comment') {
            const comment = await Comment.findById(`${report.commentReportedId}`);
            if (!comment) return res.status(404).json('Comment not found');

            const post = await Post.findById(comment.postId);
            if (!post) return res.status(404).json('Post not found');

            const newPost = await Post.findOneAndUpdate({_id: post._id}, {$pull: {commentsId: comment._id}}, {new: true});
            if (!newPost) return res.status(400).json('Not posible to delete');
            await newPost.save();
            await Report.deleteMany({postReportedId: {_id: comment._id}})
            await comment.remove();

            return res.json('Comment reported successfully');
        }

        let user = await User.findOneAndUpdate({_id: `${report.userReportedId}`}, {
          $set: {
            posts: [],
            following: [],
            followers: [],
            followRequest: [],
            chats: []
          }
        }, { new: true });
        if (!user) return res.status(404).json('Not posible to proceed');
    
        const posts = await Post.find({userId: user._id});
        for (let i = 0; i < posts.length; i ++) {
          await Comment.deleteMany({_id: {$in: posts[i].commentsId}});
        }
        await Post.deleteMany({ userId: user._id });
        await Post.updateMany({}, {
          $pull: {
            likes: `${user._id}`,
            dislikes: `${user._id}`,
          }
        });
        await User.updateMany({}, {
          $pull: {
            following: `${user._id}`,
            followers: `${user._id}`,
            followRequest: `${user._id}`}
        });
        await Review.deleteOne({ userId: user._id });
    
        user.profilePicture = 'https://recursoshumanostdf.ar/download/multimedia.normal.83e40515d7743bdf.6572726f725f6e6f726d616c2e706e67.png';
        user.username = "Banned user";
        user.isDeleted = true;
        user.isAdmin = false;
        user.isPremium = false;
        user.isPrivate = false;
        user.birthday = undefined;
        user.biography = undefined;
        user.review = undefined;
        user.plan = undefined;
        user.expirationDate = undefined;
    
        await user.save();
        await Report.deleteMany({userReportedId: {_id: user._id}})
        
        return res.json('User banned successfully');
    }catch(err){
        return res.status(400).json('Something went wrong');
    }
});

export default router;
