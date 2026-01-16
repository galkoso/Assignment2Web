import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from './auth.utils';

export const authMiddleware = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

      return next({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Missing or invalid Authorization header',
      });
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (_err) {

      return next({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or expired token',
      });
    }
  };
};
