import { Module } from '@nestjs/common';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SetupModule } from '../../common/setup/setup.module';
import { TokenModule } from '../token/token.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [SetupModule, TokenModule, StoreModule],
  providers: [UsersGateway, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
