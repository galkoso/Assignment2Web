import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authMiddleware } from '../auth.middleware';
import { signAccessToken } from '../auth.utils';
import { jest } from '@jest/globals';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };

    mockNext = jest.fn();
  });

  it('should call next() when valid token is provided', () => {
    const token = signAccessToken({ username: 'testuser' });
    mockRequest.headers = { authorization: `Bearer ${token}` };

    const middleware = authMiddleware();
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user?.username).toBe('testuser');
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should call next() with error when Authorization header is missing', () => {
    mockRequest.headers = {};

    const middleware = authMiddleware();
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Missing or invalid Authorization header',
    });
  });

  it('should call next() with error when Authorization header does not start with Bearer', () => {
    mockRequest.headers = { authorization: 'Invalid token' };

    const middleware = authMiddleware();
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Missing or invalid Authorization header',
    });
  });

  it('should call next() with error when token is invalid', () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' };

    const middleware = authMiddleware();
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid or expired token',
    });
  });

  it('should call next() with error when token is expired', () => {
    mockRequest.headers = { authorization: 'Bearer expired-token' };

    const middleware = authMiddleware();
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid or expired token',
    });
  });
});
