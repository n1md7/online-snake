import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
