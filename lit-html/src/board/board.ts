import { MathUtils } from '/src/utils/Math.utils.js';
import Block from '/src/board/block';

export default class Board {
  private readonly _rows: number;
  private readonly _cols: number;
  private readonly _grid: Block[];

  constructor(rows: number, cols: number) {
    this._rows = rows;
    this._cols = cols;

    this._grid = [];
    this.populate();
  }

  get rows() {
    return this._rows;
  }

  get cols() {
    return this._cols;
  }

  getBlockByIdx(index: number) {
    return this._grid[index];
  }

  resetBlock(index: number) {
    this._grid[index]?.reset();
  }

  *[Symbol.iterator]() {
    for (const block of this._grid) {
      yield block;
    }
  }

  private populate() {
    const size = this.rows * this.cols;
    for (const idx of MathUtils.numberList(0, size - 1)) {
      this._grid.push(new Block(idx));
    }
  }
}
