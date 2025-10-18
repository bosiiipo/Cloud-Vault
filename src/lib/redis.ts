import { createClient, RedisClientType } from 'redis';

const REDIS_PATH = process.env.REDIS_PATH || 'redis://127.0.0.1:6379';
// const REDIS_PATH = 'redis://127.0.0.1:6379';

let redisClient: RedisClientType | null = null;

export const getRedisConnection = async (): Promise<RedisClientType> => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  redisClient = createClient({ url: REDIS_PATH });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  await redisClient.connect();
  console.log('Redis connected!');
  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    console.log('🔌 Redis disconnected');
    redisClient = null;
  }
};
