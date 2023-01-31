export class Block {
  static type = Object.freeze({
    Empty: 'empty',
    Food: 'food',
    Wall: 'wall',
    Body: 'body',
    Head: 'head',
  });
  static extraType = Object.freeze({
    Bump: 'bump',
  });

  /** @type {Block.type | null} */
  #type = null;
  /** @type {Block.extraType | null} */
  #extraType = null;
  /** @type {Number | ''} */
  #index = '';
  /** @type {HTMLElement | null} */
  #block = null;
  /** @type {GameUI | null} */
  #gameUI = null;
  /** @type {Boolean} */
  #isHead = false;
  /** @type {Number} */
  #blockWH = 10;
  /** @type {String} */
  #color;
  /** @type {Boolean} */
  #colorHasApplied = false;

  /**
   * @param {GameUI} gameUI
   * @param {Number} blockWH
   * @param {Block.type} [type = Block.type.Empty]
   *
   * @returns Block
   */
  constructor(gameUI, blockWH, type = Block.type.Empty) {
    this.#gameUI = gameUI;
    this.#type = type;
    this.#blockWH = blockWH;

    this.#create();
  }

  /**
   * @returns {Number} Linear index on the Grid
   */
  get index() {
    return this.#index;
  }

  #create() {
    this.#block = document.createElement('div');
    this.#block.style.setProperty('width', this.#blockWH + 'px');
    this.#block.style.setProperty('height', this.#blockWH + 'px');
    this.#block.style.setProperty('line-height', this.#blockWH + 'px');
    this.#block.classList.add('block');
  }

  /**
   * @param {Number} idx
   */
  setDataIdx(idx) {
    this.#block.setAttribute('data-idx', idx + '');
  }

  /** @param {Block.type} type */
  setType(type) {
    this.#type = type;
  }

  /** @param {Number} index */
  setIndex(index) {
    this.#index = index;
  }

  /** @param {String} color */
  setBackgroundColor(color) {
    this.#color = color;
    this.#colorHasApplied = false;
  }

  /** @param {Boolean} state */
  setIsHead(state) {
    this.#isHead = state;
  }

  updateAsEmpty() {
    this.setType(Block.type.Empty);
    this.update();
  }

  updateAsBody() {
    this.setType(Block.type.Body);
    this.update();
  }

  updateAsFood() {
    this.setType(Block.type.Food);
    this.update();
  }

  updateAsBump() {
    this.#extraType = Block.extraType.Bump;
    this.update();
  }

  isBody() {
    return this.#type === Block.type.Body;
  }

  isWall() {
    return this.#type === Block.type.Wall;
  }

  isFood() {
    return this.#type === Block.type.Food;
  }

  update() {
    this.#block.classList.remove(
      Block.type.Empty,
      Block.type.Food,
      Block.type.Wall,
      Block.type.Body,
      Block.type.Head,
      Block.extraType.Bump,
    );
    // this.#block.innerText = this.#index;
    if (this.#isHead) this.#block.classList.add(Block.type.Head);

    if (this.#colorHasApplied) this.#block.style.removeProperty('background-color');
    if (this.#color && !this.#colorHasApplied) {
      this.#block.style.setProperty('background-color', this.#color);
      this.#color = null;
      this.#colorHasApplied = true;
    }

    if (this.#type === Block.type.Empty) this.#block.classList.add(Block.type.Empty);
    else if (this.#type === Block.type.Wall) this.#block.classList.add(Block.type.Wall);
    else if (this.#type === Block.type.Food) this.#block.classList.add(Block.type.Food);
    else if (this.#type === Block.type.Body) this.#block.classList.add(Block.type.Body);
    if (this.#extraType === Block.extraType.Bump) return this.#block.classList.add(Block.extraType.Bump);
  }

  render() {
    this.update();
    this.#gameUI.appendBlock(this.#block);
  }
}
