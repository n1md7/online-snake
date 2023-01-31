import * as Joi from 'joi';
import { NodeEnv } from '../types';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid(NodeEnv.TEST, NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.DEBUG)
    .label('Node environment')
    .required(),

  PORT: Joi.number()
    .positive()
    .less(65536)
    .label('Server port number')
    .required(),

  ORIGIN: Joi.string()
    .required()
    .label('Allowed Origins')
    .description('Comma-separated origin string list')
    .example('http://localhost:4200,http://localhost:3000'),

  TOKEN_SECRET: Joi.string()
    .optional()
    .label('JWT secret')
    .description('JSON Web Token secret')
    .example('aaa.bbb.ccc')
    .default('secret-word-01'),

  TOKEN_EXPIRES_IN: Joi.string()
    .optional()
    .label('JWT expiresIn value')
    .description('JSON Web Token expiration')
    .example('30m')
    .default('1 day')
    .allow(null, ''),

  REDIS_PORT: Joi.string().optional().label('Redis port').allow(null, ''),
  REDIS_HOST: Joi.string().optional().label('Redis host').allow(null, ''),
  REDIS_USER: Joi.string().optional().label('Redis user').allow(null, ''),
  REDIS_PASS: Joi.string().optional().label('Redis pass').allow(null, ''),
  REDIS_NAMESPACE: Joi.string()
    .optional()
    .label('Redis namespace/prefix')
    .description('Redis namespace, make sure it ends with colon ":"')
    .default('snake-game:')
    .regex(/^[a-z\-]*:$/)
    .allow(null, ''),
});

export const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
};
