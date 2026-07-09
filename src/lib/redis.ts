import { Redis } from '@upstash/redis'

// Initialize Redis only if URLs are provided (graceful degradation)
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    return await redis.get<T>(key)
  } catch (error) {
    console.error(`Redis Get Error for ${key}:`, error)
    return null
  }
}

export async function setCachedData(key: string, data: any, expireSeconds: number = 3600): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(key, expireSeconds, data)
  } catch (error) {
    console.error(`Redis Set Error for ${key}:`, error)
  }
}
