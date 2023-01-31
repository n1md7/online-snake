import {Snake} from "./Snake.mjs";
import {MathUtils} from "./utils/MathUtils.mjs";
import {Speed} from "./Speed.mjs";
import {Direction} from "./Direction.mjs";

export class Bot extends Snake {
  /** @type {Number} */
  #timeoutId = -1;
  /** @type {Grid} */
  #grid;
  /** @type {{col: Number, row: Number, idx: Number} | null} */
  #targetLocation;

  /**
   * @param {Grid} grid
   * @param {Number} spawnIndex
   * @param {Speed} speed
   * @param {Point} point
   * @param {String} color
   * @param {String} name
   */
  constructor(grid, spawnIndex, speed, point, color, name) {
    const rand = MathUtils.getRandomInt(0, 128);
    const body = MathUtils.numberList(spawnIndex + rand, spawnIndex + rand + 3);
    super(body, grid, speed, point, color, name);
    this.#grid = grid;
  }

  get isBot() {
    return true;
  }

  run() {
    this.#targetLocation ||= this.find(16);
    if(this.#targetLocation !== null) {
      const current = this.nextIndex();
      while (this.#targetLocation.row !== current.row && this.#targetLocation.col !== current.col) {
        if (current.row > this.#targetLocation.row) {
          current.row--;
          this.goUp();
        } else if (current.row < this.#targetLocation.row) {
          current.row++;
          this.goDown();
        } if (current.col > this.#targetLocation.col) {
          current.col--;
          this.goLeft();
        } else if (current.col < this.#targetLocation.col) {
          current.col++;
          this.goRight();
        }
      }
      this.increaseSpeed();
      this.#targetLocation = null;
    } else {
      this.decreaseSpeed();
      const random = MathUtils.getRandomInt(0, 3);
      if (random === 0) this.goUp();
      if (random === 1) this.goDown();
      if (random === 2) this.goLeft();
      if (random === 3) this.goRight();
    }
    // this.#timeoutId = setTimeout(this.run.bind(this), MathUtils.getRandomInt(500, 3000));
    this.#timeoutId = setTimeout(this.run.bind(this), 1000);
  }

  /**
   * @description Find food coordinates if there is one nearby
   * @param {Number} [depth = 5] how far can run the DFS
   * @returns {{col: Number, row: Number, idx: Number} | null}
   */
  find(depth = 5) {
    /** @type {Set<Number>} */
    const visited = new Set();
    const next = this.nextIndex();
    /** @type {{row: Number, col: Number, level: Number}[]} */
    const stack = [{row: next.row, col: next.col, level: 0}];
    while (stack.length > 0) {
      const {row, col, level} = stack.pop();
      const idx = this.#grid.getLinearIdx(row, col);
      if (visited.has(idx) || level > depth) continue;
      const block = this.#grid.getBlockByLinearId(idx);
      if (!block) continue;
      if (block.isFood()) return {row, col, idx: this.#grid.getLinearIdx(row, col)};
      if (this.direction === Direction.Type.Right) {
        Array.prototype.push.apply(stack, [
          {row: row - 1, col: col + 1, level: level + 1},
          {row: row * 1, col: col + 1, level: level + 1},
          {row: row + 1, col: col + 1, level: level + 1},
        ]);
      } else if (this.direction === Direction.Type.Left) {
        Array.prototype.push.apply(stack, [
          {row: row - 1, col: col - 1, level: level + 1},
          {row: row * 1, col: col - 1, level: level + 1},
          {row: row + 1, col: col - 1, level: level + 1},
        ]);
      } else if (this.direction === Direction.Type.Up) {
        Array.prototype.push.apply(stack, [
          {row: row - 1, col: col - 1, level: level + 1},
          {row: row - 1, col: col * 1, level: level + 1},
          {row: row - 1, col: col + 1, level: level + 1},
        ]);
      } else if (this.direction === Direction.Type.Down) {
        Array.prototype.push.apply(stack, [
          {row: row + 1, col: col - 1, level: level + 1},
          {row: row + 1, col: col * 1, level: level + 1},
          {row: row + 1, col: col + 1, level: level + 1},
        ]);
      }
      visited.add(idx);
    }

    return null;
  }

  stop() {
    super.stop();
    clearTimeout(this.#timeoutId);
  }
}
