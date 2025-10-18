import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import {getRedisConnection} from '../lib/redis';
import {RoleType} from '@prisma/client';
import {AuthenticationError} from '../responses/errors';

interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
  iat: number;
  exp: number;
  sub?: string;
  jti?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUserPayload;
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return new AuthenticationError('No token provided!');
      // return res.status(401).json({
      //   status: 'error',
      //   message: 'No token provided',
      // });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return new AuthenticationError('No token provided!');
    }

    if (!config.jwtSecret) {
      throw new Error('JWT secret is not configured');
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtUserPayload;

      if (!decoded.userId) {
        throw new jwt.JsonWebTokenError('Invalid token payload');
      }

      const sessionKey = `session:${decoded.sessionId}`;

      const redisClient = await getRedisConnection();

      const exists = await redisClient.get(sessionKey);

      if (!exists) return res.status(401).json({error: 'Session revoked'});

      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token',
        });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          status: 'error',
          message: 'Token expired',
        });
      }
      throw error;
    }
  } catch (error: unknown) {
    let message = 'An unexpected error occurred';

    if (error instanceof Error) {
      message = error.message;
    }

    return res.status(500).json({
      status: 'error',
      message,
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (req.user.role !== RoleType.ADMIN) {
    return res.status(403).json({
      error: 'Forbidden - Admin access required',
      role: req.user.role,
    });
  }

  next();
};
