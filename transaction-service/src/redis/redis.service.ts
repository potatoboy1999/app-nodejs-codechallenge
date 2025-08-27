import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy{
    private redisClient: Redis;

    onModuleInit() {
        this.redisClient = new Redis({
            host: 'redis',
            port: 6379,
        });

        this.redisClient.on('connect', () => console.log('🆗 Connected to Redis'));
        this.redisClient.on('error', (err) => console.error('❌ Redis error:', err));
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
        console.log('❌ Redis client disconnected');
    }

    async set(key: string, value: string, ttlInSeconds?: number) {
        if(ttlInSeconds) {
            await this.redisClient.set(key, value, 'EX', ttlInSeconds);
        } else{
            await this.redisClient.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }
    
    async del(key: string) {
        await this.redisClient.del(key);
    }

    getClient(): Redis {
        return this.redisClient;
    }
}
