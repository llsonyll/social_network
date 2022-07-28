import { Schema } from "mongoose";
import { IToken } from "../../types";


export let tokenSchema = new Schema<IToken>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true},
    email: {type: Schema.Types.String, unique: true ,required: true},
    token: {type: Schema.Types.String, required: true}
})
