import { plainToInstance, Transform, Type } from 'class-transformer';
import { Direction, DirectionType } from './direction';
import { Logger } from '@nestjs/common';
import { Block } from '../grid/block';
import { Grid } from '../grid/grid';
import { Points } from '../points';
import { Speed } from '../speed';

enum PlayerStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Idle = 'Idle',
  AdBreak = 'AdBreak',
  Suicide = 'Suicide',
  KilledInAction = 'KilledInAction',
}

export class Player {
  @Type(() => Number)
  @Transform(({ value }) => new Set(value))
  private readonly _linearBlockIdx: Set<number> = new Set();

  @Type(() => Number) private _snacksToDigest = 0;
  @Type(() => Number) private _lastTick = Date.now();
  @Type(() => String) private _name: string;
  @Type(() => String) private _socketId: string;
  @Type(() => String) private _status = PlayerStatus.Active;
  @Type(() => Block) private _headBlock: Block;
  @Type(() => Direction) private _direction = new Direction();
  @Type(() => Boolean) private _accelerate = false;

  @Type(() => String) private _id: string;
  get id() {
    return this._id;
  }

  @Type(() => Speed) private _speed = new Speed();
  get speed() {
    return this._speed;
  }

  @Type(() => Points) private _points = new Points();
  get points() {
    return this._points;
  }

  @Type(() => Number) _headId = 0;
  get headId() {
    return this._headId;
  }

  get accelerateRequested() {
    return this._accelerate;
  }

  static from(payload: Partial<Player> | unknown) {
    return plainToInstance(Player, payload);
  }

  getStatus() {
    return this._status;
  }

  needsUpdate(currentTick: number) {
    if (currentTick - this._lastTick > this._speed.value()) {
      this._lastTick = currentTick;
      return true;
    }

    return false;
  }

  isActive() {
    return this._status === PlayerStatus.Active;
  }

  increaseSpeed() {
    this._accelerate = true;
  }

  decreaseSpeed() {
    this._accelerate = false;
  }

  addTailBlock(weight = 1) {
    this._snacksToDigest += weight;
  }

  setDirection(direction: DirectionType) {
    this._direction.add(direction);
  }

  nextIndex() {
    const direction = this._direction.peek();
    let { row, col } = Grid.get2dIdx(this._headId);

    // Allow to teleport between the edges
    if (direction.isLeft && col === 0) col = Grid.COLS;
    if (direction.isRight && col === Grid.COLS - 1) col = -1;
    if (direction.isUp && row === 0) row = Grid.ROWS;
    if (direction.isDown && row === Grid.ROWS - 1) row = -1;

    const move = {
      Left: { row, col: col - 1 },
      Right: { row, col: col + 1 },
      Up: { row: row - 1, col },
      Down: { row: row + 1, col },
    };

    return move[direction.value];
  }

  removeTail(grid: Grid) {
    // Do not remove Snake block while snacks in the stomach 🤪
    if (this._snacksToDigest > 0) return this._snacksToDigest--;
    // Get and remove 1st item from set of Blocks
    const [tailIndex] = this._linearBlockIdx;
    this._linearBlockIdx.delete(tailIndex);
    const { row, col } = Grid.get2dIdx(tailIndex);
    const block = grid.blocks[row][col];
    if (block) block.updateAsEmpty();
  }

  appendHead(grid: Grid) {
    if (!this.canMove(grid)) return;
    const next = this.nextIndex();
    const linearIdx = Grid.getLinearIdx(next.row, next.col);
    this._linearBlockIdx.add(linearIdx);
    this._headId = linearIdx;
    this._headBlock?.setIsHead(false);
    this._headBlock = grid.blocks?.[next.row]?.[next.col];
    this._headBlock.setIsHead(true);
    this._direction.removeLast();
  }

  canMove(grid: Grid) {
    const next = this.nextIndex();
    const nextBlock = grid.blocks?.[next.row]?.[next.col];
    if (!nextBlock) {
      Logger.debug('Player cannot move. Reason:' + this._status, this._id);
      this._status = PlayerStatus.Idle;
      return false;
    }

    if (nextBlock.isBody()) this._status = PlayerStatus.KilledInAction;
    if (nextBlock.isWall()) this._status = PlayerStatus.KilledInAction;

    return !(nextBlock.isBody() || nextBlock.isWall());
  }

  nextBlock(grid: Grid) {
    const next = this.nextIndex();
    return grid.blocks?.[next.row]?.[next.col];
  }

  blockIndices() {
    return this._linearBlockIdx;
  }
}
