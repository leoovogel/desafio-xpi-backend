import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.client.createMany({
    data: [
      { id: '1', email: 'leo@gmail.com', name: 'Leo', password: '12345678' },
      { id: '2', email: 'rafael@gmail.com', name: 'Rafa', password: '87654321' },
      { id: '3',email: 'lucas@hotmail.com', name: 'Lucas', password: '13243546' },
    ],
  });

  await prisma.account.createMany({
    data: [
      { id: '1', client_id: '1' },
      { id: '2', client_id: '2' },
      { id: '3', client_id: '3' },
    ],
  });

  await prisma.asset.createMany({
    data: [
      { name: '3R PETROLEUM', symbol: 'RRRP3', price: 28.74, quantity: 200372163 },
      { name: 'ALPARGATAS', symbol: 'ALPA4', price: 17.98, quantity: 201257220 },
      { name: 'AMBEV S/A', symbol: 'ABEV3', price: 14.59, quantity: 4380195841 },
      { name: 'AMERICANAS', symbol: 'AMER3', price: 16.32, quantity: 596875824 },
      { name: 'ASSAI', symbol: 'ASAI3', price: 15.58, quantity: 794531367 },
      { name: 'AZUL', symbol: 'AZUL4', price: 12.19, quantity: 327741172 },
      { name: 'B3', symbol: 'B3SA3', price: 10.03, quantity: 5987625321 },
      { name: 'BANCO PAN', symbol: 'BPAN4', price: 6.21, quantity: 341124068 },
    ],
  });

  await prisma.transaction.createMany({
    data: [
      { account_id: '1', amount: 100, transaction_type: 'DEPOSIT' },
      { account_id: '2', amount: 200, transaction_type: 'DEPOSIT' },
      { account_id: '3', amount: 3300, transaction_type: 'DEPOSIT' },
      { account_id: '3', amount: 300, transaction_type: 'WITHDRAWAL' },
    ],
  });

  await prisma.account_assets.createMany({
    data: [
      { account_id: '1', asset_id: 1, investment_type: 'BUY', quantity: 100, price: 28.74 },
      { account_id: '1', asset_id: 3, investment_type: 'BUY', quantity: 200, price: 12.19 },
      { account_id: '2', asset_id: 6, investment_type: 'SELL', quantity: 100, price: 11.19 },
    ],
  });
}

main();
