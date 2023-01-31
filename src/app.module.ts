import { Module, Logger } from '@nestjs/common';
import { SetupModule } from './common/setup/setup.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { TokenModule } from './modules/token/token.module';
import { StoreModule } from './modules/store/store.module';
import { GameModule } from './modules/game/game.module';
import { RedisModule } from './modules/redis/redis.module';
import { PlayersModule } from './modules/players/players.module';

@Module({
  imports: [
    SetupModule,
    HealthModule,
    UsersModule,
    TokenModule,
    StoreModule,
    GameModule,
    RedisModule,
    PlayersModule,
  ],
})
export class AppModule {}
