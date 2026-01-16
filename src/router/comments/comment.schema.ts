import { Schema, Types } from 'mongoose';

export interface IComment {
    userId: Types.ObjectId | string;
    postId: Types.ObjectId | string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const commentSchema = new Schema<IComment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);
