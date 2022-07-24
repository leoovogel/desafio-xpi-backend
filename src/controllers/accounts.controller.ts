import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as accountService from '../services/accounts.service';

export const deposit = async (req: Request, res: Response) => {
  const { client } = res.locals;
  const { value } = req.body;
  const result = await accountService.accountDeposit(client, value);
  return res.status(StatusCodes.OK).json(result);
};

export const withdrawal = async (req: Request, res: Response) => {
  const { client } = res.locals;
  const { value } = req.body;
  const result = await accountService.accountWithdrawal(client, value);
  return res.status(StatusCodes.OK).json(result);
};

export const getBalance = async (_req: Request, res: Response) => {
  const { client } = res.locals;
  const result = await accountService.getAccountBalance(client);
  return res.status(StatusCodes.OK).json(result);
};

export const getAssets = async (_req: Request, res: Response) => {
  const { client } = res.locals;
  const result = await accountService.getAccountAssets(client);
  return res.status(StatusCodes.OK).json(result);
};

export const getTransactionsStatement = async (req: Request, res: Response) => {
  const { client } = res.locals;
  const { page, type } = req.query;

  const pageNumber = page ? Number(page) : 1;
  const transactionType = typeof type === 'string' ? type.toUpperCase() : 'ALL';

  const result = await accountService.getAccountTransactionsStatement(client, { pageNumber, transactionType });
  return res.status(StatusCodes.OK).json(result);
};
