import { Block } from '../components/Block.js';
import { Direction, DirectionType } from './components/Direction.js';
import { Nullable } from '../types.js';
import { Speed } from './components/Speed.js';
import { Point } from './components/Point.js';
import { Grid } from '../components/Grid.js';

export enum Status {
  Alive,
  Killed,
  Accident,
  Idle,
  Ad,
  OutOfMap,
  HitByWall,
}

export class Player {
  /**
   * @callback Callback
   * @param {{size?: Number, stopped?: Boolean}} [length] - Broadcast data
   * @returns {void}
   */

  private readonly _initialBlocks: number[] = [];
  private readonly _grid: Grid;
  private readonly _speed: Speed;

  /** Head color */
  private readonly _color: string;
  /** Snake points */
  private readonly _point: Point;
  /** Snake name */
  private readonly _name: string = 'DEFAULT';

  private _blocks = new Set<number>();
  /** @type {Callback} */
  private _callback: Nullable<Callback> = null;
  private _blockHeadIdx: number = 0;
  private _blockHeadRef: Nullable<Block> = null;
  private _status = Status.Alive;
  private _accelerate = false;
  private _snacksToDigest = 0;
  private _direction: Direction;

  /** Determines when to tick next */
  private _lastUpdate = 0;

  /** Whether Snake can move */
  private _enabled = true;

  constructor(blocks: number[], grid: Grid, speed: Speed, point: Point, color: string, name: string) {
    if (blocks.length === 0) throw new Error(`blocks are empty`);

    this._grid = grid;
    this._speed = speed;
    this._point = point;
    this._initialBlocks = Array.from(blocks);
    this._blocks = new Set(blocks);
    this._lastUpdate = 0;
    this._color = color;
    this._name = name;
    this._direction = new Direction();
    this._blockHeadIdx = blocks.at(-1)!;
    this._blockHeadRef = this._grid.getBlockByLinearId(this._blockHeadIdx);
    this._direction = new Direction();
    this._accelerate = false;

    this._start();
  }

  get isEnabled() {
    return this._enabled;
  }

  get isDisabled() {
    return !this._enabled;
  }

  get isBot() {
    return false;
  }

  get color() {
    return this._color;
  }

  get name() {
    return this._name;
  }

  get speed() {
    return this._speed;
  }

  get points() {
    return this._point;
  }

  get headId() {
    return this._blockHeadIdx;
  }

  get blocks() {
    return this._blocks;
  }

  get status() {
    return this._status;
  }

  get direction() {
    return this._direction?.peek();
  }

  get accelerateRequested() {
    return this._accelerate;
  }

  stop() {
    this._enabled = false;
    if (typeof this._callback === 'function') this._callback({ stopped: true });
  }

  _start() {
    this._enabled = true;
  }

  needsUpdate(currentTick: number) {
    const delta = currentTick - this._lastUpdate;
    if (delta > this.speed.current) {
      this._lastUpdate = currentTick;
      return true;
    }

    return false;
  }

  increaseSpeed() {
    this._accelerate = true;
  }

  decreaseSpeed() {
    this._accelerate = false;
  }

  /**
   * @param {Number} [weight = 1] - Food weight, 1 = 1 Block
   */
  addTailBlock(weight = 1) {
    this._snacksToDigest += weight;
    if (typeof this._callback === 'function') this._callback({ size: this._blocks.size + weight });
  }

  /** @returns {{row: Number, col: Number}} */
  nextIndex() {
    const direction = this._direction.peek();
    let { row, col } = this._grid.get2dIdx(this._blockHeadIdx);

    {
      // Allow to teleport between the edges
      if (direction === DirectionType.Left && col === 0) col = this._grid.col;
      if (direction === DirectionType.Right && col === this._grid.col - 1) col = -1;
      if (direction === DirectionType.Up && row === 0) row = this._grid.row;
      if (direction === DirectionType.Down && row === this._grid.row - 1) row = -1;
    }

    const move: Record<DirectionType, { row: number; col: number }> = {
      LEFT: { row, col: col - 1 },
      RIGHT: { row, col: col + 1 },
      UP: { row: row - 1, col },
      DOWN: { row: row + 1, col },
    };

    return move[direction];
  }

