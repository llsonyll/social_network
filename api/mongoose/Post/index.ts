import { Schema } from 'mongoose'
import { IPost } from '../../types'

export let postSchema = new Schema<IPost>({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
		auto: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	commentsId: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	dislikes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	content: {type: String},
	multimedia: String
}, {
	timestamps: {
		createdAt: true,
		updatedAt: false
	},
	versionKey: false
}
)
