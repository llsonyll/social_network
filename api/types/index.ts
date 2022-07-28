import {TrigonometryExpressionOperator, Types} from "mongoose";

export interface IUser {
   _id: Types.ObjectId;
   username: string;
   email: string;
   firstname: string;
   lastname: string;
   password: string;
   profilePicture: string;
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
   socketId?: string;
   chats: Types.Array<Types.ObjectId>;
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

export interface IChat {
   _id: Types.ObjectId;
   users: Types.Array<Types.ObjectId>;
   messages: Types.Array<Types.ObjectId>
}

export interface IMessage {
   _id: Types.ObjectId;
   from: Types.ObjectId;
   chatId: Types.ObjectId;
   content: string;
}

export interface IReport {
   _id: Types.ObjectId;
   userId: Types.ObjectId;
   postReportedId?: Types.ObjectId;
   commentReportedId?: Types.ObjectId;
   userReportedId?: Types.ObjectId;
   reason: string;
}
