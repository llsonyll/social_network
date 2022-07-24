import {TrigonometryExpressionOperator, Types} from "mongoose";

export interface IUser {
   _id: Types.ObjectId;
   username: string;
   email: string;
   firstname: string;
   lastname: string;
   password: string;
   posts: Types.Array<Types.ObjectId>;
   following: Types.Array<Types.ObjectId>;
   followers: Types.Array<Types.ObjectId>;
   isAdmin: boolean;
   isPrivate: boolean;
   isPremium: boolean;
   birthday?: Date;
   isConnected?: boolean;
   biography?: string;
   review?: Types.ObjectId;
}

// type content = {
   
// } 

export interface IPost{
   _id: Types.ObjectId;
   userId: Types.ObjectId;
   content: string;
   commentsId: Types.Array<Types.ObjectId>;
   likes: Types.Array<Types.ObjectId>;
   dislikes: Types.Array<Types.ObjectId>;
   createdAt: Date
}

export  interface IComments {
   _id: Types.ObjectId;
   postId: Types.ObjectId;
   userId: Types.ObjectId;
   content: string;
   createdAt: Date,
   likes: Types.Array<Types.ObjectId>,
   dislikes: Types.Array<Types.ObjectId>
}

export interface IReview {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  description: string;
  stars: number;    
}





