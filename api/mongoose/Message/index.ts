import { Schema } from "mongoose";
import { IMessage } from "../../types";



export let messageSchema = new Schema<IMessage>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true},
    from: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    chatId: { type: Schema.Types.ObjectId, required: true, ref: 'Chat' },
    content: {type: String, required: true},
    seen: {type: Boolean, default: false}
})
