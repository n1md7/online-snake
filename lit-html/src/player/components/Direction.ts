import { Queue } from '/src/utils/data-structures/queue';
import EventEmitter from 'eventemitter2';

export enum DirectionType {
  Left = 'LEFT',
  Right = 'RIGHT',
  Up = 'UP',
  Down = 'DOWN',
}

export default class Direction extends EventEmitter {
  private readonly _directions: Queue<DirectionType> = new Queue();

  constructor(defaultDirection = DirectionType.Right) {
    super();
    this._directions.enqueue(defaultDirection);
    this.on('go:left', this.goLeft);
    this.on('go:right', this.goRight);
    this.on('go:up', this.goUp);
    this.on('go:down', this.goDown);
  }

  get isLeft() {
    return this.valueOf() === DirectionType.Left;
  }

  get isRight() {
    return this.valueOf() === DirectionType.Right;
  }

  get isUp() {
    return this.valueOf() === DirectionType.Up;
  }

  get isDown() {
    return this.valueOf() === DirectionType.Down;
  }

  removeLast() {
    if (this._directions.length > 1) this._directions.dequeue();
  }

  valueOf(): DirectionType {
    return <DirectionType>this._directions.front();
  }

  private add(direction: DirectionType) {
    // Next direction
    const nextDirection = this._directions.back();
    if (nextDirection === direction) return;
    if (nextDirection === DirectionType.Right && direction !== DirectionType.Left)
      this._directions.enqueue(direction);
    if (nextDirection === DirectionType.Up && direction !== DirectionType.Down)
      this._directions.enqueue(direction);
    if (nextDirection === DirectionType.Down && direction !== DirectionType.Up)
      this._directions.enqueue(direction);
    if (nextDirection === DirectionType.Left && direction !== DirectionType.Right)
      this._directions.enqueue(direction);
  }

  private goLeft = () => this.add(DirectionType.Left);

  private goRight = () => this.add(DirectionType.Right);

  private goUp = () => this.add(DirectionType.Up);

  private goDown = () => this.add(DirectionType.Down);
}
