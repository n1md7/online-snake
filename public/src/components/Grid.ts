import { Block } from './Block.js';
import * as PIXI from 'pixi.js';
import { MathUtils } from '../utils/Math.utils.js';

export class Grid {
  #matrix: Block[][] | null = null;
  #row = 8;
  #col = 16;

  constructor(private readonly canvas: PIXI.Application) {}

  get col() {
    return this.#col;
  }

  get row() {
    return this.#row;
  }

  get(y: number, x: number) {
    return this.#matrix?.[y]?.[x];
  }

  setRow(row: number) {
    this.#row = row;
  }

  setCol(col: number) {
    this.#col = col;
  }

  build() {
    this.#matrix = MathUtils.generateMatrix(this.#row, this.#col);
    for (let r = 0; r < this.#row; ++r) {
      for (let c = 0; c < this.#col; ++c) {
        this.#matrix[r][c] = new Block(r * Block.SIZE, c * Block.SIZE);
        this.canvas.stage.addChild(this.#matrix[r][c]);
      }
    }
  }

  /**
   * @description From the Linear index gets `row` and `col` values.
   * When `idx` is 7 and `col` is 3, that means 3 - 3 - 1. 3 rows in total.
   * 3rd row and 1st col. {row: 2, col: 0};
   *
   * @param {Number} idx - Linear index
   * @returns {{col: number, row: number}}
   */
  get2dIdx(idx: number) {
    const col = idx % this.#col;
    const row = Math.floor(idx / this.#col);

    return { row, col };
  }

  getBlockByXY(row: number, col: number) {
    return this.#matrix?.[row]?.[col] || null;
  }

  getBlockByLinearId(idx: number) {
    const { row, col } = this.get2dIdx(idx);
    return this.#matrix?.[row]?.[col] || null;
  }

  /**
   * @description Gets linear index from `row` and `col` values.
   *
   * For example: {row: 2, col: 0} will be translated into idx = 7, when COL is 3.
   * @param {Number} row
   * @param {Number} col
   * @returns {Number}
   */
  getLinearIdx(row: number, col: number) {
    return row * this.col + col;
  }

  reset() {
    console.log('%c TODO: Implement me', 'color:yellow');
  }
}
