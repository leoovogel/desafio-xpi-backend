import { Decimal } from '@prisma/client/runtime';

export const mockClientBody = {
  name: 'Fake Client',
  email: 'fake@client.com',
  password: 'fakePassword',
};

export const mockClient = {
  id: 'clientId',
  name: 'Client Name',
  email: 'client@name.com',
};

export const mockCreatedClient = {
  id: 'cl5ur7xpo00005eo0qvml515a',
  name: 'Fake Client',
  email: 'fake@client.com',
  password: '$2b$10$X8ggUZTGc00CPmQ.m9gaous2UQ2mv4r1TQyeLNgQGATGngAFvpkBy',
};

export const mockAccount = {
  id: 'accountId',
  client_id: 'clientId',
  available_balance: 100 as unknown as Decimal,
  investments_value: 150 as unknown as Decimal,
  total_assets: 200 as unknown as Decimal,
  created_at: '2020-01-01' as unknown as Date,
  updated_at: '2020-01-01' as unknown as Date,
};

export const mockPortfolio = [
  {
    id: 1,
    account_id: 'cl5w8ryhv0003y9njg9jp3y01',
    asset_id: 1,
    symbol: 'ITSA4',
    quantity: 500,
    average_price: '12',
    created_at: '2022-07-22T10:01:12.015Z',
    updated_at: '2022-07-22T10:01:12.015Z',
  },
  {
    id: 2,
    account_id: 'cl5w8ryhv0003y9njg9jp3y01',
    asset_id: 2,
    symbol: 'B3SA3',
    quantity: 300,
    average_price: '15',
    created_at: '2022-07-22T10:01:19.638Z',
    updated_at: '2022-07-22T10:01:19.638Z',
  },
];

export const mockAsset1 = {
  id: 1,
  symbol: 'ITSA4',
  name: 'Itausa',
  available_quantity: 20000,
  price: '12' as unknown as Decimal,
};

export const mockAsset2 = {
  id: 2,
  symbol: 'ABEV3',
  name: 'Ambev',
  available_quantity: 40000,
  price: '13',
};

export const mockClientPayload = {
  id: 'cl5tkgqz90002gro0gugn2p9m',
  name: 'Teste',
  email: 'teste@teste.com',
};

export const mockReturnBuyInvestment = {
  symbol: 'ITSA4',
  quantity: 1,
  unitPrice: 12,
  totalPrice: 12,
};

export const mockReturnSellInvestment = {
  symbol: 'ITSA4',
  quantity: 1,
  unitPrice: 12,
  totalPrice: 12,
};

export const mockFirstTransactionReturn = [
  {
    id: 'cl5vz26860001isnjko290i97',
    client_id: 'cl5vz26860000isnj383h7wq0',
    available_balance: 165000,
    investments_value: 0,
    total_assets: 0,
    created_at: '2022-07-22T04:38:17.094Z' as unknown as Date,
    updated_at: '2022-07-22T06:38:47.824Z' as unknown as Date,
  },
  {
    id: 19,
    account_id: 'cl5vz26860001isnjko290i97',
    value: 50000,
    transaction_type: 'DEPOSIT',
    created_at: '2022-07-22T06:38:47.824Z' as unknown as Date,
  },
];

export const mockInvestmentBody = {
  assetId: 1,
  assetQuantity: 1,
};

export const mockAssetHistory = {
  id: 14,
  account_id: 'cl5uyu2bm00031epij2k42tze',
  asset_id: 1,
  investment_type: 'BUY',
  quantity: 1000,
  price: 12,
  created_at: '2022-07-21T12:50:21.787Z',
};

export const mockAssetPortfolio = {
  id: 1,
  account_id: 'cl5uyu2bm00031epij2k42tze',
  asset_id: 1,
  symbol: 'ITSA4',
  quantity: 400,
  average_purchase_price: 9 as unknown as Decimal,
  acquisition_value: 3400 as unknown as Decimal,
  current_value: 3600 as unknown as Decimal,
  profitability_percentage: 9.10 as unknown as Decimal,
  profitability_value: 122.04 as unknown as Decimal,
  created_at: '2022-07-21T11:44:22.766Z' as unknown as Date,
  updated_at: '2022-07-21T12:50:21.788Z' as unknown as Date,
};

export const mockTransactionReturn = {
  symbol: 'ITSA4',
  quantity: 1000,
  price: 12,
  totalPrice: 12000,
};

export const mockTransactionReturnBuyInvestment = {
  symbol: 'B3SA3',
  quantity: 300,
  unitPrice: 10.72,
  totalPrice: 321600,
}

export const mockValidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsNXRrZ3F6OTAwMDJncm8wZ3VnbjJwOW0iLCJuYW1lIjoiTGVvbmFyZG8iLCJlbWFpbCI6Imxlb25hcmRvQHZvZ2VsLmNvbSIsImlhdCI6MTY1ODM4ODg2NywiZXhwIjoxNjU4NDA2ODY3fQ.dieeDm99bGZPnIw2qrBxG_4yMMVrjaBKzqVD9U40q5A';
