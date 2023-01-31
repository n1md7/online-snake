import { Module } from '@nestjs/common';
import { PlayerStoreService } from './player-store/player-store.service';
import { GameStoreService } from './game-store/game-store.service';
import { UserStoreService } from './user-store/user-store.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [UserStoreService, PlayerStoreService, GameStoreService],
  exports: [UserStoreService, PlayerStoreService, GameStoreService],
})
export class StoreModule {}
