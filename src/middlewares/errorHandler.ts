import { NextFunction, Request, Response } from 'express';
import Exception from '../utils/httpException';

const errorMiddleware = (err: Exception, _req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = err;
  return res.status(status || 500).json({ message });
};

export default errorMiddleware;
