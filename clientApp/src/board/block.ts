export enum BlockType {
  Empty = 'Empty',
  Food = 'Food',
  Wall = 'Wall',
  Body = 'Body',
}

export enum BlockColor {
  Empty = '#556677',
  Food = '#11816d',
  Wall = '#1e2121',
  // Body is dynamic
}

export default class Block {
  private readonly _index;

  constructor(index: number, defaultType: BlockType = BlockType.Empty) {
    this._index = index;
    this._type = defaultType;
  }

  private _color: string = BlockColor.Empty;

  get color() {
    return this._color;
  }

  private _type: BlockType;

  get type() {
    return this._type;
  }

  get isEmpty() {
    return this._type === BlockType.Empty;
  }

  get isFood() {
    return this._type === BlockType.Food;
  }

  get isWall() {
    return this._type === BlockType.Wall;
  }

  get isBody() {
    return this._type === BlockType.Body;
  }

  get index() {
    return this._index;
  }

  updateAsFood() {
    this.setType(BlockType.Food);
    this._color = BlockColor.Food;
  }

  updateAsBody(color: string) {
    this.setType(BlockType.Body);
    this._color = color;
  }

  updateAsWall() {
    this.setType(BlockType.Wall);
    this._color = BlockColor.Wall;
  }

  updateAsEmpty() {
    this.setType(BlockType.Empty);
    this._color = BlockColor.Empty;
  }

  reset() {
    this._type = BlockType.Empty;
    this._color = BlockColor.Empty;
  }

  private setType(type: BlockType) {
    this._type = type;
  }
}
