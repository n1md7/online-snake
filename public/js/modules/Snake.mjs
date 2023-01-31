import {Grid} from "./Grid.mjs";
import {Direction} from "./Direction.mjs";
import {MathUtils} from "./utils/MathUtils.mjs";

export class Snake {
  static Status = {
    Active: 'Active',
    DeadByWall: 'DeadByWall',
    DeadByBody: 'DeadByBody',
    DeadByMapOverflow: 'DeadByMapOverflow',
  };
  /** @typedef {Set<Number>} Blocks */

  /** @type {Number[]}*/
  #initialBlocks = [];
  /** @type {Blocks}*/
  #blocks = new Set();
  /** @type {Direction} */
  #direction = null;
  /** @type {Grid} */
  #grid = null;
  /** @type {Speed} */
  #speed = null;
  /** @type {Number} */
  #blockHeadIdx;
  /** @type {Block} */
  #blockHeadRef;
  /** @type {Snake.Status} */
  #status = Snake.Status.Active;
  /** @type {Boolean} */
  #accelerate = false;
  /** @type {Number} */
  #snacksToDigest = 0;

  /**
   * @callback Callback
   * @param {Number} length - Current length
   * @returns {void}
   */

  /** @type {Callback} */
  #callback;
  /** @type {Number} - determines when to tick next */
  #lastUpdate;
  /** @type {String} - Head color */
  #color;
  /** @type {Point} - Snake points */
  #point;
  /** @type {String} - Snake name */
  #name;
  /** @type {String} - Snake unique identifier */
  #id;
  /** @type {Boolean} - Whether Snake can move */
  #enabled = true;

  /**
   * @param {Number[]} blocks
   * @param {Grid} grid
   * @param {Speed} speed
   * @param {Point} point
   * @param {String} color
   * @param {String} name
   */
  constructor(blocks, grid, speed, point, color, name) {
    this.#id = this.#randomId();
    this.#grid = grid;
    this.#speed = speed;
    this.#point = point;
    this.#initialBlocks = Array.from(blocks);
    this.#lastUpdate = 0;
    this.#color = color;
    this.#name = name;

    this.reset();
  }

  get id() {
    return this.#id;
  }

  get isEnabled() {
    return this.#enabled;
  }

  get isDisabled() {
    return !this.#enabled;
  }

  get isBot() {
    return false;
  }

  get color() {
    return this.#color;
  }

  get name() {
    return this.#name;
  }

  get speed() {
    return this.#speed;
  }

  get points() {
    return this.#point;
  }

  get headId() {
    return this.#blockHeadIdx;
  }

  get blocks() {
    return this.#blocks;
  }

  get status() {
    return this.#status;
  }

  /** @returns {Direction.Type} */
  get direction() {
    return this.#direction.peek();
  }

  get accelerateRequested() {
    return this.#accelerate;
  }

  stop() {
    this.#enabled = false;
  }

  #start() {
    this.#enabled = true;
  }

  /** @param {Number} currentTick */
  needsUpdate(currentTick) {
    const delta = currentTick - this.#lastUpdate;
    if (delta > this.speed.current) {
      this.#lastUpdate = currentTick;
      return true;
    }

    return false;
  }

  increaseSpeed() {
    this.#accelerate = true;
  }

  decreaseSpeed() {
    this.#accelerate = false;
  }

  /**
   * @param {Number} [weight = 1] - Food weight, 1 = 1 Block
   */
  addTailBlock(weight = 1) {
    this.#snacksToDigest += weight;
    if (typeof this.#callback === 'function') this.#callback(this.#blocks.size + weight);
  }

  /** @return {string} */
  #randomId() {
    return MathUtils.getRandomInt(0, 9e12) + ':' + Date.now();
  }

  /** @returns {{row: Number, col: Number}} */
  nextIndex() {
    const direction = this.#direction.peek();
    let {row, col} = this.#grid.get2dIdx(this.#blockHeadIdx);

    {
      // Allow to teleport between the edges
      if (direction === Direction.Type.Left && col === 0) col = this.#grid.col;
      if (direction === Direction.Type.Right && col === this.#grid.col - 1) col = -1;
      if (direction === Direction.Type.Up && row === 0) row = this.#grid.row;
      if (direction === Direction.Type.Down && row === this.#grid.row - 1) row = -1;
    }

    const move = {
      Left: {row, col: col - 1},
      Right: {row, col: col + 1},
      Up: {row: row - 1, col},
      Down: {row: row + 1, col},
    };

    return move[direction];
  }

  /** @param {Direction.Type} direction */
  #setDirection(direction) {
    this.#direction.add(direction);
  }

  goLeft() {
    this.#setDirection(Direction.Type.Left);
  }

  goRight() {
    this.#setDirection(Direction.Type.Right);
  }

  goUp() {
    this.#setDirection(Direction.Type.Up);
  }

  goDown() {
    this.#setDirection(Direction.Type.Down);
  }

  /**
   * @description Iterates over Snake Blocks
   * @return {Generator<Block|null, void, *>}
   */
  * [Symbol.iterator]() {
    for (const idx of this.#blocks) {
      yield this.#grid.getBlockByLinearId(idx);
    }
  }

  removeTail() {
    // Do not remove Snake block while snacks in the stomach 🤪
    if (this.#snacksToDigest > 0) return this.#snacksToDigest--;
    // Get and remove 1st item from set of Blocks
    const [tailIndex] = this.#blocks;
    this.#blocks.delete(tailIndex);
    const block = this.#grid.getBlockByLinearId(tailIndex);
    if (block) block.updateAsEmpty();
  }

  appendHead() {
    if (!this.canMove()) return;
    const next = this.nextIndex();
    const linearIdx = this.#grid.getLinearIdx(next.row, next.col);
    this.#blocks.add(linearIdx);
    this.#blockHeadIdx = linearIdx;
    this.#blockHeadRef.setIsHead(false);
    this.#blockHeadRef = this.#grid.getBlockByLinearId(linearIdx);
    this.#blockHeadRef.setIsHead(true);
    this.#blockHeadRef.setBackgroundColor(this.#color);
    this.#direction.removeLast();
  }

  removeBlockByIdx(idx) {
    return this.#blocks.delete(idx);
  }

  /**
   * @description It determines whether next move is possible or the snake bumps into an object
   * @returns {boolean} */
  canMove() {
    const next = this.nextIndex();
    const nextBlock = this.#grid.getBlockByXY(next.row, next.col);
    if (!nextBlock) {
      this.#status = Snake.Status.DeadByMapOverflow;
      return false;
    }

    if (nextBlock.isBody()) this.#status = Snake.Status.DeadByBody;
    if (nextBlock.isWall()) this.#status = Snake.Status.DeadByWall;

    return !(nextBlock.isBody() || nextBlock.isWall());
  }

  /** @param {Callback} fn */
  onBroadcast(fn) {
    this.#callback = fn;
  }

  /**
   * @returns {Block|null}
   */
  nextBlock() {
    const next = this.nextIndex();
    return this.#grid.getBlockByXY(next.row, next.col);
  }

  reset() {
    this.#blocks = new Set(this.#initialBlocks);
    this.#blockHeadIdx = this.#initialBlocks.at(-1);
    this.#blockHeadRef = this.#grid.getBlockByLinearId(this.#blockHeadIdx);
    this.#direction = new Direction();
    this.#accelerate = false;
    this.#speed.reset();
    this.#start();
    if (typeof this.#callback === 'function') this.#callback(this.#blocks.size);
  }
}
