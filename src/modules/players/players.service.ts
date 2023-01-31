import { PlayerStoreService } from '../store/player-store/player-store.service';
import { Player } from '../../game/entities/users/player';
import { plainToInstance } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';
import { MathUtils } from '../../common/utils/math.utils';

@Injectable()
export class PlayersService {
  constructor(private readonly store: PlayerStoreService) {}

  /**
   * Overwrites existing record when present.
   * Creates local cache record and Redis cache at the same time.
   */
  async create(_id: string, _name: string, _socketId: string) {
    const positions = [1, 2, 3, 4, 5, 6, 7];
    const rand = MathUtils.getRandomInt(50, 300);
    const shifted = positions.map((pos) => pos + rand);
    const _headId = shifted.at(-1);
    const _linearBlockIdx = new Set(shifted);
    const instance = Player.from({
      _id,
      _name,
      _socketId,
      _linearBlockIdx,
      _headId,
    });
    await this.store.insertToRedis(_id, instance);

    return this.store.setByKy(_id, instance);
  }

  /**
   * Gets record from the local cache if available,
   * otherwise fetches from Redis and update local cache.
   */
  async get(userId: string) {
    const cache = this.store.getByKey(userId);
    if (cache) return cache;

    const payload = await this.store.fetchFromRedis(userId);
    const instance = plainToInstance(Player, payload);
    this.store.setByKy(userId, instance);

    return instance;
  }
}
