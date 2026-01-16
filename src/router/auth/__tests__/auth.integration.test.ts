import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createAuthRouter } from '../auth.router';
import { signRefreshToken } from '../auth.utils';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('Auth Router Integration Tests - GET /auth/refresh', () => {
  let app: Express;

  beforeAll(async () => {
    await connectTestDb();
    app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      req.cookies = {};
      const cookieHeader = req.headers.cookie;
      if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
          const [name, value] = cookie.trim().split('=');
          if (name && value) {
            req.cookies[name] = decodeURIComponent(value);
          }
        });
      }
      next();
    });
    
    const authRouter = createAuthRouter();
    const wrapAsync = (fn: express.RequestHandler) => {
      return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
      };
    };
    
    authRouter.stack.forEach((layer: any) => {
      if (layer.route && layer.route.path === '/refresh') {
        const originalHandler = layer.route.stack[0].handle;
        layer.route.stack[0].handle = wrapAsync(originalHandler);
      }
    });
    
    app.use('/auth', authRouter);
    
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Internal server error';
      res.status(statusCode).json({ error: message });
    });
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it('should refresh access token successfully with valid refresh token', async () => {
    const refreshToken = signRefreshToken({ username: 'testuser' });

    const response = await request(app)
      .get('/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
    expect(response.body.accessToken.length).toBeGreaterThan(0);
  }, 10000);

  it('should return 401 when refresh token is missing', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .expect(StatusCodes.UNAUTHORIZED);

    expect(response.body).toHaveProperty('error', 'Missing refresh token');
  }, 10000);

  it('should return error when refresh token is invalid', async () => {
    const invalidToken = 'invalid-refresh-token';

    const response = await request(app)
      .get('/auth/refresh')
      .set('Cookie', `refreshToken=${invalidToken}`)
      .expect(StatusCodes.UNAUTHORIZED);

    expect(response.body).toHaveProperty('error', 'Invalid or expired refresh token');
  }, 10000);

  it('should return error when refresh token is expired', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Cookie', `refreshToken=expired-token`)
      .expect(StatusCodes.UNAUTHORIZED);

    expect(response.body).toHaveProperty('error', 'Invalid or expired refresh token');
  }, 10000);
});
