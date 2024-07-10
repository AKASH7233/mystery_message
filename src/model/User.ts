import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Schema{
    name: string;
}

const UserSchema:Schema<Message> = new Schema({
    name: String,
})

export const UserModel = new mongoose.Model('User', UserSchema)