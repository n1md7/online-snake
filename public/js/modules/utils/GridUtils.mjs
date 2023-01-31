export class GridUtils {
  /**
   * @param {Number} row
   * @param {Number} col
   */
  constructor(row, col) {
    this.col = col;
    this.row = row;
  }

  /**
   * @description Gets linear index from `row` and `col` values.
   *
   * For example: {row: 2, col: 0} will be translated into idx = 7, when COL is 3.
   * @param {Number} row
   * @param {Number} col
   * @returns {Number}
   */
  getLinearIdx(row, col) {
    return row * this.col + col;
  };

  /**
   * @description From the Linear index gets `row` and `col` values.
   * When `idx` is 7 and `col` is 3, that means 3 - 3 - 1. 3 rows in total.
   * 3rd row and 1st col. {row: 2, col: 0};
   *
   * @param {Number} idx - Linear index
   * @returns {{col: number, row: number}}
   */
  get2dIdx(idx) {
    const col = idx % this.col;
    const row = Math.floor(idx / this.col);

    return {row, col};
  };

}
