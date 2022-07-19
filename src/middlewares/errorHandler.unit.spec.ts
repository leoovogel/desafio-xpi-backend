import { StatusCodes } from 'http-status-codes';
import * as builders from '../../tests/builders';
import errorMiddleware from './errorHandler';

describe('Error handler middleware', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return status code 400 and error message when an error is triggered', () => {
    const err = builders.buildError('Error message', StatusCodes.BAD_REQUEST);
    const req = builders.buildReq();
    const res = builders.buildRes();
    const next = builders.buildNext();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error message' });
  });
});
