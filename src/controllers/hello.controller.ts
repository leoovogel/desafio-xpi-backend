import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const index = async (req: Request, res: Response) => {
  const result = await prisma.client.findMany();
  return res.status(200).json({ result });
};
