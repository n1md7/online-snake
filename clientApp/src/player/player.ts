import Speed from '/src/player/components/Speed';
import Counter from '/src/player/components/Counter';
import EventEmitter from 'eventemitter2';
import Board from '/src/board/board';
import Direction from '/src/player/components/Direction';
import { DoublyLinkedList } from '/src/utils/data-structures/doubly-linked-list';
import { Socket } from 'socket.io-client';

export enum Status {
  Alive,
  Idle,
  Ad,
  KilledByPlayer,
  KilledBySelf,
  KilledByWall,
}

export default class Player extends EventEmitter {
  public index = 0;

  private readonly _board: Board;
  private readonly _speed: Speed;
  private readonly _color: string;
  private readonly _points: Counter;
  private readonly _direction: Direction;
  private readonly _foodToDigest: Counter;
  private readonly _body: DoublyLinkedList<number>;

  private _status = Status.Alive;
  private _accelerate = false;
  private _lastUpdate = 0;
  // private _enabled = true;
  private _uuid!: string;
  private _socket!: Socket;

  constructor(board: Board, color = '#c93f3f') {
    super();
    this._board = board;
    this._color = color;
    this._body = new DoublyLinkedList<number>();
    this._foodToDigest = new Counter(0);
    this._points = new Counter(0);
    this._direction = new Direction();
    this._speed = new Speed();
  }

  get body() {
    return this._body;
  }

  get uuid() {
    return this._uuid;
  }

  private _name = 'John Doe';

  get name() {
    return this._name;
  }

  get isAlive() {
    return this._status === Status.Alive;
  }

  get points() {
    return this._points;
  }

  get speed() {
    return this._speed;
  }

  setUuid(uuid: string) {
    this._uuid = uuid;
  }

  setName(name: string) {
    this._name = name;

    return this;
  }

  setSocket(socket: Socket) {
    this._socket = socket;

    return this;
  }

  /**
   * Initial blocks for player body
   * @param blocks - Expects linear block ids
   */
  addInitialBlocks(blocks: number[]) {
    for (const block of blocks) this._body.push(block);

    return this;
  }

  overrideBlocks(blocks: number[]) {
    // Reset player body values on Board
    for (const blockIdx of this._body) {
      this._board.getBlockByIdx(blockIdx).updateAsEmpty();
    }
    // Remove old values
    this._body.reset();
    // Update Grid values
    for (const block of blocks) this._body.push(block);

    return this;
  }

  blocksMatch(blocks: number[]) {
    let bid = -1;
    for (const id of this._body) {
      if (id !== blocks[++bid]) return false;
    }
    return true;
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

  /** @param {Number} [count = 1] - Food count/weight, 1 = 1 Block */
  prependTail(count = 1) {
    this._foodToDigest.add(count);
  }

  appendHead() {
    const head = this.nextIndex();
    this._body.push(head);
    this._direction.removeLast();

    return head;
  }

  removeTail() {
    // Do not remove Snake block while snacks in the stomach 🤪
    if (this._foodToDigest.valueOf()) return this._foodToDigest.decrement();
    // Get and remove 1st item from set of Blocks
    return this._body.shift();
  }

  nextIndex() {
    const headIdx = this._body.back()!;

    // Allow to teleport between the edges
    if (this._direction.isLeft) {
      const isFirstColumn = headIdx % this._board.cols === 0;
      if (isFirstColumn) return headIdx + this._board.cols - 1;
      return headIdx - 1;
    }

    if (this._direction.isRight) {
      const isLastColumn = headIdx % this._board.cols === this._board.cols - 1;
      if (isLastColumn) return headIdx - this._board.cols + 1;
      return headIdx + 1;
    }

    if (this._direction.isUp) {
      const isFirstRow = headIdx >= 0 && headIdx < this._board.cols;
      if (isFirstRow) return headIdx + (this._board.rows - 1) * this._board.cols;
      return headIdx - this._board.cols;
    }

    if (this._direction.isDown) {
      const size = this._board.rows * this._board.cols;
      const isLastRow = headIdx >= size - this._board.cols && headIdx < size;
      if (isLastRow) return headIdx % this._board.cols;
      return headIdx + this._board.cols;
    }

    throw new Error('Should never happen!');
  }

  tick() {
    // TODO add throttle
    this._accelerate ? this._speed.increase() : this._speed.decrease();

    const tail = this.removeTail()!;
    const head = this.appendHead()!;

    this._board.resetBlock(tail);

    for (const body of this._body) {
      this._board.getBlockByIdx(body).updateAsBody(this._color);
    }
    // Just to set different color
    this._board.getBlockByIdx(head).updateAsBody('#123456');
  }

  goLeft() {
    this._direction.emit('go:left');
    if (this._socket) {
      this._socket.emit('player:direction', {
        playerId: this._uuid,
        direction: 'Left',
      });
    }
  }

  goRight() {
    this._direction.emit('go:right');
    if (this._socket) {
      this._socket.emit('player:direction', {
        playerId: this._uuid,
        direction: 'Right',
      });
    }
  }

  goUp() {
    this._direction.emit('go:up');
    if (this._socket) {
      this._socket.emit('player:direction', {
        playerId: this._uuid,
        direction: 'Up',
      });
    }
  }

  goDown() {
    this._direction.emit('go:down');
    if (this._socket) {
      this._socket.emit('player:direction', {
        playerId: this._uuid,
        direction: 'Down',
      });
    }
  }
}
