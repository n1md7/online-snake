import {Food} from "./Food.mjs";
import {MathUtils} from "./utils/MathUtils.mjs";
import {Bot} from "./Bot.mjs";

export class Game {
  /** @type {Number} */
  #fps = 60;
  /** @type {Number} */
  #lastTick;
  /** @type {Number} */
  #interval;
  /** @type {Boolean} */
  #ended = false;
  /** @type {Boolean} */
  #won = false;
  /** @type {Boolean} */
  #lost = false;
  /** @type {Grid} */
  #grid;
  /** @type {Snake} */
  #player;
  /** @type {Snake} */
  #actionTarget;
  /** @type {Snake[]} */
  #bots;
  /** @type {GameUI} */
  #canvas;
  /** @type {Food} */
  #food;
  /** @type {Number} */
  #pointToWin = 1;

  /**
   * @param {Grid} grid
   * @param {Snake} player
   * @param {GameUI} canvas
   * @param {Food} food
   * @param {Snake[]} bots
   */
  constructor(grid, player, canvas, food, bots) {
    this.#grid = grid;
    this.#player = player;
    this.#canvas = canvas;
    this.#interval = 1000 / this.#fps;
    this.#lastTick = 0;
    this.#food = food;
    this.#bots = bots;
  }

  get isEnded() {
    return this.#ended;
  }

  get isWon() {
    return this.#won;
  }

  get isLost() {
    return this.#lost;
  }

  get level() {
    return this.#grid.level;
  }

  /**
   * @param {Number} points
   */
  setPointsToWin(points) {
    this.#pointToWin = points
  }

  /** @param {Snake} snake */
  setWon(snake) {
    this.#won = true;
    this.#actionTarget = snake;
    this.setEnded();
  }

  /** @param {Snake | Bot} snake */
  setLost(snake) {
    if (snake.isBot) {
      console.log(`${snake.name} has fallen on the battlefield - 😞`);
      return snake.stop();
    }
    // Or evaluate player
    this.#lost = true;
    this.#actionTarget = snake;
    this.setEnded();
  }

  setEnded() {
    this.#ended = true;
  }

  reset() {
    this.#won = false;
    this.#ended = false;
    this.#lost = false;
    this.#actionTarget = null;
    this.#grid.reset();
    this.#player.reset();
    this.#canvas.reset();
    this.#bots.forEach(bot => bot.reset());
  }

  /** @param {Number} level */
  setLevel(level) {
    this.#grid.setLevel(level);
  }

  run() {
    this.#updateOnce();
    this.#loop();
  }

  /** @param {Number} [currentTick = 0] */
  #loop(currentTick = 0) {
    if (this.#update(currentTick)) return void 0;
    window.requestAnimationFrame(this.#loop.bind(this));
  }

  /**
   * @description Initial update, runs only once per start/reset.
   */
  #updateOnce() {
    this.#food.generate();
  }

  /** @param {Number} currentTick */
  #update(currentTick) {
    for (const snake of [this.#player, ...this.#bots]) {
      if (snake.isDisabled) {
        this.#turnFleshIntoFood(snake);
        continue;
      }
      if (this.#pointToWin === snake.points.point) this.setWon(snake);
      if (snake.needsUpdate(currentTick)) {
        if (!snake.canMove()) this.setLost(snake);
        if (this.#ended) {
          if (this.#won) this.#handleGameWon();
          if (this.#lost) this.#handleGameLost();
          return true; // Signal to Exit
        }

        this.#handleSnakeSpeed(snake);
        this.#handleSnakeEatFood(snake);
        this.#handleSnakeRender(snake);
      }
    }
  }

  /** @param {Snake} snake */
  #handleSnakeSpeed(snake) {
    if (snake.accelerateRequested) {
      return snake.speed.increase();
    }
    snake.speed.decrease();
  }

  /** @param {Snake} snake */
  #handleSnakeEatFood(snake) {
    if (this.#food.ids.has(snake.headId)) {
      this.#food.ids.delete(snake.headId);
      this.#food.generate(1);
      snake.points.increment();
      snake.addTailBlock();
      this.#handleSnakeEatsBotFlesh(snake.headId);
    }
  }

  /** @param {Number} targetId */
  #handleSnakeEatsBotFlesh(targetId) {
    // NOTE: no player data is involved here.
    for (const bot of this.#bots) {
      if (bot.isDisabled) {
        for (const piece of bot) {
          if (targetId === piece.index) {
            bot.removeBlockByIdx(piece.index);
          }
        }
      }
    }
  }

  /** @param {Snake} snake */
  #handleSnakeRender(snake) {
    snake.removeTail();
    snake.appendHead();
    for (const block of snake) {
      block.updateAsBody();
    }
  }

  #handleGameLost() {
    console.log(`Snake "${this.#actionTarget.name}" has LOST`, 'cause:', this.#actionTarget.status);
    this.#canvas.showLooser();
    const nextBlock = this.#actionTarget.nextBlock();
    if (nextBlock) nextBlock.updateAsBump();
  }

  #handleGameWon() {
    alert(`Winner is ${this.#actionTarget.name}`)
    this.#canvas.showWinner();
  }

  /** @param {Snake} snake */
  #turnFleshIntoFood(snake) {
    for (const piece of snake) {
      this.#food.drop(piece.index);
      piece.setIsHead(false);
      piece.updateAsFood();
    }
  }

  /** @param {Snake} snake */
  #removeDead(snake) {
    const idx = this.#bots.findIndex((bot) => bot.id === snake.id);
    if (idx > -1) this.#bots.splice(idx, 1);
  }
}
