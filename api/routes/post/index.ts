import { IUser, IPost } from './../../types/index';
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
        .populate({path: 'commentsId',select: ['content', 'likes'], populate:{path: 'userId', select: ['username', 'likes','profilePicture']}})
        //.populate('likes', 'username')
        .populate('dislikes', 'username')
        //Checks if post exists and if the post was made by the user
        if(!post){
            res.status(400).json("Post doesn't exist")
        }else if(`${post.userId}` !== userId){ // ALGO PASAAA
            console.log(`${post.userId}`)
            console.log(userId)
            res.status(400).json("Only modify your own posts")
        }else{
            //Change content and save
            post.content = content
            await post.save()

            post = await post.populate('userId', ['username', 'profilePicture'])
            
            res.status(200).json(post)
        }
    }catch(err){
        res.status(400).json('Something went wrong')
    }
});

router.get('/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req:Request, res:Response) =>{
    try{
        const {postId} = req.params
        //Search a post and select the data we want to send
        let post = await Post.findById(`${postId}`)
        .populate({path: 'commentsId',select: ['content', 'likes', 'dislikes'], populate:{path: 'userId', select: ['username', 'likes', 'dislikes','profilePicture']}})
        .populate('userId', ['username', 'profilePicture'])
        //.populate('likes', 'username')
        .populate('dislikes', 'username')
        //If no post found send error, else send the post
        if(!post){
            res.status(400).json("Post doesn't exist")
        }else{
            res.json(post)
            console.log(post)
        }
    }catch(err){
        res.status(400).json('Something went wrong')
    }
});

router.delete('/:userId/:postId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req:Request, res:Response) =>{
   /*  try{
        const {userId, postId} = req.params
        let post = await Post.findById(`${postId}`)
        //if no post founded or the post was made by other user sends error
        if(!post){
            return res.status(400).json('Post not found')
        }
        if(`${post.userId}` !== userId){
            return res.status(400).json('Delete only your own posts')
        }
        let user = await User.findByIdAndUpdate({`${userId}`}, {$pull: {posts: post._id}}).populate({
            path: 'posts',
            select: ['content', 'createdAt', 'likes', 'dislikes', '_id', 'commentsId', 'multimedia'],
            options: {sort: {'createdAt': -1 } },
            populate: { path: 'userId', select: ['username', 'profilePicture'] },
        }).select('-password')
        //If no user found send an error
        if(!user){
            return res.status(400).json('Wtf who did this post????')
        }
        //Delete the post from the posts of the User
         user = await User.findByIdAndUpdate( {} )
        await user.save() 
        
        //Delete comments done at this post
        let comments = post.commentsId
        await Comment.deleteMany({_id: {$in: comments}})
        //Remove post and send response
        await post.remove();
        
        res.json(user.posts)
    }catch(err){
        res.status(400).json('something went wrong')
    } */
});

router.put("/dislike/:postId/:userId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
async (req:Request, res:Response) => {
   try {
    let postId = req.params.postId;
    let userId =req.params.userId;
    
    let user:IUser | null = await User.findById(`${userId}`);

    if(!user) {
        return res.status(400).json("algo salio mal");
    }

    let post: IPost | null = await Post.findById(`${postId}`);
     
    if(!post) {
        return res.status(400).json("algo salio mal");
    }
    
    let id = user._id;

    let likes: IPost | null = await Post.findOne({ _id: postId ,"likes._id": id });

    if(likes){
       await Post.updateOne({_id: postId}, {
           $pull: {
              likes: { _id: id },
           },
       });
     }

     let dislikes: IPost | null = await Post.findOne({ _id: postId ,"dislikes._id": id }); 

     if( ! dislikes ){
          post = await Post.findOneAndUpdate({_id: postId}, {
            $push:{
                   dislikes: { _id: id, username: user.username }
                 }
              },{new: true});
        }else{
            console.log("entre");
            post = await Post.findOneAndUpdate({_id: postId}, {
                $pull:{
                    dislikes: { _id: id }
                    }
                },{new: true});
        }

     if(!post){return res.status(400).json("not found dislikes")} 

    res.status(200).json({ dislikes: post.dislikes, likes: post.likes });
   } catch (err) {
     return res.status(400).json(err);
   }
});

router.put("/like/:postId/:userId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
async (req:Request, res:Response) => {
   try {
    let postId = req.params.postId;
    let userId =req.params.userId;
    
    let user:IUser | null = await User.findById(`${userId}`);

    if(!user) {
        return res.status(400).json("algo salio mal");
    }

    let post: any = await Post.findById(`${postId}`);
     
    if(!post) {
        return res.status(400).json("algo salio mal");
    }
    
    let id = user._id;

    let dislikes: IPost | null = await Post.findOne({ _id: postId ,"dislikes._id": id }); 

    if(dislikes){
       await Post.updateOne({_id: postId}, {
           $pull: {
              dislikes: { _id: id },
           },
       });
     }

    let likes: IPost | null = await Post.findOne({ _id: postId ,"likes._id": id });

     if( !likes){
        post = await Post.findOneAndUpdate({_id: postId},{
            $push:{
                likes: { _id: id, username: user.username }
            }
        },{new: true})
       }else{
           post = await Post.findOneAndUpdate({_id: postId}, {
                $pull: {
                    likes: { _id: id },
                },
             },{new: true});
        }
     
       return res.status(200).json({likes: post.likes, dislikes: post.dislikes });
    } catch (err) {
     return res.status(400).json(err);
   }
});

router.post('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { content, multimedia } = req.body;
    
    try {
        const user = await User.findById(`${userId}`)
    
        if (!user) return res.status(404).json({msg: 'No user found'})
        if(!content && !multimedia) return res.status(404).json({msg: 'Please send something'})

        const newPost = new Post({
            content,
            multimedia,
            userId: user._id
        });

        await newPost.save();

        user.posts.push(newPost._id);

        await user.save();
        await newPost.populate('userId', ['username', 'profilePicture'])

        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(400).json(error);
    }
});


export default router
