import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as assetService from '../services/assets.service';

export const getById = async (req: Request, res: Response) => {
  const { id: assetId } = req.params;
  const result = await assetService.getAssetById(assetId);
  return res.status(StatusCodes.OK).json(result);
};
