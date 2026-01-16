import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { signAccessToken } from '../router/auth/auth.utils';

let mongo: MongoMemoryServer | null = null;

export async function connectTestDb(): Promise<void> {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
}

export async function disconnectTestDb(): Promise<void> {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
}

export async function clearTestDb(): Promise<void> {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export function getAuthToken(username: string = 'testuser'): string {
  const token = signAccessToken({ username });
  return `Bearer ${token}`;
}
