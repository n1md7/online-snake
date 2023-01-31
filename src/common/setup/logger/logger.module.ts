import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { RequestModule } from '../request/request.module';

@Global()
@Module({
  imports: [RequestModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
