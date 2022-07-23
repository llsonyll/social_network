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
        const post = await Post.findById(`${postId}`)
        .populate({path: 'commentsId',select: ['content', 'likes'], populate:{path: 'userId', select: ['username', 'likes']}})
        .populate('userId', 'username')
        .populate('likes', 'username')
        .populate('dislikes', 'username')
        
        if (!user) return res.status(404).json({msg: 'idk'})
        if (!post) return res.status(404).json({msg: 'post error'});
        if (!content) return res.status(404).json({msg: 'content error'})

        const newComment = new Comment({
            content,
            userId: user._id,
            postId: post._id
        });

        await newComment.save();

        post.commentsId.push(newComment._id);

        await post.save();

        console.log(post)

        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json(error)
    }
});

export default router;
