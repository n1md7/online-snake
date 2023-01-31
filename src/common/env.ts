import { NodeEnv } from './types';

export class Env {
  public static get NodeEnv(): NodeEnv {
    const env = String(process.env.NODE_ENV || '').trim() as NodeEnv;
    if (!env) throw new TypeError('NODE_ENV is not defined');

    return env;
  }

  public static get isDev() {
    return Env.NodeEnv === NodeEnv.DEVELOPMENT;
  }

  public static get isProd() {
    return Env.NodeEnv === NodeEnv.PRODUCTION;
  }

  /**
   * Environment for unit tests
   */
  public static get isTest() {
    return Env.NodeEnv === NodeEnv.TEST;
  }

  /**
   * Environment for E2E tests
   */
  public static get isE2E() {
    return process.env.E2E === NodeEnv.E2E;
  }
}
