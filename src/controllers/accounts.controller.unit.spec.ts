import { Decimal } from "@prisma/client/runtime";
import { buildReq, buildRes } from "../../tests/builders";
import * as accountService from '../services/accounts.service';
import { deposit, getBalance, withdrawal } from "./accounts.controller";

const mockClient = {
  id: 'clientId',
  name: 'Client Name',
  email: 'client@name.com',
}

describe('Accounts controller -> deposit', () => {
  it('should return status 200 and object with message "Deposit successful"', async () => {
    const req = buildReq({ body: { value: 100 } })
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'accountDeposit').mockResolvedValueOnce({ message: 'Deposit successful' })

    await deposit(req, res)

    expect(accountService.accountDeposit).toHaveBeenCalledTimes(1)
    expect(accountService.accountDeposit).toHaveBeenCalledWith(mockClient, req.body.value)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ message: 'Deposit successful' })
  });
});

describe('Accounts controller -> withdrawal', () => {
  it('should return status 200 and object with message "Withdrawal successful"', async () => {
    const req = buildReq({ body: { value: 100 } })
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'accountWithdrawal').mockResolvedValueOnce({ message: 'Withdrawal successful' })

    await withdrawal(req, res)

    expect(accountService.accountWithdrawal).toHaveBeenCalledTimes(1)
    expect(accountService.accountWithdrawal).toHaveBeenCalledWith(mockClient, req.body.value)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ message: 'Withdrawal successful' })
  });
});

describe('Accounts controller -> getBalance', () => {
  it('should return status 200 and object with availableBalance, investmentsValue and totalAssets', async () => {
    const req = buildReq()
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'getAccountBalance').mockResolvedValueOnce({
      availableBalance: 100 as unknown as Decimal,
      investmentsValue: 50 as unknown as Decimal,
      totalAssets: 150 as unknown as Decimal,
    })

    await getBalance(req, res)

    expect(accountService.getAccountBalance).toHaveBeenCalledTimes(1)
    expect(accountService.getAccountBalance).toHaveBeenCalledWith(mockClient)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      availableBalance: 100,
      investmentsValue: 50,
      totalAssets: 150,
    })
  });
});