  private _setDirection(direction: DirectionType) {
    this._direction.add(direction);
  }

  goLeft(debug = false) {
    if (debug) console.debug('GoLeft requested');
    this._setDirection(DirectionType.Left);
  }

  goRight(debug = false) {
    if (debug) console.debug('GoLeft requested');
    this._setDirection(DirectionType.Right);
  }

  goUp(debug = false) {
    if (debug) console.debug('GoLeft requested');
    this._setDirection(DirectionType.Up);
  }

  goDown(debug = false) {
    if (debug) console.debug('GoLeft requested');
    this._setDirection(DirectionType.Down);
  }

  headingLeft() {
    return this.direction === DirectionType.Left;
  }

  headingRight() {
    return this.direction === DirectionType.Right;
  }

  headingUp() {
    return this.direction === DirectionType.Up;
  }

  headingDown() {
    return this.direction === DirectionType.Down;
  }

  /**
   * @description Iterates over Snake Blocks
   * @return {Generator<Block|null, void, *>}
   */
  *[Symbol.iterator]() {
    for (const idx of this._blocks) {
      yield this._grid.getBlockByLinearId(idx)!;
    }
  }

  removeTail(): void {
    // Do not remove Snake block while snacks in the stomach 🤪
    if (this._snacksToDigest > 0) {
      this._snacksToDigest--;
      return void 0;
    }
    // Get and remove 1st item from set of Blocks
    const [tailIndex] = this._blocks;
    this._blocks.delete(tailIndex);
    const block = this._grid.getBlockByLinearId(tailIndex);
    if (block) block.updateAsEmpty();
  }

  appendHead() {
    if (!this.canMove()) return;
    const next = this.nextIndex();
    const linearIdx = this._grid.getLinearIdx(next.row, next.col);
    this._blocks.add(linearIdx);
    this._blockHeadIdx = linearIdx;
    if (this._blockHeadRef) this._blockHeadRef.updateAsBody();
    this._blockHeadRef = this._grid.getBlockByLinearId(linearIdx);
    if (!this._blockHeadRef) throw new Error(`Unable to get getBlockByLinearId(${linearIdx})`);
    this._blockHeadRef.updateAsHead();
    this._direction.removeLast();
  }

  removeBlockByIdx(idx: number) {
    return this._blocks.delete(idx);
  }

  /**
   * @description It determines whether next move is possible or the snake bumps into an object
   * @returns {boolean} */
  canMove() {
    const next = this.nextIndex();
    const nextBlock = this._grid.getBlockByXY(next.row, next.col);
    if (!nextBlock) {
      this._status = Status.OutOfMap;
      return false;
    }

    if (nextBlock.isBody()) this._status = Status.Killed;
    if (nextBlock.isWall()) this._status = Status.HitByWall;

    return !(nextBlock.isBody() || nextBlock.isWall());
  }

  /** @param {Callback} fn */
  onBroadcast(fn: Callback) {
    this._callback = fn;
  }

  /**
   * @returns {Block|null}
   */
  nextBlock() {
    const next = this.nextIndex();
    return this._grid.getBlockByXY(next.row, next.col);
  }

  reset() {
    this._blocks = new Set(this._initialBlocks);
    this._blockHeadIdx = this._initialBlocks.at(-1)!;
    if (!this._blockHeadIdx) throw new Error(`initialBlocks are empty`);
    this._blockHeadRef = this._grid.getBlockByLinearId(this._blockHeadIdx);
    this._direction = new Direction();
    this._accelerate = false;
    this._speed.reset();
    this._start();
    if (typeof this._callback === 'function') this._callback({ size: this._blocks.size });
  }
}

type Callback = (delay: number | { stopped: boolean } | { size: number }) => void;
