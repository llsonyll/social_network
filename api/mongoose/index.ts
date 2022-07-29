import mongoose, {model} from "mongoose";
import { IChat, IComments, IMessage, IPost, IReview, IUser, IPayment, IReport } from "../types";
import { chatSchema } from "./Chat";
import { commentsSchema } from "./Comment";
import { messageSchema } from "./Message";
import { postSchema } from "./Post";
import { reviewSchema } from "./Review";
import { tokenSchema } from "./token";
import { userSchema } from "./User";
import { reportSchema } from './Report';
import { paymentSchema } from './Payment';

mongoose.connect(`${process.env.MONGO_URI}`) 



export let User = model<IUser>('User', userSchema)
export let Comment = model<IComments>('Comment', commentsSchema)
export let Post = model<IPost>('Post', postSchema)
export let Review = model<IReview>('Review', reviewSchema)
export let Chat = model<IChat>('Chat', chatSchema)
export let Message = model<IMessage>('Message', messageSchema)
export let Token = model<IToken>('Token',tokenSchema)
export let Report = model<IReport>('Report', reportSchema)
export let Payment = model<IPayment>('Payment', paymentSchema)
