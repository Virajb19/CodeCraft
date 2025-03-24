import { Redis } from 'ioredis'

export let redis: Redis

if(process.env.NODE_ENV === 'production') {
   redis = new Redis({
    host: process.env.UPSTASH_REDIS_URL!,
    password: process.env.UPSTASH_REDIS_PASSWORD!,
    tls: {},
    connectTimeout: 10000,
    keepAlive: 1000
  })
} else {
  redis = new Redis({
    host: 'localhost',
    port: 6379
  })
}