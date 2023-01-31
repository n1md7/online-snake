import { Expose, Type } from 'class-transformer';

export enum BlockType {
  Empty = 'empty',
  Food = 'food',
  Wall = 'wall',
  Body = 'body',
}

export enum BlockExtraType {
  Bump = 'Bump',
}

export class Block {
  @Type(() => String) private _type = BlockType.Empty;
  @Type(() => String) private _extraType: BlockExtraType = null;
  @Type(() => Boolean) private _isHead = false;

  get isHead() {
    return this._isHead;
  }

  @Type(() => String) private _y = 0;
  @Expose() get y() {
    return this._y;
  }

  set y(val: number) {
    this._y = val;
  }

  @Type(() => String) private _x = 0;
  @Expose() get x() {
    return this._x;
  }

  set x(val: number) {
    this._x = val;
  }

  setType(_type: BlockType) {
    this._type = _type;
  }

  setIsHead(state) {
    this._isHead = state;
  }

  updateAsEmpty() {
    this.setType(BlockType.Empty);
  }

  updateAsBody() {
    this.setType(BlockType.Body);
  }

  updateAsFood() {
    this.setType(BlockType.Food);
  }

  updateAsBump() {
    this._extraType = BlockExtraType.Bump;
  }

  isBody() {
    return this._type === BlockType.Body;
  }

  isWall() {
    return this._type === BlockType.Wall;
  }

  isFood() {
    return this._type === BlockType.Food;
  }

  serialize() {
    return {
      x: this._x,
      y: this._y,
      isHead: this._isHead,
      type: this._type,
    };
  }
}
