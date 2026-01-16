import { Schema, Types } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  userId: Types.ObjectId | string;
  publishDate: Date;
}

export const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    publishDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  }
);

