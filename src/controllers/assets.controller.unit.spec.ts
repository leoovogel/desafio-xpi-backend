import { buildReq, buildRes } from "../../tests/builders";
import { getById } from "./assets.controller";
import * as assetService from '../services/assets.service';

const mockAsset = {
  "id": 1,
  "symbol": "ITSA4",
  "name": "Itausa",
  "available_quantity": 20000,
  "price": "12"
}

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