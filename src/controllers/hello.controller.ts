import { Request, Response } from 'express';
import { prisma } from '../database/prismaClient';

export const index = async (req: Request, res: Response) => {
  const result = await prisma.client.findMany();
  return res.status(200).json({ result });
};
