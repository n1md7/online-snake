import EventEmitter from 'eventemitter2';

export default class Counter extends EventEmitter {
  constructor(defaultValue = 0) {
    super();
    this._value = defaultValue;
  }

  private _value: number;

  get value() {
    return this._value;
  }

  valueOf() {
    return this._value;
  }

  add(value: number) {
    this.emit('change', (this._value += value));
  }

  subtract(value: number) {
    this.emit('change', (this._value -= value));
  }

  increment() {
    this.emit('change', ++this._value);
  }

  decrement() {
    this.emit('change', --this._value);
  }
}
