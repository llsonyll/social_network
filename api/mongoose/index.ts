import mongoose, {Models} from "mongoose";

mongoose.connect(`${process.env.MONGO_URI}`) 