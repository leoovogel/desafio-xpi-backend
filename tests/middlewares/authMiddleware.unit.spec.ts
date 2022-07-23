import authMiddleware from '../../src/middlewares/authMiddleware';
import { buildNext, buildReq, buildRes } from '../builders';
import * as tokenUtils from '../../src/utils/token';

jest.mock('../../src/utils/token');

const fakeTokenValid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsNXRrZ3F6OTAwMDJncm8wZ3VnbjJwOW0iLCJuYW1lIjoiTGVvbmFyZG8iLCJlbWFpbCI6Imxlb25hcmRvQHZvZ2VsLmNvbSIsImlhdCI6MTY1ODM4MDU3MywiZXhwIjoxNjU4Mzk4NTczfQ.X5QKL_xVxz2JVBcB7axzM1D9tINgb4JgEtsyQiN3avw";

const fakeClientPayload = {
  id: 'cl5tkgqz90002gro0gugn2p9m',
  name: 'Teste',
  email: 'teste@teste.com',
}

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should next have been called with error message and status code 401 when no token is sent', () => {
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ status: 401, message: 'Token not found' });
  })

  it('should next have been called with error message and status code 401 when token is invalid', () => {
    const req = buildReq({ headers: { authorization: 'invalid token' } });
    const res = buildRes();
    const next = buildNext();

    jest.spyOn(tokenUtils, 'verifyToken').mockImplementation(() => { throw new Error('Invalid token') });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ status: 401, message: 'Invalid token' });
  })

  it('should next have been called with error message and status code 401 when token is valid', () => {
    const req = buildReq({ headers: { authorization: fakeTokenValid } });
    const res = buildRes();
    const next = buildNext();

    jest.spyOn(tokenUtils, 'verifyToken').mockReturnValueOnce(fakeClientPayload as never);

    authMiddleware(req, res, next);

    expect(tokenUtils.verifyToken).toHaveBeenCalledTimes(1);
    expect(tokenUtils.verifyToken).toHaveBeenCalledWith(fakeTokenValid);
    expect(res.locals.client).toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  })
});