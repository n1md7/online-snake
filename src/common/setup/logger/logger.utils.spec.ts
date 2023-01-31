import { LoggerUtils } from './logger.utils';
import { LogLabel, LogType } from './logger.enum';
import { NodeEnv } from '../../types';

describe('LoggerUtils', () => {
  it('should create an instance', () => {
    expect(new LoggerUtils()).toBeTruthy();
  });

  describe.each([
    ['info', 'I'],
    ['warn', 'W'],
    ['error', 'E'],
    ['debug', 'D'],
    ['trace', 'T'],
    ['fatal', 'F'],
    ['verbose', 'V'],
    ['Info', 'I'],
    ['Warn', 'W'],
    ['Error', 'E'],
    ['Debug', 'D'],
    ['Trace', 'T'],
    ['Fatal', 'F'],
    ['Verbose', 'V'],
  ])('Verify informationLetter for [%s]', (level, expected) => {
    it(`should log ${expected}`, () => {
      const result = LoggerUtils.informationLetter(level);
      expect(result).toBe(expected);
    });
  });

  describe.each([
    [LogType.DEBUG, 'debug-message'],
    [LogType.ERROR, 'error-message'],
    [LogType.WARN, 'warn-message'],
    [LogType.FATAL, 'fatal-message'],
    [LogType.INFO, 'info-message'],
    [LogType.LOG, 'trace-message'],
    [LogType.VERBOSE, 'verbose-message'],
  ])('Verify format for [%s]', (type, expected) => {
    it(`should format a message for ${type}`, () => {
      const result = LoggerUtils.format(type, LogLabel.Http, expected);
      expect(result).toMatch(new RegExp(expected));
    });
    it(`should format a message for ${type} in Dev`, () => {
      process.env.NODE_ENV = NodeEnv.DEVELOPMENT;
      const result = LoggerUtils.format(type, LogLabel.Http, expected);
      expect(result).toMatch(new RegExp(expected));
      process.env.NODE_ENV = NodeEnv.TEST;
    });
  });

  describe.each([
    ['sensitive-value', '[FILTERED]'],
    ['some-value', '[FILTERED]'],
    ['very-sensitive-and-long-value', '[FILTERED]'],
    ['a', '[FILTERED]'],
    ['', '[FILTERED]'],
  ])('Verify mask for [%s]', (value, expected) => {
    it(`should mask a value for ${value}`, () => {
      const result = LoggerUtils.mask(value);
      expect(result).toBe(expected);
    });

    it(`should mask a value for ${value} - Dev`, () => {
      process.env.NODE_ENV = NodeEnv.DEVELOPMENT;
      const result = LoggerUtils.mask(value);
      expect(result).not.toBe(expected);
      process.env.NODE_ENV = NodeEnv.TEST;
    });
  });

  describe('Verify stringify util', () => {
    it('should return plain value', function () {
      const result = LoggerUtils.stringify('value');
      expect(result).toBe('value');
    });

    it('should return stringified value for {}', function () {
      const result = LoggerUtils.stringify({});
      expect(result).toBe('{}');
    });

    it('should return stringified value for {a: b}', function () {
      const result = LoggerUtils.stringify({ a: 'b' });
      expect(result).toBe('{"a":"b"}');
    });

    it('should return stringified value for {a: b, c: d}', function () {
      const result = LoggerUtils.stringify({ a: 'b', c: 'd' });
      expect(result).toBe('{"a":"b","c":"d"}');
    });

    it('should return stringified value for {a: b, c: {e: f}}', function () {
      const result = LoggerUtils.stringify({ a: 'b', c: { e: 'f' } });
      expect(result).toBe('{"a":"b","c":{"e":"f"}}');
    });

    it('should stringify with indentation', function () {
      process.env.NODE_ENV = NodeEnv.DEVELOPMENT;
      const value = { a: 'b', c: { e: 'f' } };
      const result = LoggerUtils.stringify(value);
      const expected = JSON.stringify(value, null, 2);
      process.env.NODE_ENV = NodeEnv.TEST;
      expect(result).toBe(expected);
    });

    it('should remove bearer token value', function () {
      const value = {
        headers: {
          authorization: 'Bearer AAA.BBB.CCC',
        },
      };
      const result = LoggerUtils.stringify(value);
      const expected = JSON.stringify({
        headers: {
          authorization: 'Bearer [FILTERED]',
        },
      });
      expect(result).toBe(expected);
    });

    it('should not remove bearer token value', function () {
      process.env.NODE_ENV = NodeEnv.DEVELOPMENT;
      const value = {
        headers: {
          authorization: 'Bearer AAA.BBB.CCC',
        },
      };
      const result = LoggerUtils.stringify(value);
      const expected = JSON.stringify({
        headers: {
          authorization: 'Bearer [FILTERED]',
        },
      });
      expect(result).not.toBe(expected);
      process.env.NODE_ENV = NodeEnv.TEST;
    });
  });

  describe('Verify removeBearerToken', function () {
    it('should remove bearer token value', function () {
      const value = 'Bearer AAA.BBB.CCC';
      const result = LoggerUtils.removeBearerToken(value);
      expect(result).toBe('Bearer [FILTERED]');
    });

    it('should not remove bearer token value', function () {
      process.env.NODE_ENV = NodeEnv.DEVELOPMENT;
      const value = 'Bearer AAA.BBB.CCC';
      const result = LoggerUtils.removeBearerToken(value);
      expect(result).toBe(value);
      process.env.NODE_ENV = NodeEnv.TEST;
    });
  });
});
