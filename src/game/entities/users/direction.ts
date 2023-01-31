import { Type } from 'class-transformer';

export enum DirectionType {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
}

export class Direction {
  @Type(() => String) private readonly _directions: DirectionType[] = [];

  constructor(defaultDirection = DirectionType.Right) {
    this._directions = [defaultDirection];
    this._size = 1;
  }

  @Type(() => Number) private _size = 0;
  get size() {
    return this._size;
  }

  get directions() {
    return this._directions;
  }

  valueOf() {
    return this._directions;
  }

  pop() {
    this._size--;
    return this._directions.pop();
  }

  last() {
    const direction = this._directions[this._size - 1];
    return {
      isLeft: direction === DirectionType.Left,
      isRight: direction === DirectionType.Right,
      isUp: direction === DirectionType.Up,
      isDown: direction === DirectionType.Down,
      value: direction,
    };
  }

  first() {
    const direction = this._directions[0];
    return {
      isLeft: direction === DirectionType.Left,
      isRight: direction === DirectionType.Right,
      isUp: direction === DirectionType.Up,
      isDown: direction === DirectionType.Down,
      value: direction,
    };
  }

  hasExtra() {
    return this._size > 1;
  }

  push(direction) {
    this._directions.unshift(direction);
    this._size++;
  }

  add(direction) {
    const nextDirection = this.first();
    const { Right, Left, Up, Down } = DirectionType;
    if (nextDirection !== direction) {
      if (nextDirection.isLeft && direction !== Right) this.push(direction);
      if (nextDirection.isRight && direction !== Left) this.push(direction);
      if (nextDirection.isUp && direction !== Down) this.push(direction);
      if (nextDirection.isDown && direction !== Up) this.push(direction);
    }
  }

  removeLast() {
    if (this.hasExtra()) this.pop();
  }

  peek() {
    return this.last();
  }
}
