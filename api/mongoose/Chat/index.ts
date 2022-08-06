import { Schema } from "mongoose";
import { IChat } from "../../types";


export let chatSchema = new Schema<IChat>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message', required: true}]
},{
	timestamps: {
		createdAt: false,
		updatedAt: true
	},
	versionKey: false
})
