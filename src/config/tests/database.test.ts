import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { connectDB, DEFAULT_MONGODB_URI } from '../database';

describe('connectDB (src/config/database.ts)', () => {
  const ORIGINAL_ENV = process.env.MONGODB_URI;

  afterEach(() => {
    process.env.MONGODB_URI = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  it('uses MONGODB_URI env var when provided', async () => {
    process.env.MONGODB_URI = 'mongodb://example:27017/testdb';

    const mongooseConnect = jest.fn<(uri: string) => Promise<unknown>>().mockResolvedValue(undefined);
    const log = jest.fn();

    await connectDB({ mongooseConnect, log });

    expect(mongooseConnect).toHaveBeenCalledWith('mongodb://example:27017/testdb');
    expect(log).toHaveBeenCalledWith('MongoDB Connected');
  });

  it('falls back to default URI when MONGODB_URI is not set', async () => {
    delete process.env.MONGODB_URI;

    const mongooseConnect = jest.fn<(uri: string) => Promise<unknown>>().mockResolvedValue(undefined);
    await connectDB({ mongooseConnect, log: jest.fn() });

    expect(mongooseConnect).toHaveBeenCalledWith(DEFAULT_MONGODB_URI);
  });

  it('logs error and exits when connection fails', async () => {
    const mongooseConnect = jest.fn<(uri: string) => Promise<unknown>>().mockRejectedValue(new Error('nope'));
    const errorLog = jest.fn();
    const exit = jest.fn(() => {
      throw new Error('exit');
    }) as unknown as (code: number) => never;

    await expect(connectDB({ mongooseConnect, errorLog, exit })).rejects.toThrow('exit');

    expect(errorLog).toHaveBeenCalledWith('MongoDB connection error:', expect.any(Error));
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('uses default deps parameter when called without arguments (line 13)', async () => {
    delete process.env.MONGODB_URI;
    
    const originalConnect = mongoose.connect;
    const mockConnect = jest.fn<(uri: string) => Promise<unknown>>().mockResolvedValue(undefined);
    (mongoose.connect as any) = mockConnect;

    await connectDB();

    expect(mockConnect).toHaveBeenCalledWith(DEFAULT_MONGODB_URI);

    mongoose.connect = originalConnect;
  });

  it('uses default mongooseConnect when not provided in deps (line 16)', async () => {
    delete process.env.MONGODB_URI;
    const log = jest.fn();
    
    const originalConnect = mongoose.connect.bind(mongoose);
    const mockConnect = jest.fn<(uri: string) => Promise<unknown>>().mockResolvedValue(undefined);
    (mongoose.connect as any) = mockConnect;

    await connectDB({ log });

    expect(mockConnect).toHaveBeenCalledWith(DEFAULT_MONGODB_URI);
    expect(log).toHaveBeenCalledWith('MongoDB Connected');

    mongoose.connect = originalConnect;
  });

  it('uses custom uri when provided in deps', async () => {
    const customUri = 'mongodb://custom:27017/db';
    const mongooseConnect = jest.fn<(uri: string) => Promise<unknown>>().mockResolvedValue(undefined);
    const log = jest.fn();

    await connectDB({ uri: customUri, mongooseConnect, log });

    expect(mongooseConnect).toHaveBeenCalledWith(customUri);
    expect(log).toHaveBeenCalledWith('MongoDB Connected');
  });
});

