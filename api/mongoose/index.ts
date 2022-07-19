import mongoose, {model} from "mongoose";
import { IUser } from "../types";

mongoose.connect(`${process.env.MONGO_URI}`) 



// let User = model<IUser>('User', )

