import { Injectable } from '@nestjs/common';
import { AbstractStore } from '../abstract.store';
import { Game } from '../../../game/entities/game';
import { RedisService } from '../../redis/redis.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class GameStoreService extends AbstractStore<Game> {
  private readonly prefix = 'games:';

  constructor(private readonly redis: RedisService) {
    super();
  }

  private serialize(key: string) {
    return `${this.prefix}${key}`;
  }

  async fetchFromRedis(key: string): Promise<Game> {
    const value = await this.redis.getValue(this.serialize(key));
    if (!value) return null;

    return plainToInstance(Game, JSON.parse(value));
  }

  async insertToRedis(key: string, value: Game): Promise<void> {
    await this.redis.saveValue(
      this.serialize(key),
      JSON.stringify(instanceToPlain(value)),
    );
  }
}
