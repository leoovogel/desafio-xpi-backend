import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/token';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization: token } = req.headers;

  if (!token) return next({ status: StatusCodes.UNAUTHORIZED, message: 'Token not found' });

  const [, tokenData] = token.split(' ');

  try {
    const client = verifyToken(tokenData);
    res.locals.client = client;
  } catch (error) {
    return next({ status: StatusCodes.UNAUTHORIZED, message: 'Invalid token' });
  }

  return next();
};
