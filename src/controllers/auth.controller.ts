import {Request, Response} from 'express';
import * as authService from '../services/auth.service';
import {getRedisConnection} from '../lib/redis';
import {AppError} from '../responses/errors';
import {StatusCode} from '../responses';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const token = await authService.createUser(req.body);

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({err: err.message});
    }

    res.status(StatusCode.SERVER_ERROR).json({err: 'An unknown error occurred'});
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const token = await authService.loginUser(req.body);

    res.status(200).json({
      message: 'User signed in successfully',
      token,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({err: err.message});
    }

    res.status(StatusCode.SERVER_ERROR).json({err: 'An unknown error occurred'});
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.sessionId) {
      return res.status(StatusCode.OK).json({message: 'No active session'});
    }

    const redisClient = await getRedisConnection();
    const sessionKey = `session:${req.user.sessionId}`;
    const existingSession = await redisClient.get(sessionKey);

    if (!existingSession) {
      return res.status(StatusCode.OK).json({message: 'Session already ended'});
    }

    await redisClient.del(sessionKey);

    return res.status(StatusCode.OK).json({message: 'Logged out successfully'});
  } catch (error: unknown) {
    let message = 'An error occurred while logging out';

    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error.message);
      message = error.message;
    }

    return res.status(StatusCode.SERVER_ERROR).json({err: message});
  }
};
