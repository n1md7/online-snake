import {MathUtils} from "./utils/MathUtils.mjs";

export class Speed {
  #MAX_SPEED = 32;
  #MIN_SPEED = 300;
  /** @type {Number} */
  #current;

  /**
   * @callback Callback
   * @param {Number} delay - Current delay, actual speed would be 1000/delay in BPS
   * @returns {void}
   */

  /** @type {Callback} */
  #callback;

  /**
   * Specify default min and max delays.
   *
   * MIN delay means max speed on boost.
   * MAX delay means min speed on normal run.
   *
   * @param {Number} min - is delay, more means longer delay
   * @param {Number} max - is delay, less is faster
   * */
  constructor(min = 300, max = 32) {
    this.#MIN_SPEED = min;
    this.#MAX_SPEED = max;
    this.#current = min;
  }

  get current() {
    return this.#current;
  }

  /** @param {Callback} fn */
  onBroadcast(fn) {
    this.#callback = fn;
  }

  increase() {
    const increase = MathUtils.percent(this.#current, 30);
    if (this.#current - increase > this.#MAX_SPEED) {
      this.#current -= increase;
    } else this.#current = this.#MAX_SPEED;
    // Broadcast callback
    if (typeof this.#callback === 'function') this.#callback(this.#current);
  }

  decrease() {
    const decrease = MathUtils.percent(this.#current, 30);
    if (this.#current + decrease < this.#MIN_SPEED) {
      this.#current += decrease;
    } else this.#current = this.#MIN_SPEED;
    // Broadcast callback
    if (typeof this.#callback === 'function') this.#callback(this.#current);
  }

  reset() {
    this.#current = this.#MAX_SPEED;
  }
}
