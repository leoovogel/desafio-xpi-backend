import { Decimal } from "@prisma/client/runtime";
import { buildReq, buildRes } from "../builders";
import * as accountService from '../../src/services/accounts.service';
import { deposit, getAssets, getBalance, getInvestmentsStatement, getTransactionsStatement, withdrawal } from "../../src/controllers/accounts.controller";
import { mockClient, mockPortfolio } from "../mocks";

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

describe('Accounts controller -> getAssets', () => {
  it('should return status 200 and object with availableBalance, investmentsValue and totalAssets', async () => {
    const req = buildReq()
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'getAccountAssets').mockResolvedValueOnce(mockPortfolio as never)

    await getAssets(req, res)

    expect(accountService.getAccountAssets).toHaveBeenCalledTimes(1)
    expect(accountService.getAccountAssets).toHaveBeenCalledWith(mockClient)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(mockPortfolio)
  });
});

describe('Accounts controller -> getTransactionsStatement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  it('should return status 200 and array with transactions, even without passing any query param', async () => {
    const req = buildReq()
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'getAccountTransactionsStatement').mockResolvedValueOnce([{
      id: 1,
      transaction_type: 'DEPOSIT',
      value: '100' as unknown as Decimal,
      created_at: '2020-01-01' as unknown as Date,
    }])

    await getTransactionsStatement(req, res)

    expect(accountService.getAccountTransactionsStatement).toHaveBeenCalledTimes(1)
    expect(accountService.getAccountTransactionsStatement).toHaveBeenCalledWith(mockClient, { 
      pageNumber: 1,
      transactionType: 'ALL',
    })

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith([{
      id: 1,
      transaction_type: 'DEPOSIT',
      value: '100',
      created_at: '2020-01-01',
    }])
  });

  it('should return status 200 and array with transactions, passing query param page and type', async () => {
    const req = buildReq({ query: { page: 1, type: 'DEPOSIT' } })
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'getAccountTransactionsStatement').mockResolvedValueOnce([{
      id: 1,
      transaction_type: 'DEPOSIT',
      value: '100' as unknown as Decimal,
      created_at: '2020-01-01' as unknown as Date,
    }])

    await getTransactionsStatement(req, res)

    expect(accountService.getAccountTransactionsStatement).toHaveBeenCalledTimes(1)
    expect(accountService.getAccountTransactionsStatement).toHaveBeenCalledWith(mockClient, { 
      pageNumber: req.query.page,
      transactionType: req.query.type,
    })

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith([{
      id: 1,
      transaction_type: 'DEPOSIT',
      value: '100',
      created_at: '2020-01-01',
    }])
  });
});

describe('Accounts controller -> getInvestmentsStatement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  it('should return status 200 and array with investments, even without passing any query param', async () => {
    const req = buildReq()
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'getAccountInvestmentsStatement').mockResolvedValueOnce([{
      id: 1,
      asset_id: 1,
      investment_type: 'BUY',
      quantity: 100,
      price: '100' as unknown as Decimal,
      created_at: '2020-01-01' as unknown as Date,
    }])

    await getInvestmentsStatement(req, res)

    expect(accountService.getAccountInvestmentsStatement).toHaveBeenCalledTimes(1)
    expect(accountService.getAccountInvestmentsStatement).toHaveBeenCalledWith(mockClient, { 
      pageNumber: 1,
      investmentType: 'ALL',
    })

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith([{
      id: 1,
      asset_id: 1,
      investment_type: 'BUY',
      quantity: 100,
      price: '100',
      created_at: '2020-01-01',
    }])
  });

  it('should return status 200 and array with investments, passing query param page and type', async () => {
    const req = buildReq({ query: { page: 1, type: 'BUY' } })
    const res = buildRes({ locals: { client: mockClient } })

    jest.spyOn(accountService, 'getAccountInvestmentsStatement').mockResolvedValueOnce([{
      id: 1,
      asset_id: 1,
      investment_type: 'BUY',
      quantity: 100,
      price: '100' as unknown as Decimal,
      created_at: '2020-01-01' as unknown as Date,
    }])

    await getInvestmentsStatement(req, res)

    expect(accountService.getAccountInvestmentsStatement).toHaveBeenCalledTimes(1)
    expect(accountService.getAccountInvestmentsStatement).toHaveBeenCalledWith(mockClient, { 
      pageNumber: req.query.page,
      investmentType: req.query.type,
    })

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith([{
      id: 1,
      asset_id: 1,
      investment_type: 'BUY',
      quantity: 100,
      price: '100',
      created_at: '2020-01-01',
    }])
  });
});