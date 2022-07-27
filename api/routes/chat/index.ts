import express, {Request,Response} from 'express'
import { ObjectId, Types } from 'mongoose';
import passport from 'passport';
import { Chat, Message, User } from '../../mongoose';

const router = express.Router()


router.get('/:userId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async(req:Request, res:Response) => {
    try{
        const {userId} = req.params
        let user = await User.findById(userId)
        .select('chats')
        .populate({path:'chats', populate: {path: 'users', select:['username', 'profilePicture']}})

        if(!user){
            return res.status(400).json({errorMessage: 'No User Found'})
        }
        return res.json(user)

    }catch(err){
        res.status(400).json(err)
    }
})

router.get('/:userId/:chatUserId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async(req:Request, res:Response) => {
    try{
        const {userId, chatUserId} = req.params
        let chat;
        if(userId === chatUserId){
            chat = await Chat.findOne({users: [userId, chatUserId]}).populate('users', ['username', 'profilePicture']).populate('messages', ['content', 'from'])
        }else{
            chat = await Chat.findOne({users: {$all: [userId, chatUserId]}}).populate('users', ['username', 'profilePicture']).populate('messages', ['content', 'from'])
        }
        if(chat){
            return res.json(chat)
        }
        chat = new Chat({
            users: [userId, chatUserId]
        })

        if(userId === chatUserId){
            let user = await User.findById(userId)
            if(user){
                user.chats.push(chat._id)
                await user.save()
            }else{
                return res.status(400).json({errorMessage: 'Something went wrong'})
            }
        }else{
            let user1 = await User.findById(userId)
            let user2 = await User.findById(chatUserId)
            if(user1 && user2){
                user1.chats.push(chat._id)
                user2.chats.push(chat._id)
                await user1.save()
                await user2.save()
            }else{
                return res.status(400).json({errorMessage: 'Something went wrong'})
            }
        }

        await chat.save()


        return res.redirect(`/chat/${userId}/${chatUserId}`)

    }catch(err){
        res.status(400).json(err)
    }
})


router.post('/message/:userId/:chatId', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), async(req:Request, res:Response) =>{
    try{
        const {userId, chatId} = req.params
        const {content} = req.body


        if(!content){
           return res.status(400).json({errorMessage: 'Plesase send content'})
        }

        let chat = await Chat.findById(chatId)
        
        if(!chat){
            return res.status(400).json({errorMessage: 'Chat not found'})
        }

        let message = new Message({
            from: userId,
            chatId,
            content
        }) 

        await message.save()
        chat.messages.push(message._id)

        await chat.save()
        res.json(message)
    }catch(err){
        res.status(400).json(err)
    }
})

//62dedb98ec4e56b835a48601

//62dedbe19dcff657146231a5





export default router