import { Schema } from 'mongoose'
import { IPost } from '../../types'

export let postSchema = new Schema<IPost>({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
	},
	commentsId: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
	likes: [
		{
			types: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	dislikes: [
		{
			types: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})
