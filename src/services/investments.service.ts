import { StatusCodes } from 'http-status-codes';
import { prisma } from '../database/prismaClient';
import HttpException from '../utils/httpException';

interface IClient {
  id: string;
  name: string;
  email: string;
}

interface IInvestmentBuyRequest {
  assetId: number;
  assetQuantity: number;
}

export async function buyInvestment(client: IClient, { assetId, assetQuantity }: IInvestmentBuyRequest) {
  const clientAccount = await prisma.account.findUnique({
    where: { client_id: client.id },
  });

  if (!clientAccount) throw new HttpException('Client not found', StatusCodes.NOT_FOUND);

  const asset = await prisma.asset.findUnique({ where: { id: assetId } });

  if (!asset) throw new HttpException('Asset not found', StatusCodes.NOT_FOUND);
  if (assetQuantity > asset.available_quantity) {
    throw new HttpException('assetQuantity greater than the available quantity', StatusCodes.BAD_REQUEST);
  }

  await prisma.investments_history.create({
    data: {
      account_id: clientAccount.id,
      asset_id: asset.id,
      investment_type: 'BUY',
      price: asset.price,
      quantity: assetQuantity,
    },
  });

  // TODO on update, create function to update average_price and available_quantity
  await prisma.portfolio.upsert({
    where: {
      account_id_asset_id: {
        account_id: clientAccount.id,
        asset_id: asset.id,
      },
    },
    update: {
      quantity: {
        increment: assetQuantity,
      },
    },
    create: {
      account_id: clientAccount.id,
      asset_id: asset.id,
      quantity: assetQuantity,
      symbol: asset.symbol,
      average_price: asset.price,
    },
  });
}
