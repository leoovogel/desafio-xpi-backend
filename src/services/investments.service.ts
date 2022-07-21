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

// TODO REFACTOR: find a way to make fewer queries in the database.
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

  const [assetHistory, assetPortfolio] = await prisma.$transaction([
    prisma.investments_history.create({
      data: {
        account_id: clientAccount.id,
        asset_id: asset.id,
        investment_type: 'BUY',
        price: asset.price,
        quantity: assetQuantity,
      },
    }),

    // TODO on update, create function to update average_price
    prisma.portfolio.upsert({
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
    }),
  ]);

  return {
    symbol: assetPortfolio.symbol,
    quantity: assetHistory.quantity,
    unitPrice: assetHistory.price,
    totalPrice: +assetHistory.price * assetHistory.quantity,
  };
}

export async function sellInvestment(client: IClient, { assetId, assetQuantity }: IInvestmentBuyRequest) {
  const clientAccount = await prisma.account.findUnique({
    where: { client_id: client.id },
    include: { portfolio: true },
  });

  if (!clientAccount) throw new HttpException('Client not found', StatusCodes.NOT_FOUND);

  const assetToSell = clientAccount.portfolio.find((portfolio) => portfolio.asset_id === assetId);

  if (!assetToSell) throw new HttpException('Asset not found', StatusCodes.NOT_FOUND);

  const result = await prisma.$transaction(async (prismaTransaction) => {
    const assetPortfolio = await prismaTransaction.portfolio.update({
      where: {
        account_id_asset_id: {
          account_id: clientAccount.id,
          asset_id: assetId,
        },
      },
      data: {
        quantity: { decrement: assetQuantity },
      },
    });

    if (assetPortfolio.quantity < 0) throw new HttpException('Not enough assets to sell', StatusCodes.BAD_REQUEST);

    if (assetPortfolio.quantity === 0) {
      await prismaTransaction.portfolio.delete({
        where: {
          account_id_asset_id: { account_id: clientAccount.id, asset_id: assetId },
        },
      });
    }

    const asset = await prismaTransaction.asset.findUniqueOrThrow({
      where: { id: assetId },
    });

    // TODO REFACTOR: change the way to search the asset price.
    const assetHistory = await prismaTransaction.investments_history.create({
      data: {
        account_id: clientAccount.id,
        asset_id: assetId,
        investment_type: 'SELL',
        price: asset.price,
        quantity: assetQuantity,
      },
    });

    return {
      symbol: assetPortfolio.symbol,
      quantity: assetHistory.quantity,
      unitPrice: assetHistory.price,
      totalPrice: +assetHistory.price * assetHistory.quantity,
    };
  });

  return result;
}
