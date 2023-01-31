import { registerAs } from '@nestjs/config';

export default registerAs('clients', () => ({
  manager: process.env.MANAGER_URL,
}));
