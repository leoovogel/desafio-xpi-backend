/* eslint-disable max-lines-per-function */
import { Account, Portfolio } from '@prisma/client';
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

const findAccount = async (clientId: string, options = {}) => {
  const clientAccount = await prisma.account.findUnique({
    where: { client_id: clientId },
    ...options,
  });

  if (!clientAccount) {
    throw new HttpException('Client not found', StatusCodes.NOT_FOUND);
  }

  return clientAccount;
};

const findAsset = async (assetId: number) => {
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    throw new HttpException('Asset not found', StatusCodes.NOT_FOUND);
  }

  return asset;
};

export async function buyInvestment(client: IClient, { assetId, assetQuantity }: IInvestmentBuyRequest) {
  const clientAccount = await findAccount(client.id);
  const asset = await findAsset(assetId);

  if (assetQuantity > asset.available_quantity) {
    throw new HttpException('assetQuantity greater than the available quantity', StatusCodes.BAD_REQUEST);
  }

  const result = await prisma.$transaction(async (prismaTransaction) => {
    const updatedAccountBalance = await prismaTransaction.account.update({
      where: { id: clientAccount.id },
      data: {
        available_balance: Number(clientAccount.available_balance) - assetQuantity * Number(asset.price),
      },
    });

    if (Number(updatedAccountBalance.available_balance) < 0) throw new HttpException('Insufficient funds', StatusCodes.BAD_REQUEST);

    await prismaTransaction.investments_history.create({
      data: {
        account_id: clientAccount.id,
        asset_id: asset.id,
        investment_type: 'BUY',
        price: Number(asset.price),
        quantity: assetQuantity,
      },
    });

    const assetPortfolio = await prismaTransaction.portfolio.upsert({
      where: {
        account_id_asset_id: {
          account_id: clientAccount.id,
          asset_id: asset.id,
        },
      },
      update: {
        quantity: { increment: assetQuantity },
        acquisition_value: { increment: assetQuantity * Number(asset.price) },
      },
      create: {
        account_id: clientAccount.id,
        asset_id: asset.id,
        quantity: assetQuantity,
        symbol: asset.symbol,
        acquisition_value: assetQuantity * Number(asset.price),
        average_purchase_price: Number(asset.price),
        current_value: assetQuantity * Number(asset.price),
      },
    });

    return {
      symbol: assetPortfolio.symbol,
      quantity: assetQuantity,
      unitPrice: Number(asset.price),
      totalPrice: Number(asset.price) * assetQuantity,
    };
  });

  return result;
}

export async function sellInvestment(client: IClient, { assetId, assetQuantity }: IInvestmentBuyRequest) {
  const clientAccount = await findAccount(client.id, { include: { portfolio: true } }) as (Account & { portfolio: Portfolio[]; });
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
        //! Incorrect calculation of new acquisition value
        // TODO fix this - use the investment history to calculate the new acquisition value
        acquisition_value: { decrement: assetQuantity * Number(assetToSell.average_purchase_price) },
      },
    });

    if (assetPortfolio.quantity < 0) throw new HttpException('Not enough assets to sell', StatusCodes.BAD_REQUEST);

    if (assetPortfolio.quantity === 0) {
      await prismaTransaction.portfolio.delete({
        where: { account_id_asset_id: { account_id: clientAccount.id, asset_id: assetId } },
      });
    }

    const asset = await findAsset(assetId);

    await prismaTransaction.account.update({
      where: { id: clientAccount.id },
      data: { available_balance: { increment: assetQuantity * Number(asset.price) } },
    });

    await prismaTransaction.account.update({
      where: { id: clientAccount.id },
      data: { available_balance: { increment: assetQuantity * Number(asset.price) } },
    });

    await prismaTransaction.investments_history.create({
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
      quantity: assetQuantity,
      unitPrice: Number(asset.price),
      totalPrice: Number(asset.price) * assetQuantity,
    };
  });

  return result;
}

export async function updateInvestmentsValue(client: IClient) {
  const clientAccount = await findAccount(client.id, { include: { portfolio: true } }) as (Account & { portfolio: Portfolio[]; });

  await Promise.all(clientAccount.portfolio
    .map(async (portfolio) => {
      const asset = await findAsset(portfolio.asset_id);

      const newCurrentValue = Number(asset.price) * Number(portfolio.quantity);
      const acquisitionValue = Number(portfolio.acquisition_value);

      const updatedPortfolio = await prisma.portfolio.update({
        where: {
          account_id_asset_id: {
            account_id: clientAccount.id,
            asset_id: portfolio.asset_id,
          },
        },
        data: {
          current_value: newCurrentValue,
          profitability_percentage: (newCurrentValue / acquisitionValue - 1) * 100,
          profitability_value: newCurrentValue - acquisitionValue,
        },
      });

      return updatedPortfolio;
    }));
}
