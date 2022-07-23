import { buildReq, buildRes } from "../builders";
import { buy, sell } from "../../src/controllers/investments.controller";
import * as investmentService from "../../src/services/investments.service";
import { mockClient, mockReturnBuyInvestment, mockReturnSellInvestment } from "../mocks";

jest.mock('../../src/services/investments.service');

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