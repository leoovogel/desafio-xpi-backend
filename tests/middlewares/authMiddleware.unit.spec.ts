import authMiddleware from '../../src/middlewares/authMiddleware';
import { buildNext, buildReq, buildRes } from '../builders';
import * as tokenUtils from '../../src/utils/token';
import { mockClientPayload, mockValidToken } from '../mocks';

jest.mock('../../src/utils/token');

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
    const req = buildReq({ headers: { authorization: 'Bearer ' + mockValidToken } });
    const res = buildRes();
    const next = buildNext();

    jest.spyOn(tokenUtils, 'verifyToken').mockReturnValueOnce(mockClientPayload);

    authMiddleware(req, res, next);

    expect(tokenUtils.verifyToken).toHaveBeenCalledTimes(1);
    expect(tokenUtils.verifyToken).toHaveBeenCalledWith(mockValidToken);
    expect(res.locals.client).toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  })
});