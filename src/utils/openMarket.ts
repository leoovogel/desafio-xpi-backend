/* istanbul ignore file */
/* eslint-disable no-console */
import { prisma } from '../database/prismaClient';

async function randomAssetPrice() {
  console.log(`Mercado aberto, atualizando preços dos ativos.
------------------------------------------------------------
Para fechar, pressione Ctrl+C`);

  setInterval(async () => {
    const assets = await prisma.asset.findMany();

    assets.forEach(async (asset) => {
      const randomPercentage = Math.random() * (0.003 - 0.0001) + 0.0001;
      let newPrice;

      if (Math.random() > 0.5) {
        newPrice = Number(asset.price) * (1 + randomPercentage);
      } else {
        newPrice = Number(asset.price) * (1 - randomPercentage);
      }

      await prisma.asset.update({
        where: { id: asset.id },
        data: { price: newPrice },
      });

      console.log(`Symbol: ${asset.symbol} Price: ${newPrice}`);
    });
  }, 1000);
}

randomAssetPrice();
