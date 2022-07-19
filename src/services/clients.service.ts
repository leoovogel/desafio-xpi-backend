import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { compare, hash } from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../database/prismaClient';
import HttpException from '../utils/httpException';
import { generateToken } from '../utils/token';

interface IRegisterClient {
  name: string;
  email: string;
  password: string;
}

interface ILoginClient {
  email: string;
  password: string;
}

export async function registerClient({ email, password, name }: IRegisterClient) {
  const encryptedPassword = await hash(password, 10);

  try {
    await prisma.client.create({
      data: {
        email,
        password: encryptedPassword,
        name,
        account: {
          create: { },
        },
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new HttpException('Email already registered', StatusCodes.BAD_REQUEST);
    }
    throw new HttpException('Email already registered', StatusCodes.BAD_REQUEST);
  }
}

export async function loginClient({ email, password }: ILoginClient) {
  const client = await prisma.client.findUnique({ where: { email } });

  if (!client) {
    throw new HttpException('Email or password incorrect', StatusCodes.BAD_REQUEST);
  }

  const isPasswordCorrect = await compare(password, client.password);

  if (!isPasswordCorrect) {
    throw new HttpException('Email or password incorrect', StatusCodes.BAD_REQUEST);
  }

  return generateToken({ id: client.id, name: client.name, email: client.email });
}
