import { Redis } from 'ioredis'

export let redis: Redis

if(process.env.NODE_ENV === 'developnment') {
      redis = new Redis({
        host: 'localhost',
        port: 6379
      })
}