import mongoose from 'mongoose';

export const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/assignment1web';

export const connectDB = async (uri: string = process.env.MONGODB_URI || DEFAULT_MONGODB_URI): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};

export default connectDB;
