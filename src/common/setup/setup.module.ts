import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { RequestModule } from './request/request.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, LoggerModule, RequestModule],
})
export class SetupModule {}
