export class Point {
  /** @type {Number} */
  #point;

  /**
   * @callback Callback
   * @param {Number} point - Current point
   * @returns {void}
   */

  /** @type {Callback} */
  #callback;

  /**
   * @param {Number} point
   */
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
  onBroadcast(fn) {
    this.#callback = fn;
  }
}
