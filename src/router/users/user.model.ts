import { model, Model } from 'mongoose';
import { userSchema, IUser } from './user.schema';

export const User: Model<IUser> = model<IUser>('User', userSchema);
