import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  expiresIn: process.env.TOKEN_EXPIRES_IN,
  secret: process.env.TOKEN_SECRET,
}));
