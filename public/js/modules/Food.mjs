import {MathUtils} from "./utils/MathUtils.mjs";

export class Food {
  /** @type {Set<Number>} */
  #ids = new Set();
  /** @type {Grid} */
  #grid;
  /** @type {Snake} */
  #snake;

  /**
   * @param {Grid} grid
   * @param {Snake} snake
   * */
  constructor(grid, snake) {
    this.#grid = grid;
    this.#snake = snake;
  }

  get ids() {
    return this.#ids;
  }

  /**
   * @description Amount of food to be generated at once
   * @param {Number} [count = 1]
   */
  generate(count = 1) {
    for (const _ of MathUtils.numbers(1, count)) {
      const size = this.#grid.col * this.#grid.row;
      const reserved = new Set([...this.#grid.getLevelBlocks(), ...this.#snake.blocks]);
      const point = MathUtils.getRandomWithoutExcluded(0, size, reserved);
      const block = this.#grid.getBlockByLinearId(point);
      if (block) block.updateAsFood();
      this.#ids.add(point);
    }
  }

  /**
   * @description Drop food on the specific point
   * @param {Number} point - Linear index of the Grid
   */
  drop(point) {
    this.#ids.add(point);
  }
}
