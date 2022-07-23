import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcrypt";

import { loginClient, registerClient } from "../../src/services/clients.service";
import { prisma } from "../../src/database/prismaClient";
import * as tokenUtils from "../../src/utils/token";

jest.mock("bcrypt")
jest.mock("../../src/utils/token")

const fakeClientBody = {
  name: "Fake Client",
  email: "fake@client.com",
  password: "fakePassword"
}

const fakeCreatedClient = {
  id: "cl5ur7xpo00005eo0qvml515a",
  name: "Fake Client",
  email: "fake@client.com",
  password: "$2b$10$X8ggUZTGc00CPmQ.m9gaous2UQ2mv4r1TQyeLNgQGATGngAFvpkBy"
}

describe('Clients service -> registerClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should register a client in the client table and not throw any error', async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue(fakeCreatedClient.password as never);
    jest.spyOn(prisma.client, "create").mockResolvedValue(fakeCreatedClient);
  
    await registerClient(fakeClientBody)

    expect(bcrypt.hash).toHaveBeenCalledWith(fakeClientBody.password, 10);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);

    expect(prisma.client.create).toHaveBeenCalledTimes(1);
    expect(prisma.client.create).toHaveBeenCalledWith({
      data: {
        ...fakeClientBody,
        password: fakeCreatedClient.password,
        Account: { create: { } }
      }
    })
  });

  it('should throw an error if email is already registered', async () => {
    jest.spyOn(prisma.client, "create").mockRejectedValue(new PrismaClientKnownRequestError("Email already registered", "P2002", "4.0.0"));

    expect(async () => {
      await registerClient(fakeClientBody)
    }).rejects.toThrow("Email already registered");
  });

  it('should throw an error if for some reason the user was not registered', async () => {
    jest.spyOn(prisma.client, "create").mockRejectedValue(new Error("Some error"));

    expect(async () => {
      await registerClient(fakeClientBody)
    }).rejects.toThrow("Internal Server error");
  });
});

describe('Clients service -> loginClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a valid token if the email and password is valid', async () => {
    jest.spyOn(prisma.client, "findUnique").mockResolvedValue(fakeCreatedClient);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    jest.spyOn(tokenUtils, "generateToken").mockReturnValue("fakeToken");

    const token = await loginClient(fakeClientBody)

    expect(prisma.client.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { email: fakeClientBody.email } });

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(fakeClientBody.password, fakeCreatedClient.password);

    expect(token).toBeDefined();
    expect(token).toBe('fakeToken');
  });

  it('should throw an error if a client with the informed email is not found', async () => {
    jest.spyOn(prisma.client, "findUnique").mockResolvedValue(null);

    expect(async () => {
      await loginClient(fakeClientBody)
    }).rejects.toThrow("Email or password incorrect");
  });

  it('should throw an error if the password entered is not correct', async () => {
    jest.spyOn(prisma.client, "findUnique").mockResolvedValue(fakeCreatedClient);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    expect(async () => {
      await loginClient(fakeClientBody)
    }).rejects.toThrow("Email or password incorrect");
  });
});