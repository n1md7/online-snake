import {Block} from "./Block.mjs";
import {GridUtils} from "./utils/GridUtils.mjs";
import {Levels} from "./Levels.mjs";

export class Grid extends GridUtils {
  /** @type {Block[][]} */
  #grid = null;
  /** @type {GameUI} */
  #gameUI = null;
  /** @type {Number} */
  #level = 0;
  /** @type {Number} */
  #block = 10;

  /**
   * @param {Number} row
   * @param {Number} col
   * @param {Number} block
   * @param {GameUI} gameUI
   */
  constructor(row, col, block, gameUI) {
    super(row, col);
    this.#block = block;
    this.#gameUI = gameUI;

    this.#populateEmptyGrid();
    this.#updateGridWithBlocks();
  }

  get level() {
    return this.#level;
  }

  #populateEmptyGrid() {
    this.#grid = Array(this.row).fill(0).map(() => Array(this.col).fill(0));
  }

  #updateGridWithBlocks() {
    for (const [rowIdx, row] of this.#grid.entries()) {
      for (const colIdx of row.keys()) {
        const block = new Block(this.#gameUI, this.#block);
        this.#grid[rowIdx][colIdx] = block;
        const index = this.getLinearIdx(rowIdx, colIdx);
        block.setIndex(index);
        block.setDataIdx(index);
        block.setType(Block.type.Empty);
        block.render();
      }
    }
  }

  /**
   @param {Number} row
   @param {Number} col
   @returns {Block | null}
   */
  getBlockByXY(row, col) {
    return this.#grid?.[row]?.[col];
  }

  /**
   @param {Number} idx
   @returns {Block | null}
   */
  getBlockByLinearId(idx) {
    const {row, col} = this.get2dIdx(idx);
    return this.#grid?.[row]?.[col];
  }

  reset() {
    this.#gameUI.clearBlocks();
    this.#populateEmptyGrid();
    this.#updateGridWithBlocks();
  }
}
