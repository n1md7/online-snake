import { ReactiveController, ReactiveControllerHost } from 'lit';
import { gameObserver } from '/src/observers/game.observer';
import { CanvasView } from '/src';
import Board from '/src/board/board';
import Player from '/src/player/player';
import GameService from '/src/services/game.service';
import EventEmitter from 'eventemitter2';

export class GameController implements ReactiveController {
  private readonly host: ReactiveControllerHost & CanvasView;
  private board!: Board;
  private players!: Player[];
  private game!: GameService;
  private observer!: EventEmitter;

  constructor(host: ReactiveControllerHost & CanvasView) {
    this.host = host;
    this.observer = gameObserver;

    host.addController(this);
  }

  getGrid() {
    return this.board;
  }

  hostConnected() {
    // Let's populate Board/Grid beforehand
    this.board = new Board(this.host.rows, this.host.cols);
    this.observer.once('game:started', () => this.initialize());

    console.info('Host subscribed!');
  }

  hostDisconnected() {
    console.info('Host unsubscribed!');
    this.game.unsubscribe();
  }

  hostUpdate() {}

  hostUpdated() {
    // console.log('host updated');
  }

  gameLoop(currentTick = 0): void {
    const signal = this.update(currentTick);
    if (signal === 'stop') return void 0;
    if (signal === 'continue') this.host.requestUpdate();

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  update(currentTick: number) {
    for (const player of this.players) {
      if (!player.isAlive) continue;

      if (player.needsUpdate(currentTick)) {
        if (this.game.ended) return 'stop'; // Signal to Exit

        player.tick();
      }
    }

    return 'continue';
  }

  private initialize() {
    const player = new Player(this.board).addInitialBlocks([0, 1, 2, 3, 4, 5, 6]);
    // @ts-ignore
    window.player = player;
    const rivals = [
      new Player(this.board, 'blue').addInitialBlocks([300, 301, 302]),
      new Player(this.board, 'purple').addInitialBlocks([600, 601, 602]),
    ];
    this.game = new GameService(player, rivals);
    this.players = [player, ...rivals];

    this.game.subscribe();
    this.gameLoop();

    // TODO: This should be done in a better way
    for (const [idx, player] of this.players.entries()) {
      const status = this.host.players[idx];
      player.speed.on('change', (speed: number) => {
        status.speed = +Number(1000 / speed).toFixed(2);
      });
    }
  }
}
