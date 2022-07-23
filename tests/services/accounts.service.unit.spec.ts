import { Decimal } from "@prisma/client/runtime";
import { prisma } from "../../src/database/prismaClient";
import {
  accountDeposit, accountWithdrawal, getAccountAssets, getAccountBalance
} from "../../src/services/accounts.service";
import { mockAccount, mockClient, mockFirstTransactionReturn, mockPortfolio } from "../mocks";

describe('Account service -> accountDeposit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throws an error if the client is not found by id', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockRejectedValueOnce(new Error('Client not found'));

    expect(async () => {
      await accountDeposit(mockClient, 100);
    }).rejects.toThrow('Client not found');
  });

  it('should return "Deposit successful if the transaction is registered', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccount);
    jest.spyOn(prisma, "$transaction").mockResolvedValueOnce(mockFirstTransactionReturn);

    const result = await accountDeposit(mockClient, 100);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    
    expect(result).toEqual({ message: 'Deposit successful' });
  });
});

describe('Account service -> accountWithdrawal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throws an error if the client is not found by id', () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockRejectedValueOnce(new Error('Client not found'));

    expect(async () => {
      await accountWithdrawal(mockClient, 100);
    }).rejects.toThrow('Client not found');
  });

  it('should return "Deposit successful if the transaction is registered', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccount);
    jest.spyOn(prisma, "$transaction").mockResolvedValueOnce(mockFirstTransactionReturn);

    const result = await accountWithdrawal(mockClient, 100);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    
    expect(result).toEqual({ message: 'Withdrawal successful' });
  });

  // TODO - HOW TO TEST THIS?
  // it('should throw an error if when making a withdrawal the balance is negative', async () => {
  //   jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccount);
  //   jest.spyOn(prisma, "$transaction").mockImplementation((prismaTransaction) => {
  //     jest.spyOn(prismaTransaction.transaction_history, "create").mockResolvedValueOnce({ available_balance: -5 })});

  //   const result = await accountWithdrawal(mockClient, 100);

  //   expect(result).not.toEqual({ message: 'Withdrawal successful' });
  // });
});

describe('Account service -> getAccountBalance', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the account balance', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccount);

    const result = await getAccountBalance(mockClient);

    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
    });

    expect(result).toEqual({
      availableBalance: 100,
      investmentsValue: 150,
      totalAssets: 200,
    });
  });

  it('should throws an error if the client account is not found by id', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockRejectedValueOnce(new Error('Client not found'));

    expect(async () => {
      await getAccountBalance(mockClient);
    }).rejects.toThrow('Client not found');
  });
});

describe('Account service -> getAccountAssets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the account portfolio', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce({ ...mockAccount, portfolio: mockPortfolio } as never);

    const result = await getAccountAssets(mockClient);

    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
      include: { portfolio: true },
    });

    expect(result).toEqual(mockPortfolio);
  });

  it('should throws an error if the client account is not found by id', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockRejectedValueOnce(new Error('Client not found'));

    expect(async () => {
      await getAccountAssets(mockClient);
    }).rejects.toThrow('Client not found');
  });
});