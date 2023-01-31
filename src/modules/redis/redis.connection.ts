import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import * as chalk from 'chalk';

export abstract class RedisConnection {
  protected client: Redis;
  private readonly namespace: string;
  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly pass: string;

  protected constructor(protected readonly config: ConfigService) {
    this.namespace = this.config.get('redis.namespace', 'snake');
    this.port = this.config.get('redis.port', 6379);
    this.host = this.config.get('redis.host', '127.0.0.1');
    this.user = this.config.get('redis.user', undefined);
    this.pass = this.config.get('redis.pass', undefined);
  }

  public static retryStrategy(times) {
    const delay = Math.min(times * 100, 2000);
    Logger.log(
      `Redis connection failed. Retrying in ${chalk.yellow(delay)}ms.`,
      'Redis=>connect',
    );

    return delay;
  }

  public static reconnectOnError(error: Error) {
    Logger.error(
      `Redis error: ${error.message}, Reconnecting...`,
      'RedisService',
    );
    if (error.message.includes('READONLY')) {
      Logger.error(`Redis READONLY message`, 'RedisService');
      return false;
    }
    return true;
  }

  public connect() {
    this.client = new Redis({
      port: this.port,
      host: this.host,
      username: this.user,
      password: this.pass,
      keyPrefix: this.namespace,
      retryStrategy: RedisConnection.retryStrategy,
      reconnectOnError: RedisConnection.reconnectOnError,
    });

    this.client.on('connect', () => {
      Logger.log(
        `Redis connected on (${this.port}) namespace:${this.namespace}`,
        'Redis->connect',
      );
    });

    return this.client;
  }

  public disconnect() {
    this.client.disconnect();
  }
}
