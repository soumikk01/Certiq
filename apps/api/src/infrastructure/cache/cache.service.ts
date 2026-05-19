import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const CACHE_KEYS = {
  certificate: (id: string) => `cert:${id}`,
  certificateList: (userId: string) => `cert-list:${userId}`,
  presignedUrl: (objectKey: string) => `presigned:${objectKey}`,
} as const;

export const CACHE_TTL = {
  certificate: 300, // 5 minutes
  certificateList: 60, // 1 minute
  presignedUrl: 3300, // 55 minutes
} as const;

const OPERATION_TIMEOUT_MS = 500;

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });

    this.redis.on('error', (err: Error) => {
      this.logger.warn(`Redis connection error: ${err.message}`);
    });

    this.redis.connect().catch((err: Error) => {
      this.logger.warn(`Redis initial connection failed: ${err.message}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit().catch(() => {});
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.withTimeout(this.redis.get(key));
      if (raw === null || raw === undefined) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      this.logger.warn(
        `Cache GET failed for key "${key}": ${(error as Error).message}`,
      );
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.withTimeout(this.redis.set(key, serialized, 'EX', ttlSeconds));
    } catch (error) {
      this.logger.warn(
        `Cache SET failed for key "${key}": ${(error as Error).message}`,
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.withTimeout(this.redis.del(key));
    } catch (error) {
      this.logger.warn(
        `Cache DEL failed for key "${key}": ${(error as Error).message}`,
      );
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const result = await this.withTimeout(
          this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100),
        );
        cursor = result[0];
        const keys = result[1];
        if (keys.length > 0) {
          await this.withTimeout(this.redis.del(...keys));
        }
      } while (cursor !== '0');
    } catch (error) {
      this.logger.warn(
        `Cache DEL pattern failed for "${pattern}": ${(error as Error).message}`,
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const result = await this.withTimeout(this.redis.ping());
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  private withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Redis operation timed out')),
          OPERATION_TIMEOUT_MS,
        ),
      ),
    ]);
  }
}
