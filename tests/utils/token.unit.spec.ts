import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../../src/utils/token";
import { mockClientPayload, mockValidToken } from "../mocks";

describe('Token', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a token when the generateToken is called', () => {
    jest.spyOn(jwt, 'sign').mockImplementation(() => mockValidToken);
    const token = generateToken(mockClientPayload);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(token).toBeDefined();
    expect(token).toBe(mockValidToken);
  });

  it('should return a payload object when the verify token is called', () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => mockClientPayload);
    const resultPayload = verifyToken(mockValidToken);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(resultPayload).toBeDefined();
    expect(resultPayload).toEqual(mockClientPayload);
  });
});