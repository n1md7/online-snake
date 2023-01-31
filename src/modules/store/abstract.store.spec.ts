import { AbstractStore } from './abstract.store';

describe('AbstractStore', () => {
  let store: AbstractStore<string>;

  beforeEach(() => {
    store = new (class extends AbstractStore<string> {
      constructor() {
        super([['key', 'value']]);
      }
    })();
  });

  afterEach(() => store.clear());

  it('should verify has method', () => {
    expect(store.has('key')).toBeTruthy();
    expect(store.has('wrong')).toBeFalsy();
  });

  it('should verify size method', () => {
    expect(store.size()).toBe(1);
    store.setByKy('one', 'two');
    expect(store.size()).toBe(2);
  });

  it('should verify clear method', () => {
    expect(store.size()).not.toBe(0);
    store.clear();
    expect(store.size()).toBe(0);
  });

  it('should verify setByKey method, returns updated store length', () => {
    expect(store.setByKy('hey', 'hou')).toBe(2);
    expect(store.size()).toBe(2);
  });

  it('should verify getByKey method', () => {
    expect(store.getByKey('key')).toBe('value');
  });

  it('should verify removeByKey method', () => {
    store.removeByKey('key');
    expect(store.getByKey('key')).toBeUndefined();
  });

  it('should verify Symbol.Iterator method', () => {
    expect(typeof store[Symbol.iterator]).toBe('function');
    const [firstItem] = store;
    expect(firstItem).toEqual({
      key: 'key',
      value: 'value',
    });
  });
});
