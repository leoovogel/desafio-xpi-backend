import { Account, Portfolio } from "@prisma/client";
import { prisma } from "../../src/database/prismaClient";
import { buyInvestment, sellInvestment } from "../../src/services/investments.service";
import { mockAccount, mockAsset1, mockAssetHistory, mockAssetPortfolio, mockClient, mockInvestmentBody, mockTransactionReturn } from "../mocks";

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
    jest.spyOn(prisma.asset, "findUnique").mockResolvedValue(mockAsset1);

    await expect(async () => {
      await buyInvestment(mockClient, { ...mockInvestmentBody, assetQuantity: mockAsset1.available_quantity + 1 })
    }).rejects.toThrow('assetQuantity greater than the available quantity');
  });

  it('should buy an investment and return the investment details', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccount);
    jest.spyOn(prisma.asset, "findUnique").mockResolvedValue(mockAsset1);
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