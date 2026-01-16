import mongoose from 'mongoose';

export const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/assignment1web';

type ConnectDbDeps = {
  uri?: string;
  mongooseConnect?: (uri: string) => Promise<unknown>;
  log?: (...args: unknown[]) => void;
  errorLog?: (...args: unknown[]) => void;
  exit?: (code: number) => never;
};

export const connectDB = async (deps: ConnectDbDeps = {}): Promise<void> => {
  const {
    uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI,
    mongooseConnect = mongoose.connect.bind(mongoose),
    log = console.log,
    errorLog = console.error,
    exit = process.exit,
  } = deps;

  try {
    await mongooseConnect(uri);
    log(`MongoDB Connected`);
  } catch (error) {
    errorLog('MongoDB connection error:', error);
    exit(1);
  }
};

export default connectDB;

