import { Schema } from "mongoose";
import { INotification } from "../../types";


export let notificationSchema = new Schema<INotification>({
_id: {type:Schema.Types.ObjectId, required: true, auto: true},
from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
to: {type: Schema.Types.ObjectId, ref: 'User', required: true},
refId: {type:Schema.Types.ObjectId, required: true},
type: {type: String, enum: ['like', 'comment', 'follow', 'message'], required: true},
content: {type: String, required: true},
seen: {type: Boolean}
}, {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
})