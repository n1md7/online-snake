import { Injectable, Logger } from '@nestjs/common';
import { GameStoreService } from '../store/game-store/game-store.service';
import { Game } from '../../game/entities/game';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  private logger: Logger;

  constructor(private readonly store: GameStoreService) {
    this.logger = new Logger('GameService');
  }

  /**
   * Creates local cache record and Redis cache at the same time.
   * Overwrites existing record when present.
   */
  async create(_id: string, _name: string, _createdBy: string) {
    const game = Game.from({ _id, _name, _createdBy });
    await this.store.insertToRedis(_id, game);

    return this.store.setByKy(_id, game);
  }

  /**
   * Updates Redis cache.
   * Overwrites existing record when present.
   */
  async update(id: string, game: Game) {
    await this.store.insertToRedis(id, game);
  }

  /**
   * Gets record from the local cache if available,
   * otherwise fetches from Redis.
   */
  async get(userId: string) {
    const cache = this.store.getByKey(userId);
    if (cache) return cache; // Local cache

    const plain = await this.store.fetchFromRedis(userId);
    const instance = plainToInstance(Game, plain);
    this.store.setByKy(userId, instance);

    return instance;
  }

  generateId() {
    return uuidv4();
  }
}
