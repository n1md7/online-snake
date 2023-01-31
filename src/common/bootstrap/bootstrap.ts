import { ExceptionInterceptor } from '../interceptors/exception-handler.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { RequestInterceptor } from '../interceptors/request.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory, Reflector } from '@nestjs/core';
import { configureOrigin } from './configure-origin';
import { subscribeNodeSignals } from './signals';
import { LoggerService } from '../setup/logger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module';
import * as session from 'express-session';
import { bgCyan, bold } from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { Env } from '../env';
import { join } from 'path';
import { readFileSync } from 'fs';

export const bootstrap = async () => {
  const { name, version } = JSON.parse(
    readFileSync(join(__dirname, '../../../package.json'), 'utf-8'),
  );
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get(LoggerService);
  const config = app.get(ConfigService);
  subscribeNodeSignals(logger);
  app.enableCors({
    origin: configureOrigin,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type',
    exposedHeaders: 'Authorization',
    credentials: true,
  });
  app.set('trust proxy', 1);
  app.use(
    session({
      genid: () => uuidv4(),
      saveUninitialized: true,
      cookie: { secure: false },
      secret: 'my-secret',
      resave: false,
    }),
  );
  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new RequestInterceptor(),
    new ExceptionInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useStaticAssets(join(__dirname, '../../../', 'public'));
  app.useStaticAssets(join(__dirname, '../../../', 'node_modules'));
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  const appPort = parseInt(config.get('PORT'), 10);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(appPort, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const devText = bold(`
        Application (${name}:${version}) started at: ${url}
        Swagger docs: ${url}/docs
        Mode: ${bgCyan(Env.NodeEnv)}
        Pid: ${process.pid}
    `);
    if (Env.isDev) return console.log(devText);

    logger.log(`Application started at: ${url}`, 'Bootstrap');
  });
};
