import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  user: process.env.REDIS_USER,
  pass: process.env.REDIS_PASS,
  namespace: process.env.REDIS_NAMESPACE,
}));
