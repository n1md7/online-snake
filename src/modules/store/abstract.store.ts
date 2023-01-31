export type StoreKey = string;

export abstract class AbstractStore<T> {
  protected readonly store: Map<StoreKey, T>;

  protected constructor(initialData: [StoreKey, T][] = []) {
    this.store = new Map<StoreKey, T>(initialData);
  }

  public has(key: StoreKey): boolean {
    return this.store.has(key);
  }

  public size() {
    return this.store.size;
  }

  public clear(): void {
    this.store.clear();
  }

  public setByKy(key: StoreKey, item: T): number {
    this.store.set(key, item);

    return this.store.size;
  }

  public getByKey(key: StoreKey): T | undefined {
    return this.store.get(key);
  }

  public removeByKey(key: StoreKey): boolean {
    return this.store.delete(key);
  }

  public fetchFromRedis(key: StoreKey): Promise<T> {
    throw 'Not Implemented (fetchFromRedis)';
  }

  public insertToRedis(key: StoreKey, item: T): Promise<void> {
    throw 'Not Implemented (insertToRedis)';
  }

  public *[Symbol.iterator]() {
    for (const [key, value] of this.store) yield { key, value };
  }

  public *values() {
    for (const [, value] of this.store) yield value;
  }

  public *keys() {
    for (const [key] of this.store) yield key;
  }
}
