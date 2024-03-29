import { buildReq, buildRes } from "../builders";
import { getAll, getById } from "../../src/controllers/assets.controller";
import * as assetService from "../../src/services/assets.service";
import { mockAsset1, mockAsset2 } from "../mocks";

const mockAssetsList = [mockAsset1, mockAsset2];

describe('Assets controller -> getById', () => {
  it('should return status 200 and the asset info', async () => {
    const req = buildReq({ params: { id: '1' } });
    const res = buildRes();

    jest.spyOn(assetService, 'getAssetById').mockResolvedValueOnce(mockAsset1 as never)

    await getById(req, res);

    expect(assetService.getAssetById).toHaveBeenCalledTimes(1);
    expect(assetService.getAssetById).toHaveBeenCalledWith('1');

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockAsset1);
  });
});

describe('Assets controller -> getAll', () => {
  it('should return status 200 and the assets list', async () => {
    const req = buildReq();
    const res = buildRes();

    jest.spyOn(assetService, 'getAllAssets').mockResolvedValueOnce(mockAssetsList as never)

    await getAll(req, res);

    expect(assetService.getAllAssets).toHaveBeenCalledTimes(1);
    expect(assetService.getAllAssets).toHaveBeenCalledWith();

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockAssetsList);
  });
});