import { Schema } from "mongoose";
import { IReport } from "../../types";

export let reportSchema = new Schema<IReport>({
    _id: {type: Schema.Types.ObjectId, required: true, auto: true},
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    postReportedId: { type: Schema.Types.ObjectId, ref: 'Post'},
    commentReportedId: { type: Schema.Types.ObjectId, ref: 'Comment'},
    userReportedId: { type: Schema.Types.ObjectId, ref: 'User'},
    reason: {type: String, required: true},
},{
	versionKey: false
})
