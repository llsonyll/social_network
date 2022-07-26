import { Schema } from 'mongoose'
import { IComments } from '../../types'

export let commentsSchema = new Schema<IComments>({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true},
	postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	content: { type: String, required: true },
	likes: [{ type: Schema.Types.ObjectId , ref: "User" }],
	dislikes: [{type: Schema.Types.ObjectId, ref: "User" }],
}, {
	timestamps: {
		createdAt: true,
		updatedAt: false
	},
	versionKey: false
})
