import { populateGridBlocks } from './utils';
import { Type } from 'class-transformer';
import { Block } from './block';

export class Grid {
  static ROWS = 48; // 96;
  static COLS = 64; // 48;

  @Type(() => Block) private _blocks = populateGridBlocks(Grid.ROWS, Grid.COLS);

  get blocks() {
    return this._blocks;
  }

  static get2dIdx(idx: number) {
    const col = idx % Grid.COLS;
    const row = Math.floor(idx / Grid.COLS);

    return { row, col };
  }

  static getLinearIdx(row: number, col: number) {
    return row * Grid.COLS + col;
  }

  valueOf() {
    return this._blocks;
  }

  getBlocksBySet(ids: Set<number>) {
    const blocks: unknown[] = [];
    for (const id of ids) {
      const { row, col } = Grid.get2dIdx(id);
      this.blocks[row][col].y = row;
      this.blocks[row][col].x = col;
      blocks.push(this.blocks[row][col].serialize());
    }

    return blocks;
  }
}
