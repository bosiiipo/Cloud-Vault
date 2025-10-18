import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
  saltFactor: process.env.SALT_FACTOR,
  otpRetryCount: process.env.OTP_RETRY_COUNT,
  api: process.env.API,
  nodeEnv: process.env.NODE_ENV,
  r2Endpoint: process.env.R2_ENDPOINT,
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  s3Bucket: process.env.S3_BUCKET
};
