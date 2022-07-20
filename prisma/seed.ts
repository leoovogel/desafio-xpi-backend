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
    await prisma.transaction_history.createMany({
      data: [
        { account_id: account.id, value: 200, transaction_type: 'DEPOSIT' },
        { account_id: account.id, value: 300, transaction_type: 'DEPOSIT' },
        { account_id: account.id, value: 100, transaction_type: 'WITHDRAWAL' },
      ]
    });

    await prisma.investments_history.createMany({
      data: [
        { account_id: account.id, asset_id: assets[0].id, investment_type: 'BUY', price: assets[0].price, quantity: 100 },
        { account_id: account.id, asset_id: assets[1].id, investment_type: 'BUY', price: assets[1].price, quantity: 100 },
        { account_id: account.id, asset_id: assets[2].id, investment_type: 'BUY', price: assets[2].price, quantity: 100 },
      ]
    })
  })

}

main();
