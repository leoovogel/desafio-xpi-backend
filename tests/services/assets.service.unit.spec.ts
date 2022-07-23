import { prisma } from "../../src/database/prismaClient";
import { getAllAssets, getAssetById } from "../../src/services/assets.service";
import { mockAsset1, mockAsset2 } from "../mocks";

const mockAssetsList = [mockAsset1, mockAsset2];

describe('Assets service -> getAssetById', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the asset by id', async () => {
    jest.spyOn(prisma.asset, 'findUniqueOrThrow').mockResolvedValue(mockAsset1 as never);

    const result = await getAssetById('1');

    expect(prisma.asset.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(prisma.asset.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: Number('1') } });

    expect(result).toEqual(mockAsset1);
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
