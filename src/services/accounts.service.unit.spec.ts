import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { prisma } from "../database/prismaClient";
import { accountDeposit, accountWithdrawal } from "./accounts.service";

const mockClient = {
  id: "clientId",
  name: "Client Name",
  email: "client@name.com",
};

const mockAccount = {
  id: "accountId",
  client_id: "clientId",
  available_balance: 100 as unknown as Decimal,
  investments_value: 100 as unknown as Decimal,
  total_assets: 100 as unknown as Decimal,
  created_at: "2020-01-01" as unknown as Date,
  updated_at: "2020-01-01" as unknown as Date,
};

const mockFirstTransactionReturn = [
  {
    id: 'cl5vz26860001isnjko290i97',
    client_id: 'cl5vz26860000isnj383h7wq0',
    available_balance: 165000,
    investments_value: 0,
    total_assets: 0,
    created_at: "2022-07-22T04:38:17.094Z" as unknown as Date,
    updated_at: "2022-07-22T06:38:47.824Z" as unknown as Date,
  },
  {
    id: 19,
    account_id: 'cl5vz26860001isnjko290i97',
    value: 50000,
    transaction_type: 'DEPOSIT',
    created_at: "2022-07-22T06:38:47.824Z" as unknown as Date
  }
]

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