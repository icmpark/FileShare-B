import { CacheInterceptor, CACHE_KEY_METADATA, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisClient } from 'redis';

@Injectable()
export class CacheResetIntercepter extends CacheInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());

    return next.handle().pipe(tap(() => this.resetCache(cacheMetadata)));
  }

  private async resetCache(cacheKey: string): Promise<boolean> {
    const client: RedisClient = await this.cacheManager.store.getClient();

    client.keys(cacheKey + "*", async (err, reply) => {
      await Promise.all(reply.map((key) => this.cacheManager.del(key)));
    });

    return true;
  }
}