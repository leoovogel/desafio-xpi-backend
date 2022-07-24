/* istanbul ignore file */
/* eslint-disable no-console */
import { prisma } from '../database/prismaClient';

const UPDATE_RATE = 5000;

async function randomAssetPrice() {
  console.log(`

Mercado aberto, atualizando o preços de todos os ativos a cada ${UPDATE_RATE / 1000} segundos.
!! Para fechar, pressione Ctrl+C ou encerre o processo. !!`);

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

      // console.log(`Symbol: ${asset.symbol} Price: ${newPrice}`);
    });
  }, UPDATE_RATE);
}

randomAssetPrice();
