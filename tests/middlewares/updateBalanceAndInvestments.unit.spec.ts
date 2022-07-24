import updateBalanceAndInvestments from "../../src/middlewares/updateBalanceAndInvestments";
import { buildNext, buildReq, buildRes } from "../builders";
import { mockClient } from "../mocks";
import * as accountService from "../../src/services/accounts.service";
import * as investmentsService from "../../src/services/investments.service";

describe('Update balance and investments middleware', () => {
  it('should call updateInvestmentsValue, updateBalanceValue with client object and next function without param', async () => {
    const req = buildReq()
    const res = buildRes({ locals: { client: mockClient } })
    const next = buildNext()

    jest.spyOn(investmentsService, 'updateInvestmentsValue').mockResolvedValue({} as never)
    jest.spyOn(accountService, 'updateBalanceValue').mockResolvedValue({} as never)
  
    await updateBalanceAndInvestments(req, res, next)

    expect(investmentsService.updateInvestmentsValue).toHaveBeenCalledTimes(1)
    expect(investmentsService.updateInvestmentsValue).toHaveBeenCalledWith(mockClient)

    expect(accountService.updateBalanceValue).toHaveBeenCalledTimes(1)
    expect(accountService.updateBalanceValue).toHaveBeenCalledWith(mockClient)
  
    expect(next).toHaveBeenCalled()
  });
});