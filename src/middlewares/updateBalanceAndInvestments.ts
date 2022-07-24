import { NextFunction, Request, Response } from 'express';
import { updateBalanceValue } from '../services/accounts.service';
import { updateInvestmentsValue } from '../services/investments.service';

export default async (_req: Request, res: Response, next: NextFunction) => {
  await updateInvestmentsValue(res.locals.client);
  await updateBalanceValue(res.locals.client);

  return next();
};
