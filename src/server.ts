import 'dotenv/config';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connectDB, disconnectDB } from './config/database';
import postRouter from './router/posts/post.router';
import commentsRouter from './router/comments/comment.router';
import usersRouter from './router/users/user.router';
import { createAuthRouter } from './router/auth/auth.router';
import type { Server } from 'node:http';

export const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
let server: Server | undefined;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', postRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', createAuthRouter());

app.get('/health', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

export const startServer = async (): Promise<Server> => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  return server;
};

export const stopServer = async (): Promise<void> => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server!.close((err) => (err ? reject(err) : resolve()));
  });
  server = undefined;
  await disconnectDB();
};

const shutdown = async (code: number) => {
  try {
    await stopServer();
    process.exit(code);
  } catch {
    process.exit(1);
  }
};

process.on('SIGINT', () => void shutdown(0));
process.on('SIGTERM', () => void shutdown(0));

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

