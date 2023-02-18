import * as PIXI from 'pixi.js';

enum Type {
  Body = 'BODY',
  Head = 'Head',
  Food = 'Food',
  Wall = 'Wall',
  Empty = 'Empty',
}

export class Block extends PIXI.Container {
  public static SIZE = 20;

  private readonly _x: number;
  private readonly _y: number;
  private readonly _block = new PIXI.Graphics();

  private _type: Type = Type.Empty;

  constructor(y: number, x: number) {
    super();
    this._x = x;
    this._y = y;

    this.draw(y, x);
  }

  private draw(y: number, x: number, color = 0x1099bb) {
    this._block.beginFill(color);
    this._block.lineStyle(1, 0xffbd01, 1);
    this._block.drawRoundedRect(x, y, Block.SIZE, Block.SIZE, 1);
    this._block.endFill();

    this.addChild(this._block);
  }

  isBody() {
    return this._type === Type.Body;
  }

  isHead() {
    return this._type === Type.Head;
  }

  isEmpty() {
    return this._type === Type.Empty;
  }

  isFood() {
    return this._type === Type.Food;
  }

  isWall() {
    return this._type === Type.Wall;
  }

  updateAsBody() {
    const _ = '#da3219';
    this._type = Type.Body;
    this.removeChildren();
    this.draw(this._y, this._x, 0xda3219);
  }

  updateAsHead() {
    const _ = '#ff72ff';
    this._type = Type.Head;
    this.removeChildren();
    this.draw(this._y, this._x, 0xff72ff);
  }

  updateAsEmpty() {
    this._type = Type.Empty;
    this.removeChildren();
    this.draw(this._y, this._x);
  }

  updateAsFood() {
    const _ = '#2d0220';
    this._type = Type.Food;
    this.removeChildren();
    this.draw(this._y, this._x, 0x2d0220);
  }

  updateAsWall() {
    const _ = '#111111';
    this._type = Type.Wall;
    this.removeChildren();
    this.draw(this._y, this._x, 0x111111);
  }
}
