import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  // skip redis init in prod.
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
    console.warn('Skipping Redis connection: REDIS_URL is not defined.');
    return;
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export default redisClient;
