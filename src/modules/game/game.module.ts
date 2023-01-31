import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { StoreModule } from '../store/store.module';
import { PlayersModule } from '../players/players.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, PlayersModule, StoreModule],
  providers: [GameService, GameGateway],
})
export class GameModule {}
