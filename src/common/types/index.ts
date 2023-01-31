export type JWTClaims = {
  exp: number;
  iat: number;
  iss: string;
  aud: string | string[];
  sub: string;
  typ: string;
  scope: string;
};

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  E2E = 'end2end',
  DEBUG = 'debug',
}
