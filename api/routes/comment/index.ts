import passport from "passport";
import express, { Request, Response } from "express";
import { Comment, Post, Report, User } from "../../mongoose";
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

    let dislikes: IComments | null = await Comment.findOne({ _id: commentId ,"dislikes._id": user._id });

      if(dislikes){
          await Comment.updateOne({_id: commentId},{
            $pull: {
                dislikes: {_id: user._id}
            }
          });
      }
      
    let likes: IComments | null = await Comment.findOne({ _id: commentId ,"likes._id": user._id });
      
      if(!likes){
         comment = await Comment.findOneAndUpdate({_id: commentId },{
            $push: {
                likes: { _id: user._id, username: user.username }
            }
         },{new: true});
      }else{
         comment = await Comment.findOneAndUpdate({_id: commentId },{
            $pull: {
                likes: { _id: user._id}
            }
         },{new: true});
      }
     return res.status(200).json({likes : comment.likes, _id : comment._id, dislikes: comment.dislikes});
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

    let likes: IComments | null = await Comment.findOne({ _id: commentId ,"likes._id": user._id });

      if(likes){
          await Comment.updateOne({_id: commentId},{
            $pull: {
                likes: { _id: user._id}
            }
          });
      }

    let dislikes: IComments | null = await Comment.findOne({ _id: commentId ,"dislikes._id": user._id });
      
      if(!dislikes){
         comment = await Comment.findOneAndUpdate({_id: commentId },{
            $push: {
                dislikes: { _id: user._id, username: user.username }
            }
         },{new: true});
      }else{
         comment = await Comment.findOneAndUpdate({_id: commentId },{
            $pull: {
                dislikes: { _id: user._id }
            }
         },{new: true});
      }

     return res.status(200).json({dislikes : comment.dislikes, _id : comment._id, likes: comment.likes});
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

        post = await post.populate({path: 'commentsId',select: ['content', 'likes', "dislikes"], populate:{path: 'userId', select: ['username', 'likes','profilePicture']}})

        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.put('/:userId/:postId/:commentId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
   try {
      const { userId, postId, commentId } = req.params;
      const { content } = req.body;

      if (!content) return res.status(400).json({msg: 'Must have content'});

      const comment = await Comment.findById(`${commentId}`);
      if (!comment) return res.status(404).json({msg: 'Comment doesn\'t exist'});
      if (`${comment.userId}` !== userId) return res.status(404).json({msg: 'You can\'t edit other users comments'});
      if (`${comment.postId}` !== postId) return res.status(404).json({msg: 'Comment doesn\'t belong to this post'});
      
      comment.content = content;

      await comment.save()

      const post = await Post.findById(`${postId}`)
      .populate('userId', ['username', 'profilePicture'])
      .populate('dislikes', 'username')
      .populate({path: 'commentsId',select: ['content', 'likes', "dislikes"], populate:{path: 'userId', select: ['username', 'likes','profilePicture']}})

      return res.status(201).json(post)
   } catch (error) {
      return res.status(400).json(error)
   }
})

router.delete('/:userId/:postId/:commentId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}),
async (req: Request, res: Response) => {
   try {
      const { userId, postId, commentId } = req.params;

      const comment = await Comment.findById(`${commentId}`);
      if (!comment) return res.status(404).json({msg: 'Comment not found'});
      if (`${comment.userId}` !== userId) return res.status(400).json({msg: 'You can only delete your own comments'});
      if (`${comment.postId}` !== postId) return res.status(400).json({msg: 'Post not found'});

      const post = await Post.findOneAndUpdate({_id: comment.postId}, {
         $pull: {commentsId: comment._id}
      }, {new: true});

      await post?.save();
      
      await Comment.deleteOne({_id: comment._id});

      await Report.deleteMany({commentReportedId: {_id: comment._id}});

      const newPost = await Post.findById(comment.postId)
      .populate('userId', ['username', 'profilePicture'])
      .populate('dislikes', 'username')
      .populate({path: 'commentsId',select: ['content', 'likes', "dislikes"], populate:{path: 'userId', select: ['username', 'likes','profilePicture']}})

      if (newPost) return res.status(201).json(newPost);
   } catch (error) {
      return res.status(400).json(error)
   }
})

export default router;
