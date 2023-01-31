import { MathUtils } from '../../../common/utils/math.utils';
import { Grid } from './grid';
import { Player } from '../users/player';
import { Transform, Type } from 'class-transformer';

export class Food {
  @Type(() => Number)
  @Transform(({ value }) => new Set(value))
  protected readonly _ids = new Set();

  get ids() {
    return this._ids;
  }

  generate(grid: Grid, players: Player[], count = 1) {
    let i = 0;
    const points: number[] = [];
    while (++i <= count) {
      const size = Grid.COLS * Grid.ROWS;
      const reserved = new Set<number>();
      for (const player of players) {
        for (const idx of player.blockIndices()) reserved.add(idx);
      }
      const point = MathUtils.getRandomWithoutExcluded(0, size, reserved);
      const { row, col } = Grid.get2dIdx(point);
      const block = grid?.[row]?.[col];
      if (block) block.updateAsFood();
      this.drop(point);
      points.push(point);
    }

    return points;
  }

  /**
   * @description Drop food on the specific point
   * @param {Number} point - Linear index of the Grid
   */
  drop(point) {
    this._ids.add(point);
  }
}
