import type { JwtPayload as JwtPayloadBase } from 'jsonwebtoken';

export interface JwtPayload extends JwtPayloadBase{
    username: string;
};
