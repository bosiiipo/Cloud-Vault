import 'express-serve-static-core';

// JWT payload interface for authentication
interface JwtUserPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  sub?: string;
  jti?: string;
}

import 'express';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: {
      userId: string;
      businessId: string;
    };
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}

export {};
