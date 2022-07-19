import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "./token";

describe('Token', () => {
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM3YzM4MWMyLTQyZDctNGMyNS05OWEzLTEwMTE2MmIyZGM2YSIsIm5hbWUiOiJMZW9uYXJkbyIsImVtYWlsIjoidGVzdGUxQHRlc3RlLmNvbSIsImlhdCI6MTY1ODIzNTk3OSwiZXhwIjoxNjU4MjUzOTc5fQ.A4zMknJrnw8jjeVnz2vocRn73cLofOMt5pHztXwn6Xs'
  const fakePayload = {
    id: '1',
    email: 'teste@teste.com',
    name: 'teste',
  };
  
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a token when the generateToken is called', () => {
    jest.spyOn(jwt, 'sign').mockImplementation(() => fakeToken);
    const token = generateToken(fakePayload);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(token).toBeDefined();
    expect(token).toBe(fakeToken);
  });

  it('should return a payload object when the verify token is called', () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => fakePayload);
    const resultPayload = verifyToken(fakeToken);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(resultPayload).toBeDefined();
    expect(resultPayload).toEqual(fakePayload);
  });
});