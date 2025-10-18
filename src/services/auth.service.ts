import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import prisma from '../lib/prisma';
import {createId} from '@paralleldrive/cuid2';
import {getRedisConnection} from '../lib/redis';
import {authUserInput, createUserInput} from '../dtos/auth.dto';
import {
  AppError,
  AuthenticationError,
  ConflictError,
  InternalError,
  ResourceNotFound,
  ValidationError,
} from '../responses/errors';

export const createUser = async (input: createUserInput) => {
  try {
    const {fullName, email, role, password} = input;

    if (!fullName) throw new ValidationError('Full name is required!');

    if (!email) throw new ValidationError('Email is required!');

    if (!password) throw new ValidationError('Password is required!');

    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser) {
      throw new ConflictError('User with email exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        role,
        password: hashedPassword,
      },
    });

    const sessionId = createId();

    const jwtToken = jwt.sign(
      {userId: user.id, email: user.email, role: user.role, sessionId},
      config.jwtSecret as string,
      {
        expiresIn: '3600s',
      },
    );

    const redisClient = await getRedisConnection();

    await redisClient.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
        createdAt: Date.now(),
      }),
      {EX: 60 * 60},
    );

    return jwtToken;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error) throw new InternalError(error.message, {});
    throw new InternalError('An unknown error occurred', {});
  }
};

export const loginUser = async (input: authUserInput) => {
  const {email, password} = input;

  if (!email) throw new ValidationError('Email is required!');

  if (!password) throw new ValidationError('Password is required!');

  const existingUser = await prisma.user.findUnique({where: {email}});

  if (!existingUser) {
    throw new ResourceNotFound('Account not found!', {email});
  }

  const passwordValidated = await bcrypt.compare(password, existingUser.password);

  if (!passwordValidated) {
    throw new AuthenticationError('Invalid password');
  }

  const sessionId = createId();

  const jwtToken = jwt.sign(
    {userId: existingUser.id, email: existingUser.email, role: existingUser.role, sessionId},
    config.jwtSecret as string,
    {
      expiresIn: '3600s',
    },
  );

  const redisClient = await getRedisConnection();

  await redisClient.set(
    `session:${sessionId}`,
    JSON.stringify({
      userId: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      sessionId,
      createdAt: Date.now(),
    }),
    {EX: 60 * 60},
  );

  return jwtToken;
};
