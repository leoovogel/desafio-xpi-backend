import { prisma } from '../database/prismaClient';

export async function getAssetById(assetId: string) {
  const result = await prisma.asset.findUniqueOrThrow({ where: { id: Number(assetId) } });
  return result;
}
