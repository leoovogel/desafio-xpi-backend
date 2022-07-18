import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../database/prismaClient';

export const buy = async (req: Request, res: Response) => {
  const result = await prisma.client.findMany();
  return res.status(StatusCodes.OK).json({ result });
};
