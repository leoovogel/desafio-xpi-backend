import { StatusCodes } from 'http-status-codes';
import { prisma } from '../database/prismaClient';
import HttpException from '../utils/httpException';

interface IClient {
  id: string;
  name: string;
  email: string;
}

export async function accountDeposit(client: IClient, value: number) {
  const clientAccount = await prisma.account.findUniqueOrThrow({
    where: { client_id: client.id },
  });

  await prisma.$transaction([
    prisma.account.update({
      where: { client_id: client.id },
      data: {
        available_balance: {
          increment: value,
        },
      },
    }),

    prisma.transaction_history.create({
      data: {
        account_id: clientAccount.id,
        transaction_type: 'DEPOSIT',
        value,
      },
    }),
  ]);

  return { message: 'Deposit successful' };
}

export async function accountWithdrawal(client: IClient, value: number) {
  const clientAccount = await prisma.account.findUniqueOrThrow({
    where: { client_id: client.id },
  });

  await prisma.$transaction(async (prismaTransaction) => {
    const result = await prismaTransaction.account.update({
      where: { client_id: client.id },
      data: {
        available_balance: {
          decrement: value,
        },
      },
    });

    if (Number(result.available_balance) < 0) {
      throw new HttpException('Insufficient funds', StatusCodes.BAD_REQUEST);
    }

    await prismaTransaction.transaction_history.create({
      data: {
        account_id: clientAccount.id,
        transaction_type: 'WITHDRAWAL',
        value,
      },
    });
  });

  return { message: 'Withdrawal successful' };
}

export async function getAccountBalance(client: IClient) {
  const clientAccount = await prisma.account.findUniqueOrThrow({
    where: { client_id: client.id },
  });

  return {
    availableBalance: clientAccount.available_balance,
    investmentsValue: clientAccount.investments_value,
    totalAssets: clientAccount.total_assets,
  };
}

export async function getAccountAssets(client: IClient) {
  const clientAccount = await prisma.account.findUniqueOrThrow({
    where: { client_id: client.id },
    include: { portfolio: true },
  });

  return clientAccount.portfolio;
}

export async function updateBalanceValue(client: IClient) {
  const clientAccount = await prisma.account.findUniqueOrThrow({
    where: { client_id: client.id },
    include: { portfolio: true },
  });

  const newInvestmentsValue = clientAccount.portfolio
    .reduce((acc, portfolio) => acc + Number(portfolio.current_value), 0);

  await prisma.account.update({
    where: { id: clientAccount.id },
    data: {
      investments_value: newInvestmentsValue,
      total_assets: newInvestmentsValue + Number(clientAccount.available_balance),
    },
  });
}
