import {TrigonometryExpressionOperator, Types} from "mongoose";

export interface IUser {
   _id: Types.ObjectId;
   username: string;
   email: string;
   firstname: string;
   lastname: string;
   password: string;
   profilePicture: string;
   coverPicture?: string;
   posts: Types.Array<Types.ObjectId>;
   following: Types.Array<Types.ObjectId>;
   followers: Types.Array<Types.ObjectId>;
   followRequest?: Types.Array<Types.ObjectId>;
   isAdmin: boolean;
   isPrivate: boolean;
   isPremium: boolean;
   birthday?: Date;
   isConnected?: boolean;
   biography?: string;
   review?: Types.ObjectId;
   socketId?: string;
   chats: Types.Array<Types.ObjectId>;
   paymentsId?: Types.Array<Types.ObjectId>;
   plan?: 'weekly' | 'monthly' | 'yearly';
   expirationDate?: Date;
   isDeleted: boolean;
}

export interface ILikesAndDislikes {
   _id: Types.ObjectId,
   username: string
}

export interface IPost{
   _id: Types.ObjectId;
   userId: Types.ObjectId;
   content?: string;
   commentsId: Types.Array<Types.ObjectId>;
   likes: Types.Array<Types.ObjectId>;
   dislikes: Types.Array<Types.ObjectId>;
   createdAt: Date;
   multimedia?: string;
}

export  interface IComments {
   _id: Types.ObjectId;
   postId: Types.ObjectId;
   userId: Types.ObjectId;
   content: string;
   createdAt: Date,
   likes: Types.Array<ILikesAndDislikes>,
   dislikes: Types.Array<ILikesAndDislikes>
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
   messages: Types.Array<Types.ObjectId>;
   updatedAt: Date
}

export interface IMessage {
   _id: Types.ObjectId;
   from: Types.ObjectId;
   chatId: Types.ObjectId;
   content: string;
   seen: boolean
}

export interface IReport {
   _id: Types.ObjectId;
   userId: Types.ObjectId;
   postReportedId?: Types.ObjectId;
   commentReportedId?: Types.ObjectId;
   userReportedId?: Types.ObjectId;
   reason: string;
}

export interface IPayment {
   _id: Types.ObjectId;
   paymentId: string;
   userId: Types.ObjectId;
   amount: number;
   plan: 'weekly' | 'monthly' | 'yearly';
   paymentDate: Date,
   paymentStatus?: string
}

export interface INotification {
   _id: Types.ObjectId;
   from: Types.ObjectId;
   to: Types.ObjectId;
   refId: Types.ObjectId;
   type: 'like' | 'comment' | 'follow' | 'message';
   content: string;
   createdAt: Date;
   seen: boolean;
}

export interface IToken{
   _id: Types.ObjectId;
   email: string;
   token: string;
}
