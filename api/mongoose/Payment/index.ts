import { Schema } from "mongoose";
import { IPayment } from "../../types";


export let paymentSchema = new Schema<IPayment>({
    _id: {type:Schema.Types.ObjectId, required:true, auto: true},
    paymentId: { type: String, required: true },
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    plan: {type: String, enum: ['weekly', 'monthly', 'yearly'], required: true},
    paymentDate: {type: Date, require: true},
    paymentStatus: {type: String, required: true}
}, {
	versionKey: false
})
