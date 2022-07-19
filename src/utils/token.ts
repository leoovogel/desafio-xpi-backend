import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

const config: SignOptions = {
  expiresIn: '5h',
  algorithm: 'HS256',
};

const secret = process.env.JWT_SECRET as string;

export const generateToken = (payload: JwtPayload) => jwt.sign(payload, secret, config);
export const verifyToken = (token: string) => jwt.verify(token, secret);
