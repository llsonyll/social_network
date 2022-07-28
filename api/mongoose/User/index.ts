import { Schema } from "mongoose";
import { IUser } from "../../types";


export let userSchema = new Schema<IUser>({
    _id: {type:Schema.Types.ObjectId, required:true, auto: true},
    username: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    firstname: {type:String, required:true},
    lastname: {type: String, required:true},
    password: {type:String, required:true},
    profilePicture: {type:String, required: true},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post', required:true}],
    following: [{type: Schema.Types.ObjectId, ref: 'User', required:true}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    isAdmin: {type:Boolean, default:false, required:true},
    isPremium: {type:Boolean, default:false, required:true},
    isPrivate: {type: Boolean, default:false, required:true},
    isConnected: Boolean,
    birthday: Date,
    biography: String,
    review: {type: Schema.Types.ObjectId, ref: 'Review'},
    socketId: String,
    chats: [{type: Schema.Types.ObjectId, ref: 'Chat', required: true}],
    paymentsId: [{type: String, ref: 'Payment'}],
    plan: {type: String, enum: ['weekly', 'monthly', 'yearly']},
    expirationDate: Date
}, {
	versionKey: false
})
