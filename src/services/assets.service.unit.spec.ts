import { prisma } from "../database/prismaClient";
import { getAssetById } from "./assets.service";

const mockAsset = {
  id: 1,
  symbol: 'ITSA4',
  name: 'Itausa',
  availableQuantity: 20000,
  price: '12'
};

describe('Assets service -> getAssetById', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the asset by id', async () => {
    jest.spyOn(prisma.asset, 'findUniqueOrThrow').mockResolvedValue(mockAsset as never);

    const result = await getAssetById('1');

    expect(prisma.asset.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.asset.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: Number('1') } });

    expect(result).toEqual(mockAsset);
  });

  it('should throws an error if there is no asset with the searched id', async () => {
    jest.spyOn(prisma.asset, 'findUniqueOrThrow').mockRejectedValueOnce(new Error('No asset found'));

    expect(async () => {
      await getAssetById('9999');
    }).rejects.toThrow('No asset found');
  });
});
