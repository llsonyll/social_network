import express, {Request,Response} from 'express';
import passport from 'passport';
import { Post } from '../../mongoose';

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
        let post = await Post.findById(`${postId}`)
        .populate({path: 'commentsId',select: 'content', populate:{path: 'userId', select: ['username']}})
        .populate('userId', 'username')
        .populate('likes', 'username')
        .populate('dislikes', 'username')
        if(!post){
            res.status(400).json("Post doesn't exist")
        }else{
            res.json(post)
        }
    }catch(err){
        res.status(400).json('Something went wrong')
    }
})



export default router