import { Injectable } from '@nestjs/common';
import { AbstractStore } from '../abstract.store';
import { User } from '../../../game/entities/users/user';
import { RedisService } from '../../redis/redis.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class UserStoreService extends AbstractStore<User> {
  private readonly prefix = 'users:';

  constructor(private readonly redis: RedisService) {
    super();
  }

  private serialize(key: string) {
    return `${this.prefix}${key}`;
  }

  async fetchFromRedis(key: string): Promise<User> {
    const value = await this.redis.getValue(this.serialize(key));
    if (!value) return null;

    return plainToInstance(User, JSON.parse(value));
  }

  async insertToRedis(key: string, value: User): Promise<void> {
    await this.redis.saveValue(
      this.serialize(key),
      JSON.stringify(instanceToPlain(value)),
    );
  }

  async removeAll(): Promise<void> {
    await this.redis.deleteManyByPattern(this.serialize('*'));
  }
}
