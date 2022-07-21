import express, {Request,Response} from 'express';
import passport from 'passport';
import { Comment, Post, User } from '../../mongoose';

const router = express.Router()

router.put('/:userId/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req:Request, res:Response) => {
    try{
        const {postId, userId} = req.params
        const {content} = req.body
        //Checks if body has content
        if(!content){
            return res.status(400).json('Necesita tener contenido')
        }
        let post = await Post.findById(`${postId}`)
        //Checks if post exists and if the post was made by the user
        if(!post){
            res.status(400).json("Post doesn't exist")
        }else if(`${post.userId}` !== userId){
            res.status(400).json("Only modify your own posts")
        }else{
            //Change content and save
            post.content = content
            await post.save()
            res.status(200).json('Comment modified')
        }
    }catch(err){
        res.status(400).json('Something went wrong')
    }
})

router.get('/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req:Request, res:Response) =>{
    try{
        const {postId} = req.params
        //Search a post and select the data we want to send
        let post = await Post.findById(`${postId}`)
        .populate({path: 'commentsId',select: 'content', populate:{path: 'userId', select: 'username'}})
        .populate('userId', 'username')
        .populate('likes', 'username')
        .populate('dislikes', 'username')
        //If no post found send error, else send the post
        if(!post){
            res.status(400).json("Post doesn't exist")
        }else{
            res.json(post)
        }
    }catch(err){
        res.status(400).json('Something went wrong')
    }
})

router.delete('/:userId/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req:Request, res:Response) =>{
    try{
        const {userId, postId} = req.params
        let post = await Post.findById(`${postId}`)
        if(!post){
            return res.status(400).json('Post not found')
        }
        if(`${post.userId}` !== userId){
            return res.status(400).json('Delete only your own posts')
        }
        let user = await User.findById(`${userId}`)
        if(!user){
            return res.status(400).json('Wtf who did this post????')
        }
        await user.updateOne({$pull: {posts: postId}})
        await user.save()

        let comments = post.commentsId
        await Comment.deleteMany({_id: {$in: comments}})
        post.remove()
        res.json('Eliminated from the world')
    }catch(err){
        res.status(400).json('something went wrong')
    }
})



export default router