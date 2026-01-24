import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { refreshAccessToken } from '../auth.handler';
import { signRefreshToken } from '../auth.utils';

describe('Auth Routes - GET /auth/refresh - Refresh access token using refresh token', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      cookies: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };

    mockNext = jest.fn();
  });

  it('should refresh access token and return new token with 200 status', async () => {
    const refreshToken = signRefreshToken({ username: 'testuser' });
    mockRequest.cookies = { refreshToken };

    const handler = refreshAccessToken();
    await handler(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalled();
    const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0] as { accessToken: string };
    expect(jsonCall).toHaveProperty('accessToken');
    expect(typeof jsonCall.accessToken).toBe('string');
  });

  it('should throw UNAUTHORIZED error when refresh token is missing', () => {
    mockRequest.cookies = {};

    const handler = refreshAccessToken();

    expect(() =>
      handler(mockRequest as Request, mockResponse as Response, mockNext)
    ).toThrow(expect.objectContaining({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Missing refresh token',
    }));
  });

  it('should throw UNAUTHORIZED error when refresh token is invalid', () => {
    const refreshToken = 'invalid-refresh-token';
    mockRequest.cookies = { refreshToken };

    const handler = refreshAccessToken();

    expect(() =>
      handler(mockRequest as Request, mockResponse as Response, mockNext)
    ).toThrow(expect.objectContaining({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid or expired refresh token',
    }));
  });

  it('should throw UNAUTHORIZED error when refresh token is expired', () => {
    const refreshToken = 'expired-refresh-token';
    mockRequest.cookies = { refreshToken };

    const handler = refreshAccessToken();

    expect(() =>
      handler(mockRequest as Request, mockResponse as Response, mockNext)
    ).toThrow(expect.objectContaining({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid or expired refresh token',
    }));
  });
});
