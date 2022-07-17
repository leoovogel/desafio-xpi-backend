import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import joiDTO from '../utils/joiValidations';

type urlOptions = 'investments/buy';

export default (req: Request, _res: Response, next: NextFunction) => {
  const urlToValidate = req.originalUrl.slice(1) as urlOptions;
  const schema = joiDTO[urlToValidate];

  if (req.method === 'GET' || !schema) return next();

  const { error } = schema.validate(req.body);

  if (!error) return next();

  return next({ status: StatusCodes.UNPROCESSABLE_ENTITY, message: error.message });
};
