import { Decimal } from "@prisma/client/runtime";
import { prisma } from "../../src/database/prismaClient";
import {
  accountDeposit, accountWithdrawal, getAccountAssets, getAccountBalance, getAccountInvestmentsStatement, getAccountTransactionsStatement, updateBalanceValue
} from "../../src/services/accounts.service";
import { mockAccount, mockAccountWithInvestments, mockAccountWithPortfolio, mockAccountWithTransactions, mockClient, mockFirstTransactionReturn, mockPortfolio } from "../mocks";

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

describe('Account service -> getAccountTransactionsStatement', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the account transactions statement', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccountWithTransactions);

    const result = await getAccountTransactionsStatement(mockClient, { pageNumber: 1, transactionType: 'DEPOSIT' });

    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
      include: { transactions: {
        select: {
          id: true, transaction_type: true, value: true, created_at: true,
        },
      } },
    });

    expect(result).toEqual([
      {
        id: 1,
        transaction_type: 'DEPOSIT',
        value: '100',
        created_at: '2020-01-01T00:00:00.000Z',
      },
    ]);
  });
});

describe('Account service -> getAccountInvestmentsStatement', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the account investments statement', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccountWithInvestments);

    const result = await getAccountInvestmentsStatement(mockClient, { pageNumber: 1, investmentType: 'BUY' });

    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
      include: { investments: {
        select: { id: true, asset_id: true, investment_type: true, quantity: true, price: true, created_at: true },
      } },
    });

    expect(result).toEqual([
      {
        id: 1,
        asset_id: 1,
        investment_type: 'BUY',
        quantity: 100,
        price: '10',
        created_at: '2020-01-01T00:00:00.000Z',
      },
    ]);
  });
});

describe('Account service -> updateBalanceValue', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update the account balance', async () => {
    jest.spyOn(prisma.account, "findUniqueOrThrow").mockResolvedValueOnce(mockAccountWithPortfolio);
    jest.spyOn(prisma.account, "update").mockResolvedValueOnce(mockAccount);

    await updateBalanceValue(mockClient);

    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
      include: { portfolio: true },
    });

    expect(prisma.account.update).toHaveBeenCalledTimes(1);
    expect(prisma.account.update).toHaveBeenCalledWith({
      where: { id: mockAccountWithPortfolio.id },
      data: {
        investments_value: 7751,
        total_assets: Number(mockAccountWithPortfolio.available_balance) + 7751,
      },
    });
  });
});