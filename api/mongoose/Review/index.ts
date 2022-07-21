import { Schema } from "mongoose";
import { IReview} from "../../types";

export let reviewSchema = new Schema<IReview>({
    _id: {type: Schema.Types.ObjectId, required: true, auto: true},
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    description: {type: String, required: true},
    stars: {type: Number, required: true}
},{
	versionKey: false
})
