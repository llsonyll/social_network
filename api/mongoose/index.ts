import mongoose, {model} from "mongoose";
import { IComments, IPost, IReview, IUser } from "../types";
import { commentsSchema } from "./Comment";
import { postSchema } from "./Post";
import { reviewSchema } from "./Review";
import { userSchema } from "./User";

mongoose.connect(`${process.env.MONGO_URI}`) 



export let User = model<IUser>('User', userSchema)
export let Comment = model<IComments>('Comment', commentsSchema)
export let Post = model<IPost>('Post', postSchema)
export let Review = model<IReview>('Review', reviewSchema)

