import { buildReq, buildRes } from "../builders";
import * as clientService from '../../src/services/clients.service';
import { login, register } from "../../src/controllers/clients.controller";
import { mockValidToken } from "../mocks";

jest.mock('../../src/services/clients.service');

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

    jest.spyOn(clientService, 'loginClient').mockResolvedValueOnce(mockValidToken)

    await login(req, res)

    expect(clientService.loginClient).toHaveBeenCalledWith(req.body)
    expect(clientService.loginClient).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ token: mockValidToken})
  })
});