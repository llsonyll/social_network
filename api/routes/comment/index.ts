import passport from "passport";
import express, { Request, Response } from "express";
import { Comment, Post, User } from "../../mongoose";

const router = express.Router();

router.post('/:userId/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId, postId } = req.params;
    const { content } = req.body;
    console.log('entree')
    
    try {
        const user = await User.findById(`${userId}`);
        let post = await Post.findById(`${postId}`)
        .populate('userId', 'username')
        .populate('likes', 'username')
        .populate('dislikes', 'username')
        
        if (!user || !post || !content) return res.status(404).json({msg: 'idk'})

        const newComment = new Comment({
            content,
            userId: user._id,
            postId: post._id
        });

        await newComment.save();

        post.commentsId.push(newComment._id);

        await post.save();

        post = await post.populate({path: 'commentsId',select: ['content', 'likes'], populate:{path: 'userId', select: ['username', 'likes']}})

        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json(error)
    }
});

export default router;
