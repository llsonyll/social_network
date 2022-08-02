import { Types } from 'mongoose';
import { ILikesAndDislikes } from './../../types/index';
import { Schema } from 'mongoose';
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
		 new Schema<ILikesAndDislikes>({
			  _id: {type: Schema.Types.ObjectId, require:true, unique: true, ref: "User", },
				username: {type: String}
		 })
	],
	dislikes: [
		  new Schema<ILikesAndDislikes>({
				_id:{type: Schema.Types.ObjectId, required: true, unique: true, ref: "User", },
				username:{type: String}
			})
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
