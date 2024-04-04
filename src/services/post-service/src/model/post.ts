import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    text: string,
    img: string,
    coments: boolean,
    likes: boolean
}

const PostSchema: Schema = new Schema({        
    text: { type: String, required: true },
    img: { type: String, required: true },
    coments: { type: String, required: true },
    likes: { type: String, required: true }
});

export default mongoose.model<IPost>('Post', PostSchema)