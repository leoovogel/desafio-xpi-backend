import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as clientService from '../services/clients.service';

export const register = async (req: Request, res: Response) => {
  await clientService.registerClient(req.body);
  return res.status(StatusCodes.NO_CONTENT).end();
};

export const login = async (req: Request, res: Response) => {
  const token = await clientService.loginClient(req.body);
  return res.status(StatusCodes.OK).json({ token });
};
