import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from './auth.types';

const JWT_ACCESS_EXPIRES_IN = '10m';
const JWT_ACCESS_SECRET = 'dan-gal-acc';
const JWT_REFRESH_SECRET = 'dan-gal-ref';
const JWT_REFRESH_EXPIRES_IN = '7d';

export const signAccessToken  = (payload: JwtPayload): string =>
    jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]});

export const verifyAccessToken = (token: string): JwtPayload =>
    jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;

export const signRefreshToken = (payload: JwtPayload): string =>
    jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    });
  
  export const verifyRefreshToken = (token: string): JwtPayload =>
    jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  