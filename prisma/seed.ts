import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.client.createMany({
    data: [
      { name: 'Leonardo', email: 'leonardo@gmail.com', password: '12345678' },
      { name: 'Jose', email: 'jose@gmail.com', password: '12345678' },
      { name: 'Rafael', email: 'rafa@gmail.com', password: '987654321' },
      { name: 'Tonn', email: 'tonn@hotmail.com', password: '12345678' },
    ]
  });

  const clients = await prisma.client.findMany();

  clients.forEach(async (client) => {
    await prisma.account.create({
      data: { client_id: client.id } })
  })

  const accounts = await prisma.account.findMany();

  await prisma.asset.createMany({
    data: [
      { symbol: 'ITSA4', name: 'Itausa', available_quantity: 20000, price: 12 },
      { symbol: 'B3SA3', name: 'B3', available_quantity: 30000, price: 15},
      { symbol: 'ABEV3', name: 'Ambev', available_quantity: 40000, price: 12 },
    ]
  });

  const assets = await prisma.asset.findMany();

  accounts.forEach(async (account) => {
    await prisma.portfolio.createMany({
      data: [
        { account_id: account.id, symbol: 'ITSA4', quantity: 10, average_price: 12.0 },
        { account_id: account.id, symbol: 'B3SA3', quantity: 30, average_price: 15.0 },
        { account_id: account.id, symbol: 'ABEV3', quantity: 30, average_price: 12.0 },
      ]
    });

    await prisma.transaction_history.createMany({
      data: [
        { account_id: account.id, value: 200, transaction_type: 'DEPOSIT' },
        { account_id: account.id, value: 300, transaction_type: 'DEPOSIT' },
        { account_id: account.id, value: 100, transaction_type: 'WITHDRAWAL' },
      ]
    });
  })

  const portfolios = await prisma.portfolio.findMany();

  portfolios.forEach(async (portfolio) => {
    await prisma.investments_history.createMany({
      data: [
        { portfolio_id: portfolio.id, asset_id: assets[0].id, quantity: 10, price: 12.0, investment_type: 'BUY' },
        { portfolio_id: portfolio.id, asset_id: assets[1].id, quantity: 20, price: 15.0, investment_type: 'BUY' },
        { portfolio_id: portfolio.id, asset_id: assets[2].id, quantity: 30, price: 12.0, investment_type: 'BUY' },
      ]
    })
  })
}

main();
