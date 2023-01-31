import { MathUtils } from '../../common/utils/math.utils';
import { Counter } from './counter';

export class Speed extends Counter {
  static readonly MAX_SPEED = 32; // These are delays in ms
  static readonly MIN_SPEED = 300;

  constructor() {
    super(Speed.MIN_SPEED, Speed.MIN_SPEED);
  }

  increase() {
    const increase = MathUtils.percent(this.currentValue, 30);
    const delta = this.currentValue - increase > Speed.MAX_SPEED;
    if (delta) return (this.currentValue -= increase);

    return (this.currentValue = Speed.MAX_SPEED);
  }

  decrease() {
    const decrease = MathUtils.percent(this.currentValue, 30);
    const delta = this.currentValue + decrease < Speed.MIN_SPEED;
    if (delta) return (this.currentValue += decrease);

    return (this.currentValue = Speed.MIN_SPEED);
  }
}
