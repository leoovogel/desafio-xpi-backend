import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as investmentService from '../services/investments.service';

export const buy = async (req: Request, res: Response) => {
  const { client } = res.locals;
  const result = await investmentService.buyInvestment(client, req.body);
  return res.status(StatusCodes.OK).json({ result });
};

export const sell = async (req: Request, res: Response) => {
  const { client } = res.locals;
  const result = await investmentService.sellInvestment(client, req.body);
  return res.status(StatusCodes.OK).json({ result });
};
