import { MathUtils } from '/src/utils/Math.utils';
import EventEmitter from 'eventemitter2';

export default class Speed extends EventEmitter {
  private MAX_SPEED = 32;
  private MIN_SPEED = 300;

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
    super();
    this.MIN_SPEED = min;
    this.MAX_SPEED = max;
    this._current = min;
  }

  private _current: number;

  get current() {
    return this._current;
  }

  setMin(min: number) {
    this.MIN_SPEED = min;
  }

  setMax(max: number) {
    this.MAX_SPEED = max;
  }

  setCurrent(current: number) {
    this._current = current;
  }

  increase() {
    const increase = MathUtils.percent(this._current, 30);
    const delta = this._current - increase;
    if (delta > this.MAX_SPEED) this._current -= increase;
    else this._current = this.MAX_SPEED;

    this.emit('change', this._current);
  }

  decrease() {
    const decrease = MathUtils.percent(this._current, 30);
    const delta = this._current + decrease;
    if (delta < this.MIN_SPEED) this._current += decrease;
    else this._current = this.MIN_SPEED;

    this.emit('change', this._current);
  }

  reset() {
    this._current = this.MAX_SPEED;
  }
}
