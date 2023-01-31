import { ConfigModule as NestConfigModule } from '@nestjs/config/dist/config.module';
import validationSchema, {
  validationOptions,
} from '../../validations/env-validation.schema';
import { Module } from '@nestjs/common';
import clientConfig from './clients.config';
import serviceConfig from './service.config';
import redisConfig from './redis.config';
import tokenConfig from './token.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [clientConfig, serviceConfig, redisConfig, tokenConfig],
      validationOptions,
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class ConfigModule {}
