import { Injectable } from '@nestjs/common';
import { AbstractStore } from '../abstract.store';
import { Player } from '../../../game/entities/users/player';
import { RedisService } from '../../redis/redis.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class PlayerStoreService extends AbstractStore<Player> {
  private readonly prefix = 'players:';

  constructor(private readonly redis: RedisService) {
    super();
  }

  private serialize(key: string) {
    return `${this.prefix}${key}`;
  }

  async fetchFromRedis(key: string): Promise<Player> {
    const value = await this.redis.getValue(this.serialize(key));
    if (!value) return null;

    return plainToInstance(Player, JSON.parse(value));
  }

  async insertToRedis(key: string, value: Player): Promise<void> {
    await this.redis.saveValue(
      this.serialize(key),
      JSON.stringify(instanceToPlain(value)),
    );
  }
}
