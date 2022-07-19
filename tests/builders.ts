import { NextFunction, Request, Response } from 'express';
import HttpException from '../src/utils/httpException';

interface IResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

export function buildReq({ ...rest } = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...rest,
  } as Request;
}

export function buildRes() {
  const res: IResponse = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  return res as Response;
}

export function buildNext() {
  return jest.fn() as NextFunction;
}

export function buildError(message: string, status: number) {
  return new HttpException(message, status);
}
