import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcrypt";

import { loginClient, registerClient } from "../../src/services/clients.service";
import { prisma } from "../../src/database/prismaClient";
import * as tokenUtils from "../../src/utils/token";
import { mockClientBody, mockCreatedClient } from "../mocks";

jest.mock("bcrypt")
jest.mock("../../src/utils/token")

describe('Clients service -> registerClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should register a client in the client table and not throw any error', async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue(mockCreatedClient.password as never);
    jest.spyOn(prisma.client, "create").mockResolvedValue(mockCreatedClient);
  
    await registerClient(mockClientBody)

    expect(bcrypt.hash).toHaveBeenCalledWith(mockClientBody.password, 10);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);

    expect(prisma.client.create).toHaveBeenCalledTimes(1);
    expect(prisma.client.create).toHaveBeenCalledWith({
      data: {
        ...mockClientBody,
        password: mockCreatedClient.password,
        Account: { create: { } }
      }
    })
  });

  it('should throw an error if email is already registered', async () => {
    jest.spyOn(prisma.client, "create").mockRejectedValue(new PrismaClientKnownRequestError("Email already registered", "P2002", "4.0.0"));

    expect(async () => {
      await registerClient(mockClientBody)
    }).rejects.toThrow("Email already registered");
  });

  it('should throw an error if for some reason the user was not registered', async () => {
    jest.spyOn(prisma.client, "create").mockRejectedValue(new Error("Some error"));

    expect(async () => {
      await registerClient(mockClientBody)
    }).rejects.toThrow("Internal Server error");
  });
});

describe('Clients service -> loginClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a valid token if the email and password is valid', async () => {
    jest.spyOn(prisma.client, "findUnique").mockResolvedValue(mockCreatedClient);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    jest.spyOn(tokenUtils, "generateToken").mockReturnValue("fakeToken");

    const token = await loginClient(mockClientBody)

    expect(prisma.client.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { email: mockClientBody.email } });

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(mockClientBody.password, mockCreatedClient.password);

    expect(token).toBeDefined();
    expect(token).toBe('fakeToken');
  });

  it('should throw an error if a client with the informed email is not found', async () => {
    jest.spyOn(prisma.client, "findUnique").mockResolvedValue(null);

    expect(async () => {
      await loginClient(mockClientBody)
    }).rejects.toThrow("Email or password incorrect");
  });

  it('should throw an error if the password entered is not correct', async () => {
    jest.spyOn(prisma.client, "findUnique").mockResolvedValue(mockCreatedClient);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    expect(async () => {
      await loginClient(mockClientBody)
    }).rejects.toThrow("Email or password incorrect");
  });
});