import { buildReq, buildRes } from "../../tests/builders";
import * as clientService from '../services/clients.service';
import { login, register } from "./clients.controller";

jest.mock('../services/clients.service');

const fakeTokenValid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsNXRrZ3F6OTAwMDJncm8wZ3VnbjJwOW0iLCJuYW1lIjoiTGVvbmFyZG8iLCJlbWFpbCI6Imxlb25hcmRvQHZvZ2VsLmNvbSIsImlhdCI6MTY1ODM4ODg2NywiZXhwIjoxNjU4NDA2ODY3fQ.dieeDm99bGZPnIw2qrBxG_4yMMVrjaBKzqVD9U40q5A'

describe('Clients controller -> Register', () => {
  it('should return status 204 without content', async () => {
    const req = buildReq()
    const res = buildRes()

    jest.spyOn(clientService, 'registerClient').mockResolvedValueOnce()

    await register(req, res)

    expect(clientService.registerClient).toHaveBeenCalledWith(req.body)
    expect(clientService.registerClient).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(204)

    expect(res.end).toHaveBeenCalledTimes(1)
    expect(res.end).toHaveBeenCalledWith()
  })
});

describe('Clients controller -> Login', () => {
  it('should return status 200 with a token', async () => {
    const req = buildReq()
    const res = buildRes()

    jest.spyOn(clientService, 'loginClient').mockResolvedValueOnce(fakeTokenValid)

    await login(req, res)

    expect(clientService.loginClient).toHaveBeenCalledWith(req.body)
    expect(clientService.loginClient).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ token: fakeTokenValid})
  })
});