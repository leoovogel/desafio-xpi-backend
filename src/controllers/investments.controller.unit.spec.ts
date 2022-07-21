import { buildReq, buildRes } from "../../tests/builders";
import { buy, sell } from "./investments.controller";
import * as investmentService from "../services/investments.service";
import { Decimal } from "@prisma/client/runtime";

jest.mock('../services/investments.service');

const mockReturnBuyInvestment = {
  symbol: 'ITSA4',
  quantity: 1,
  unitPrice: 12 as unknown as Decimal,
  totalPrice: 12,
}

const mockReturnSellInvestment = {
  symbol: 'ITSA4',
  quantity: 1,
  unitPrice: 12 as unknown as Decimal,
  totalPrice: 12,
}

const mockClient = {
  id: '123123',
  name: 'Client Name',
  email: 'client@mock.com',
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Investments controller -> buy', () => {
  it('should return status code 200 and purchase information', async () => {
    const req = buildReq({ body: {
      assetId: 1,
      assetQuantity: 1,
    } });
    const res = buildRes({ locals: { client: mockClient } });

    jest.spyOn(investmentService, 'buyInvestment').mockResolvedValueOnce(mockReturnBuyInvestment)

    await buy(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(investmentService.buyInvestment).toHaveBeenCalledTimes(1);
    expect(investmentService.buyInvestment).toHaveBeenCalledWith(mockClient, req.body);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ successful_purchase: mockReturnBuyInvestment });
  })
})

describe('Investments controller -> sell', () => { 
  it('should return status code 200 and sale information', async () => {
    const req = buildReq({ body: {
      assetId: 1,
      assetQuantity: 1,
    } });
    const res = buildRes({ locals: { client: mockClient } });

    jest.spyOn(investmentService, 'sellInvestment').mockResolvedValueOnce(mockReturnSellInvestment)

    await sell(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(investmentService.sellInvestment).toHaveBeenCalledTimes(1);
    expect(investmentService.sellInvestment).toHaveBeenCalledWith(mockClient, req.body);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ successful_sale: mockReturnSellInvestment });
  })
})