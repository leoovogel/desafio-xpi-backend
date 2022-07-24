import { Portfolio } from "@prisma/client";
import { prisma } from "../../src/database/prismaClient";
import { buyInvestment, sellInvestment, updateInvestmentsValue } from "../../src/services/investments.service";
import { mockAccount, mockAccountWithPortfolio, mockAsset1, mockAsset2, mockAssetPortfolio, mockClient, mockInvestmentBody, mockPortfolio, mockTransactionReturn, mockTransactionReturnBuyInvestment } from "../mocks";


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
    jest.spyOn(prisma, "$transaction").mockResolvedValue(mockTransactionReturnBuyInvestment);

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
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccountWithPortfolio);

    await expect(async () => {
      await sellInvestment(mockClient, {...mockInvestmentBody, assetId: 999})
    }).rejects.toThrow('Asset not found');
  });

  it('should sell an investment and return the investment details', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccountWithPortfolio);
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

describe('Investments service -> updateInvestmentsValue', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should throws an error if it is not possible to find the client by the id', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(null);

    await expect(async () => {
      await updateInvestmentsValue(mockClient)
    }).rejects.toThrow('Client not found');
  });

  it('should update the investments value of the client', async () => {
    jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockAccountWithPortfolio);
    jest.spyOn(prisma.asset, "findUnique")
      .mockResolvedValueOnce(mockAsset1)
      .mockResolvedValueOnce(mockAsset2);
    jest.spyOn(prisma.portfolio, "update").mockResolvedValue(mockPortfolio as unknown as Portfolio);

    await updateInvestmentsValue(mockClient);

    expect(prisma.account.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.account.findUnique).toHaveBeenCalledWith({
      where: { client_id: mockClient.id },
      include: { portfolio: true },
    });

    expect(prisma.asset.findUnique).toHaveBeenCalledTimes(2);
    expect(prisma.asset.findUnique).toHaveBeenCalledWith({
      where: { id: mockAsset1.id },
    });

    const newCurrentValueAsset1 = Number(mockAsset1.price) * mockAccountWithPortfolio.portfolio[0].quantity
    const newCurrentValueAsset2 = Number(mockAsset2.price) * mockAccountWithPortfolio.portfolio[1].quantity

    expect(prisma.portfolio.update).toHaveBeenCalledTimes(2);
    expect(prisma.portfolio.update).toHaveBeenCalledWith({
      where: {
        account_id_asset_id: {
          account_id: mockAccountWithPortfolio.id,
          asset_id: mockAccountWithPortfolio.portfolio[0].asset_id,
        },
      },
      data: {
        current_value: newCurrentValueAsset1,
        profitability_percentage: (newCurrentValueAsset1 / Number(mockAccountWithPortfolio.portfolio[0].acquisition_value) - 1) * 100,
        profitability_value: newCurrentValueAsset1 - Number(mockAccountWithPortfolio.portfolio[0].acquisition_value),
      },
    });
    expect(prisma.portfolio.update).toHaveBeenCalledWith({
      where: {
        account_id_asset_id: {
          account_id: mockAccountWithPortfolio.id,
          asset_id: mockAccountWithPortfolio.portfolio[1].asset_id,
        },
      },
      data: {
        current_value: newCurrentValueAsset2,
        profitability_percentage: (newCurrentValueAsset2 / Number(mockAccountWithPortfolio.portfolio[1].acquisition_value) - 1) * 100,
        profitability_value: newCurrentValueAsset2 - Number(mockAccountWithPortfolio.portfolio[1].acquisition_value),
      },
    });
  });
});