import {createClient} from 'redis';
import Logger from 'bunyan';
import {config} from '@/root/config';

export type RedisClient = ReturnType<typeof createClient>;

class BaseCache {
  client: RedisClient;
  log: Logger;

  constructor(cacheName: string) {
    this.client = createClient({
      url: config.REDIS_HOST
    });
    this.log = config.createLogger(cacheName);
    this.cacheRedisError();
  }


  private cacheRedisError() {
    this.client.on('error',error=>{
      this.log.error('error on cache', error);
    });
  }
}

export default BaseCache;
