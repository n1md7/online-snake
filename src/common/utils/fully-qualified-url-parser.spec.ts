import { FullyQualifiedUrlParser } from './fully-qualified-url.parser';

describe.each([
  ['redis://host', { host: 'host', protocol: 'redis://' }],
  ['amqp://host', { host: 'host', protocol: 'amqp://' }],
  [
    'redis://127.0.0.1:1234',
    { host: '127.0.0.1', port: 1234, protocol: 'redis://' },
  ],
  ['amqp://host:1234', { host: 'host', port: 1234, protocol: 'amqp://' }],
  [
    'redis://usr:pwd@host:1234',
    {
      host: 'host',
      port: 1234,
      protocol: 'redis://',
      password: 'pwd',
      username: 'usr',
    },
  ],
  [
    'redis://usr:pwd@host.com:12345',
    { host: 'host.com', port: 12345, protocol: 'redis://', password: 'pwd' },
  ],
  [
    'redis://usr-name_123:L*em*Ml40uFRZ0V7K&66WWc7BBat2N21UwPVfIG@host.com:1234',
    {
      username: 'usr-name_123',
      host: 'host.com',
      port: 1234,
      protocol: 'redis://',
      password: 'L*em*Ml40uFRZ0V7K&66WWc7BBat2N21UwPVfIG',
    },
  ],
])('should parse the url for [%o]', (urlToParse, expectedParsedObject) => {
  it(`Returns Javascript object which should be: ${JSON.stringify(
    expectedParsedObject,
  )}`, () => {
    expect(new FullyQualifiedUrlParser(urlToParse).asObject).toEqual(
      expect.objectContaining(expectedParsedObject),
    );
  });
});

test('should throw an error if the url is not valid', () => {
  expect(
    () => new FullyQualifiedUrlParser('redis://usr:p@ssword@@host:1234'),
  ).toThrowError('Symbol @ should appear no more than 1 time');
});

test('should throw an error if the url is not defined', () => {
  expect(() => new FullyQualifiedUrlParser('')).toThrowError(
    'FullyQualifiedUrlParser: url is required',
  );
});

test('should throw an error if the url is invalid', () => {
  expect(() => new FullyQualifiedUrlParser('invalid 😈')).toThrowError(
    'FullyQualifiedUrlParser: url is invalid',
  );
});
