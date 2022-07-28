import passport from "passport";
import express, { Request, Response } from "express";
import { Comment, Post, User } from "../../mongoose";
import { IComments } from "../../types";

const router = express.Router();

router.put("/like/:commentId/:userId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
   try {
      let { userId , commentId } =  req.params;
      let comment: any = await Comment.findById(`${commentId}`);
       
      if(!comment){
        return res.status(400).json("comment does not exist")
      }
     
      let user = await User.findById(`${userId}`);
      
      if(!user){
        return  res.status(400).json("user does not exist")
      }

      if(comment.dislikes.includes(user._id)){
          await Comment.updateOne({_id: commentId},{
            $pull: {
                dislikes: user._id
            }
          });
      }
      
      if(!comment.likes.includes(user._id)){
         comment.likes.push(user._id);
         await comment.save();
      }else{
         comment = await Comment.findOneAndUpdate({_id: commentId },{
            $pull: {
                likes: user._id
            }
         },{new: true});
      }
     return res.status(200).json({likes : comment.likes, _id : comment._id});
   } catch (err) {
      return res.json(err);
   }
});

router.put("/dislike/:commentId/:userId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
   try {
      let { userId , commentId } =  req.params;
      let comment: any = await Comment.findById(`${commentId}`);
       
      if(!comment){
        return res.status(400).json("comment does not exist")
      }
     
      let user = await User.findById(`${userId}`);
      
      if(!user){
        return  res.status(400).json("user does not exist")
      }

      if(comment.likes.includes(user._id)){
          await Comment.updateOne({_id: commentId},{
            $pull: {
                likes: user._id
            }
          });
      }
      
      if(!comment.dislikes.includes(user._id)){
         comment.dislikes.push(user._id);
         await comment.save();
      }else{
         comment = await Comment.findOneAndUpdate({_id: commentId },{
            $pull: {
                dislikes: user._id
            }
         },{new: true});
      }

     return res.status(200).json({dislikes : comment.dislikes, _id : comment._id});
   } catch (err) {
      return res.json(err);
   }
});

router.post('/:userId/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId, postId } = req.params;
    const { content } = req.body;
    console.log('entree')
    
    try {
        const user = await User.findById(`${userId}`);
        let post = await Post.findById(`${postId}`)
        .populate('userId', ['username', 'profilePicture'])
        //.populate('likes', 'username')
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

        post = await post.populate({path: 'commentsId',select: ['content', 'likes'], populate:{path: 'userId', select: ['username', 'likes','profilePicture']}})

        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json(error)
    }
});

// router.put('/:userId/:postId/:commentId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
// async (req: Request, res: Response) => {
//    try {
//       const { userId, postId, commentId } = req.params;
//       const { content } = req.body;

//       if (!content) return res.status(400).json({msg: 'Must have content'});

//       const comment = await Comment.findById(`${commentId}`);
//       if (!comment) return res.status(404).json({msg: 'Comment doesn\'t exist'});
//       if (`${comment.userId}` !== userId) return res.status(404).json({msg: 'You can\'t edit other users comments'});
//       if (`${comment.postId}` !== postId) return res.status(404).json({msg: 'Comment doesn\'t belong to this post'});
      
//       comment.content = content;

//       await comment.save();
      

//       return res.status(201).json()
//    } catch (error) {
//       return res.status(400).json(error)
//    }
// })    FALTA VERIFICAR QUE FUNCIONE BIEN

export default router;
