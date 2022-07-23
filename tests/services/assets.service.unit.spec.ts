import { prisma } from "../../src/database/prismaClient";
import { getAllAssets, getAssetById } from "../../src/services/assets.service";

const mockAsset = {
  "id": 1,
  "symbol": "ITSA4",
  "name": "Itausa",
  "available_quantity": 20000,
  "price": "12"
}

const mockAsset2 = {
  "id": 2,
  "symbol": "ABEV3",
  "name": "Ambev",
  "available_quantity": 40000,
  "price": "13"
}

const mockAssetsList = [mockAsset, mockAsset2];

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

describe('Assets service -> getAssetById', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the assets list', async () => {
    jest.spyOn(prisma.asset, 'findMany').mockResolvedValue(mockAssetsList as never);

    const result = await getAllAssets();

    expect(prisma.asset.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.asset.findMany).toHaveBeenCalledWith();

    expect(result).toEqual(mockAssetsList);
  });

  it('should throws an error if there is no asset with the searched id', async () => {
    jest.spyOn(prisma.asset, 'findMany').mockResolvedValueOnce([]);

    const result = await getAllAssets();

    expect(result).toEqual([]);
  });
});
