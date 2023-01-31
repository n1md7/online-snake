import { registerAs } from '@nestjs/config';

export default registerAs('service', () => ({
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  secret: process.env.SECRET,
}));
