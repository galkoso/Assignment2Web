import { User } from "./user.model";
import bcrypt from "bcrypt";

export const logInIfUser = async ( username: string, loggedPassword: string): Promise<string | null> => {
    const user = await User.findOne({ username }).exec();
    if (!user) return null;

    const isPasswordMatch = await bcrypt.compare(loggedPassword, user.password);
    if (!isPasswordMatch) return null;

    return user._id.toString();
};
