import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisConnection } from './redis.connection';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';

@Injectable()
export class RedisService
  extends RedisConnection
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super(config);
  }

  onModuleInit() {
    return this.connect();
  }

  onModuleDestroy() {
    return this.disconnect();
  }

  public async saveValue(key: string, value: string) {
    // Set mappings {userId:email} (PX => milliseconds) with expiration time
    await this.client.set(key, value, 'PX', ms('30 day'));
  }

  public async getValue(key: string) {
    return this.client.get(key);
  }

  public async deleteOneByKey(key: string) {
    return this.client.del(key);
  }

  public async deleteManyByPattern(pattern: string) {
    for (const key of await this.client.keys(pattern)) {
      await this.client.del(key);
    }
  }
}
