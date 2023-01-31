import { delay, randomFromArray } from './utils';

test('RandomFromArray', () => {
  const array = [1, 2, 3, 4, 5];
  const randomValue = randomFromArray(array);
  expect(randomValue).toEqual(expect.any(Number));
  expect(array.includes(randomValue)).toBeTruthy();
});

describe.each`
  ttd
  ${10}
  ${100}
  ${101}
  ${200}
  ${300}
  ${500}
  ${800}
`('delay( $ttd )', ({ ttd }) => {
  it(`should resolve after ${ttd} milliseconds delay - sync`, () => {
    const start = Date.now();
    return delay(ttd).then(() => {
      const end = Date.now() + 10;
      expect(end - start).toBeGreaterThanOrEqual(ttd);
    });
  });

  it(`should resolve after ${ttd} milliseconds delay - callback`, (done) => {
    const start = Date.now();
    delay(() => {
      const end = Date.now() + 10;
      expect(end - start).toBeGreaterThanOrEqual(ttd);
      done();
    }, ttd);
  });
});
