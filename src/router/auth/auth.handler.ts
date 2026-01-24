import { Request, Response, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { signAccessToken, verifyRefreshToken } from './auth.utils';
import { JwtPayload } from './auth.types';

export const refreshAccessToken = (): RequestHandler => (request: Request, response: Response) => {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
        throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'Missing refresh token' };
    }

    try {
        const payload = verifyRefreshToken(refreshToken) as JwtPayload;
        const newAccessToken = signAccessToken({ username: payload.username });

        return response.status(StatusCodes.OK).json({ accessToken: newAccessToken });
    } catch (err) {
        throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid or expired refresh token' };
    }
};
