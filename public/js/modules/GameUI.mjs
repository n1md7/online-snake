export class GameUI {
  /** @type {HTMLElement} */
  #canvas;

  /**
   * @param {HTMLElement} canvas
   * @param {Number} width
   * @param {Number} height
   * */
  constructor(canvas,/* width, height*/) {
    this.#canvas = canvas;
    // this.setDimensions(width, height);
  }

  /**
   * @param {Number} width
   * @param {Number} height
   */
  setDimensions(width, height){
    this.#canvas.style.setProperty('width', width + 'px');
    this.#canvas.style.setProperty('height', height + 'px');
  }

  showWinner() {
    this.#canvas.style.borderColor = 'rgba(74,255,2,0.54)';
  }

  showLooser() {
    this.#canvas.style.borderColor = 'rgba(255,2,2,0.54)';
  }

  /**
   * @param {HTMLElement} block
   */
  appendBlock(block){
    this.#canvas.appendChild(block);
  }

  clearBlocks(){
    this.#canvas.innerHTML = null;
  }

  reset() {
    this.#canvas.style.borderColor = 'rgba(90, 134, 20, 0.3)';
  }
}
