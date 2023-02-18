import { Nullable } from '../../types.js';

type Callback = (point: number) => void;

export class Point {
  #point: number;

  /**
   * @callback Callback
   * @param {Number} point - Current point
   * @returns {void}
   */

  /** @type {Callback} */
  #callback: Nullable<Callback> = null;

  constructor(point = 0) {
    this.#point = point;
  }

  get point() {
    return this.#point;
  }

  valueOf() {
    return this.#point;
  }

  increment() {
    this.#point++;
    if (typeof this.#callback === 'function') this.#callback(this.#point);
  }

  decrement() {
    this.#point--;
    if (typeof this.#callback === 'function') this.#callback(this.#point);
  }

  /** @param {Callback} fn */
  onBroadcast(fn: Callback) {
    this.#callback = fn;
  }
}
