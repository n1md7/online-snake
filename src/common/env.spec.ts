import { Env } from './env';
// NB! Test cases are executed using NODE_ENV=test (from package.json)
// so it will be always test env no matter what, unless for testing purposes process.env.NODE_ENV will be overridden

describe('Env', () => {
  it('should be defined', () => {
    expect(new Env()).toBeDefined();
  });

  it('should return the correct environment', () => {
    expect(Env.NodeEnv).toEqual('test');
  });

  it('should test isDev', function () {
    expect(Env.isDev).toBe(false);
  });

  it('should test isProd', function () {
    expect(Env.isProd).toBe(false);
  });

  it('should test isTest', function () {
    expect(Env.isTest).toBe(true);
  });

  it('should test isE2E', function () {
    expect(Env.isE2E).toBeFalsy();
  });

  it('should throw when no NODE_ENV defined', function () {
    process.env.NODE_ENV = '';
    expect(() => Env.NodeEnv).toThrowError('NODE_ENV is not defined');
  });
});
