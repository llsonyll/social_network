import express, { request, Request, Response } from "express";
import { Comment, Post, User } from "../../mongoose";
import passport from 'passport'

const router = express.Router();

router.post('/post/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { content } = req.body;
    
    const user = await User.findById(`${userId}`)

    if (!user || !content) return res.status(404).json({msg: 'idk'})


    try {
        const newPost = new Post({
            content,
            userId: user._id
        });

        await newPost.save();

        return res.status(201).json({msg: 'Post created successfully'});
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post('/comment/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { content, postId } = req.body;

    const user = await User.findById(`${userId}`);
    const post = await Post.findById(`${postId}`);

    if (!user || !post || !content) return res.status(404).json({msg: 'idk'})
    

    try {
        const newComment = new Comment({
            content,
            userId: user._id,
            postId: post._id
        });

        await newComment.save();

        return res.status(201).json({msg: 'Comment created successfully'});
    } catch (error) {
        return res.status(400).json(error)
    }
});


router.get('/home/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {

    const {userId} = req.params
    let page = parseInt(`${req.query.page}`)

    if(!page) page = 0


    try{

        const user = await User.findById(`${userId}`)
        if(!user) return res.status(404).json({errorMsg: 'who are you?'})
        
        if(user.following.length === 0) {
            const posts = await Post.find({}).skip(page * 20).limit(20)
            res.json(posts)
        }
        //  else {

            //si el usuario sigue a otros usuarios
        
        // }

    } catch(err) {
        return res.status(404).json({errorMsg: err})
    }
})


export default router;