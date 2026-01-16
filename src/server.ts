import 'dotenv/config';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connectDB } from './config/database';
import postRouter from './router/posts/post.router';
import commentsRouter from './router/comments/comment.router';
import usersRouter from './router/users/user.router';
import { createAuthRouter } from './router/auth/auth.router';

export const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', postRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', createAuthRouter());

app.get('/health', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

type StartServerDeps = {
  connect?: () => Promise<void>;
  listen?: (port: number, cb: () => void) => unknown;
  port?: number;
  log?: (...args: unknown[]) => void;
  errorLog?: (...args: unknown[]) => void;
  exit?: (code: number) => never;
};

export const startServer = async (deps: StartServerDeps = {}): Promise<void> => {
  const {
    connect = connectDB,
    listen = app.listen.bind(app),
    port = PORT,
    log = console.log,
    errorLog = console.error,
    exit = process.exit,
  } = deps;

  try {
    await connect();
    listen(port, () => {
      log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    errorLog('Failed to start server:', error);
    exit(1);
  }
};

startServer();
