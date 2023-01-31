export class Direction {
  static Type = {
    Left: 'Left',
    Right: 'Right',
    Up: 'Up',
    Down: 'Down',
  };

  /** @type {Direction.Type[]} */
  #directions = [];
  /** @type {Number} */
  #size = 0;

  /** @param {Direction.Type} defaultDirection */
  constructor(defaultDirection = Direction.Type.Right) {
    this.#directions = [defaultDirection];
    this.#size = 1;
  }

  /** @returns {Direction.Type} */
  #pop() {
    this.#size--;
    return this.#directions.pop();
  }

  /** @returns {Direction.Type} */
  #last() {
    return this.#directions[this.#size - 1];
  }

  /** @returns {Direction.Type} */
  #first() {
    return this.#directions[0];
  }

  /** @returns {boolean} */
  #hasExtra() {
    return this.#size > 1;
  }

  /** @param {Direction.Type} direction */
  #push(direction) {
    this.#directions.unshift(direction);
    this.#size++;
  }

  /** @param {Direction.Type} direction */
  add(direction) {
    const nextDirection = this.#first();
    if (nextDirection !== direction) {
      if (nextDirection === Direction.Type.Left && direction !== Direction.Type.Right) this.#push(direction);
      if (nextDirection === Direction.Type.Right && direction !== Direction.Type.Left) this.#push(direction);
      if (nextDirection === Direction.Type.Up && direction !== Direction.Type.Down) this.#push(direction);
      if (nextDirection === Direction.Type.Down && direction !== Direction.Type.Up) this.#push(direction);
    }
  }

  /** @returns {Direction.Type} */
  removeLast() {
    if (this.#hasExtra()) this.#pop();
  }

  /** @returns {Direction.Type} */
  peek() {
    return this.#last();
  }
}
