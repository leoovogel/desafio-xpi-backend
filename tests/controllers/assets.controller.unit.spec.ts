import { buildReq, buildRes } from "../builders";
import { getAll, getById } from "../../src/controllers/assets.controller";
import * as assetService from "../../src/services/assets.service";

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

describe('Assets controller -> getById', () => {
  it('should return status 200 and the asset info', async () => {
    const req = buildReq({ params: { id: '1' } });
    const res = buildRes();

    jest.spyOn(assetService, 'getAssetById').mockResolvedValueOnce(mockAsset as never)

    await getById(req, res);

    expect(assetService.getAssetById).toHaveBeenCalledTimes(1);
    expect(assetService.getAssetById).toHaveBeenCalledWith('1');

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockAsset);
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