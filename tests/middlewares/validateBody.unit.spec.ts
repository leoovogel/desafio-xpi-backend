import * as builders from '../builders';
import validateBody from '../../src/middlewares/validateBody';

describe('Validate Body middleware', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call the next function without any parameters if the request method is "GET"', () => {
    const req = builders.buildReq({ method: 'GET' });
    const res = builders.buildRes();
    const next = builders.buildNext();

    validateBody(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call the next function without any parameters if there is no schema for the desired route', () => {
    const req = builders.buildReq({ originalUrl: '/test/url' });
    const res = builders.buildRes();
    const next = builders.buildNext();

    validateBody(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call the next function without any parameters if the request body is correct', () => {
    const req = builders.buildReq({ originalUrl: '/investments/buy', method: 'POST', body: {
      assetId: 1,
      assetQuantity: 1,
     } });
    const res = builders.buildRes();
    const next = builders.buildNext();

    validateBody(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call the next function with a status and a message error if the body on request is not valid', () => {
    const req = builders.buildReq({ originalUrl: '/investments/buy', method: 'POST', body: { } });
    const res = builders.buildRes();
    const next = builders.buildNext();

    validateBody(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ status: 422, message: '"assetId" is required' });
  });
});
