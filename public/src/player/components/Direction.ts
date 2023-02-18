export enum DirectionType {
  Left = 'LEFT',
  Right = 'RIGHT',
  Up = 'UP',
  Down = 'DOWN',
}

export class Direction {
  readonly #directions: DirectionType[] = [];
  #size = 0;

  constructor(defaultDirection = DirectionType.Right) {
    this.#directions = [defaultDirection];
    this.#size = 1;
  }

  #pop() {
    this.#size--;
    return this.#directions.pop();
  }

  #last() {
    return this.#directions[this.#size - 1];
  }

  #first() {
    return this.#directions[0];
  }

  #hasExtra() {
    return this.#size > 1;
  }

  #push(direction: DirectionType) {
    this.#directions.unshift(direction);
    this.#size++;
  }

  add(direction: DirectionType) {
    const nextDirection = this.#first();
    if (nextDirection !== direction) {
      if (nextDirection === DirectionType.Right && direction !== DirectionType.Left) this.#push(direction);
      if (nextDirection === DirectionType.Up && direction !== DirectionType.Down) this.#push(direction);
      if (nextDirection === DirectionType.Down && direction !== DirectionType.Up) this.#push(direction);
      if (nextDirection === DirectionType.Left && direction !== DirectionType.Right) this.#push(direction);
    }
  }

  removeLast() {
    if (this.#hasExtra()) this.#pop();
  }

  peek(level = -1): DirectionType {
    return this.#directions?.at(level) || DirectionType.Right;
  }
}
