import { Account, Portfolio } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { prisma } from "../database/prismaClient";
import { buyInvestment, sellInvestment } from "./investments.service";

const mockClient = {
  id: "mockClientId",
  name: "Mock Client",
  email: "mock@client.com",
}

const mockInvestmentBody = {
  assetId: 1,
  assetQuantity: 1,
}

const mockAccount = {
  id: "mockAccountId",
  client_id: "mockClientId",
  available_balance: 100 as unknown as Decimal,
  investments_value: 100 as unknown as Decimal,
  total_assets: 100 as unknown as Decimal,
  created_at: "2020-01-01" as unknown as Date,
  updated_at: "2020-01-01" as unknown as Date,
}

const mockAsset = {
  id: 1,
  symbol: 'ITSA4',
  name: 'Itausa',
  available_quantity: 20000,
  price: 12 as unknown as Decimal,
}

const mockAssetHistory = {
  id: 14,
  account_id: 'cl5uyu2bm00031epij2k42tze',
  asset_id: 1,
  investment_type: 'BUY',
  quantity: 1000,
  price: 12,
  created_at: '2022-07-21T12:50:21.787Z'
}

const mockAssetPortfolio = {
  id: 1,
  account_id: 'cl5uyu2bm00031epij2k42tze',
  asset_id: 1,
  symbol: 'ITSA4',
  quantity: 4009,
  average_price: 12  as unknown as Decimal,
  created_at: '2022-07-21T11:44:22.766Z' as unknown as Date,
  updated_at: '2022-07-21T12:50:21.788Z'  as unknown as Date
}

const mockTransactionReturn = {
  symbol: 'ITSA4',
  quantity: 1000,
  price: 12,
  totalPrice: 12000,
}

describe('Investments service -> buyInvestment', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throws an error if it is not possible to find the client by the id', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(null);

    await expect(async () => {
      await buyInvestment(mockClient, mockInvestmentBody)
    }).rejects.toThrow('Client not found');
  });

  it('should throws an error if it is not possible to find the asset by the id', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccount);
    jest.spyOn(prisma.asset, "findUnique").mockResolvedValue(null);

    await expect(async () => {
      await buyInvestment(mockClient, mockInvestmentBody)
    }).rejects.toThrow('Asset not found');
  });

  it('should throws an error if the quantity desired to purchase is greater than the quantity available', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccount);
    jest.spyOn(prisma.asset, "findUnique").mockResolvedValue(mockAsset);

    await expect(async () => {
      await buyInvestment(mockClient, { ...mockInvestmentBody, assetQuantity: mockAsset.available_quantity + 1 })
    }).rejects.toThrow('assetQuantity greater than the available quantity');
  });

  it('should buy an investment and return the investment details', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccount);
    jest.spyOn(prisma.asset, "findUnique").mockResolvedValue(mockAsset);
    jest.spyOn(prisma, "$transaction").mockResolvedValue([mockAssetHistory, mockAssetPortfolio]);
    jest.spyOn(prisma.investments_history, "create").mockReturnValue(jest.fn() as never);
    jest.spyOn(prisma.portfolio, "upsert").mockReturnValue(jest.fn() as never);

    await buyInvestment(mockClient, mockInvestmentBody);

    expect(prisma.account.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUnique).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
    });

    expect(prisma.asset.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.asset.findUnique).toHaveBeenCalledWith({
      where: { id: mockInvestmentBody.assetId },
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.investments_history.create).toHaveBeenCalledTimes(1);
    expect(prisma.portfolio.upsert).toHaveBeenCalledTimes(1);
  });
});

describe('Investments service -> sellInvestment', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throws an error if it is not possible to find the client by the id', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(null);

    await expect(async () => {
      await sellInvestment(mockClient, mockInvestmentBody)
    }).rejects.toThrow('Client not found');
  });

  it('should throws an error if it is not possible to find the asset in the client portfolio', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue({
      ...mockAccount, portfolio: [{...mockAssetPortfolio, asset_id: 2}]
    } as (Account & { portfolio: Portfolio[] }));


    await expect(async () => {
      await sellInvestment(mockClient, mockInvestmentBody)
    }).rejects.toThrow('Asset not found');
  });

  it('should sell an investment and return the investment details', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue({
      ...mockAccount, portfolio: [mockAssetPortfolio]
    } as (Account & { portfolio: Portfolio[] }));
    jest.spyOn(prisma, "$transaction").mockResolvedValue(mockTransactionReturn);

    const result = await sellInvestment(mockClient, mockInvestmentBody);

    expect(prisma.account.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUnique).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
      include: { portfolio: true },
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    
    expect(result).toEqual(mockTransactionReturn);
  });

  // TODO HOW TO TEST THIS??????
  // it.todo('should throws an error if the quantity desired to sell is greater than the quantity available');
  // it.todo('should delete the investment from the client portfolio if the quantity sold is equal to the quantity available');
});