import { IUser, IPost } from './../../types/index';
import express, {Request,Response} from 'express';
import passport from 'passport';
import { Comment, Post, Report, User } from '../../mongoose';

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
        //.populate('dislikes', 'username')
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
    try{
        const {userId, postId} = req.params
        let post = await Post.findById(`${postId}`)
        //if no post founded or the post was made by other user sends error
        if(!post){
            return res.status(400).json('Post not found')
        }
        if(`${post.userId}` !== userId){
            return res.status(400).json('Delete only your own posts')
        }
        let user = await User.findById(`${userId}`)
        //If no user found send an error
        if(!user){
            return res.status(400).json('Wtf who did this post????')
        }
        //Delete the post from the posts of the User
        await user.updateOne({$pull: {posts: postId}})
        await user.save()
        
        //Delete comments done at this post
        let comments = post.commentsId
        await Comment.deleteMany({_id: {$in: comments}})

        //Delete reports of the post
        await Report.deleteMany({postReportedId: {_id: postId} })

        //Delete report of the posts comments

        //Remove post and send response
        await post.remove();
        
        res.json('Eliminated from the world')
    }catch(err){
        res.status(400).json('something went wrong')
    }
});

router.get("/likes/:postId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
     async(req:Request, res: Response )=>{
         try {
             let postId = req.params.postId;
 
             let post = await Post.findById(postId)
                        .populate("likes",['username','profilePicture']);
             if(!post){return res.status(404).json("not post")};
             
             res.status(200).json(post.likes);
         } catch (err) {
            res.json(err);
         }
    });

    router.get("/dislikes/:postId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
    async(req:Request, res: Response )=>{
        try {
            let postId = req.params.postId;

            let post = await Post.findById(postId)
                       .populate("dislikes",['username','profilePicture']);
            if(!post){return res.status(404).json("not post")};
            
            res.status(200).json(post.dislikes);
        } catch (err) {
           res.json(err);
        }
   });

router.put("/dislike/:postId/:userId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
async (req:Request, res:Response) => {
   try {
    let postId = req.params.postId;
    let userId = req.params.userId;
    let action = req.query.action;
    
    let user:IUser | null = await User.findById(`${userId}`);

    if(!user) {
        return res.status(400).json("algo salio mal");
    }

    let post: IPost | null = await Post.findById(`${postId}`);
     
    if(!post) {
        return res.status(400).json("algo salio mal");
    }
        
    if(post.likes.includes(user._id)){
       await Post.updateOne({_id: postId}, {
           $pull: {
              likes: user._id,
           },
       });
     }

     if( action === "add" ){
          post = await Post.findOneAndUpdate({_id: postId}, {
            $addToSet:{
                   dislikes: user._id
                 }
              },{new: true});
        }else{
            post = await Post.findOneAndUpdate({_id: postId}, {
                $pull:{
                    dislikes: user._id 
                    }
                },{new: true});
        }

     if(!post){return res.status(400).json("not found dislikes")} 

    res.status(200).json(post);
   } catch (err) {
     return res.status(400).json(err);
   }
});


router.put("/like/:postId/:userId",passport.authenticate("jwt",{session: false, failureRedirect: '/auth/loginjwt'}),
async (req:Request, res:Response) => {
   try {
    let postId = req.params.postId;
    let userId = req.params.userId;
    let action = req.query.action;
    
    let user:IUser | null = await User.findById(`${userId}`);

    if(!user) {
        return res.status(400).json("algo salio mal");
    }

    let post: any = await Post.findById(`${postId}`);
     
    if(!post) {
        return res.status(400).json("algo salio mal");
    }

    if(post.dislikes.includes(user._id)){
        console.log("entre mal")
       await Post.updateOne({_id: postId}, {
           $pull: {
              dislikes: user._id ,
           },
       });
     }

     if( action === "add" ){
        post = await Post.findOneAndUpdate({_id: postId},{
            $addToSet:{
                likes: user._id
            }
        },{new: true})
       }else{
           post = await Post.findOneAndUpdate({_id: postId}, {
                $pull: {
                    likes: user._id
                },
             },{new: true});
        }
     
       return res.status(200).json(post);
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
