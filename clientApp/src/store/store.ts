import EventEmitter from 'eventemitter2';

export default abstract class Store<T = unknown> extends EventEmitter {
  getValue(): T {
    try {
      return JSON.parse(localStorage.getItem(this.KEY()) || '') as T;
    } catch (e) {
      console.warn('Invalid JSON', (<Error>e).message);
      return {} as T;
    }
  }

  setValue(payload: Partial<T>) {
    const newValue = { ...this.getValue(), ...payload };
    const stringified = JSON.stringify(newValue);
    localStorage.setItem(this.KEY(), stringified);
    this.emit('change', newValue);
  }

  protected KEY() {
    return 'Default-KEY';
  }
}
