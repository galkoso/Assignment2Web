import { Schema } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    displayName: { type: String, required: false, trim: true },
    bio: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

